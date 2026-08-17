'use client';
import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CheckIcon, XIcon } from 'lucide-react';
import { Option } from '@/lib/types';
import clsx from 'clsx';

type ComboboxOption = Option & {
	__isNew?: boolean;
};

type Props = {
	label: string;
	placeholder?: string;
	notFoundLabel?: string;
	items: Option[];
	isMultiple?: boolean;
	defaultValue?: string | string[] | null;
	value?: string | string[] | null;
	onValueChange?: (value: string | string[] | null) => void;
	creatable?: boolean;
	onCreate?: (value: string) => string | void;
	createLabel?: (value: string) => string;
};

function getItemLabel(items: Option[], value: string) {
	return items.find((item) => String(item.value) === value)?.label ?? value;
}

function toSelectedOption(items: Option[], value: string | null | undefined): Option | null {
	if (value == null) {
		return null;
	}

	return { label: getItemLabel(items, value), value };
}

function toSelectedOptions(items: Option[], value: string[] | null | undefined): Option[] {
	if (!value) {
		return [];
	}

	return value.map((item) => ({ label: getItemLabel(items, item), value: item }));
}

export default function Combobox(props: Props) {
	const id = React.useId();
	const [inputValue, setInputValue] = React.useState('');
	const isControlled = props.value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string | string[] | null>(
		props.defaultValue ?? (props.isMultiple ? [] : null),
	);
	const value = isControlled ? props.value : internalValue;
	const selectedValue = React.useMemo(() => {
		if (props.isMultiple) {
			return toSelectedOptions(props.items, Array.isArray(value) ? value : []);
		}

		return toSelectedOption(props.items, Array.isArray(value) ? value[0] : (value ?? null));
	}, [props.isMultiple, props.items, value]);

	const createItemLabel = React.useCallback(
		(query: string) => props.createLabel?.(query) ?? `Create "${query}"`,
		[props.createLabel],
	);

	const trimmedInput = inputValue.trim();
	const containsMatchingOption = React.useMemo(() => {
		if (!trimmedInput) {
			return false;
		}
		const lowerQuery = trimmedInput.toLowerCase();
		return props.items.some(
			(item) =>
				item.label.toLowerCase() === lowerQuery ||
				String(item.value).toLowerCase() === lowerQuery,
		);
	}, [props.items, trimmedInput]);

	const combinedItems = React.useMemo<ComboboxOption[]>(() => {
		if (!props.creatable || !trimmedInput || containsMatchingOption) {
			return props.items;
		}
		return [
			...props.items,
			{
				label: createItemLabel(trimmedInput),
				value: trimmedInput,
				__isNew: true,
			},
		];
	}, [props.creatable, props.items, trimmedInput, containsMatchingOption, createItemLabel]);

	const updateValue = React.useCallback(
		(nextValue: string | string[] | null) => {
			if (!isControlled) {
				setInternalValue(nextValue);
			}
			props.onValueChange?.(nextValue);
		},
		[isControlled, props.onValueChange],
	);

	const resolveCreatedOption = React.useCallback(
		(value: string) => props.onCreate?.(value) ?? value,
		[props.onCreate],
	);

	const isCreateOption = React.useCallback(
		(item: Option | ComboboxOption | null | undefined): item is ComboboxOption =>
			Boolean(item && (item as ComboboxOption).__isNew),
		[],
	);

	const handleValueChange = React.useCallback(
		(nextValue: Option | Option[] | null) => {
			if (props.isMultiple && Array.isArray(nextValue)) {
				const createOption = nextValue.find(isCreateOption);
				if (createOption) {
					const resolved = resolveCreatedOption(createOption.label);
					updateValue([
						...nextValue
							.filter((item) => !isCreateOption(item))
							.map((item) => String(item.value)),
						String(resolved),
					]);
					setInputValue('');
					return;
				}
				updateValue(nextValue.map((item) => String(item.value)));
				return;
			} else if (
				!props.isMultiple &&
				nextValue &&
				!Array.isArray(nextValue) &&
				isCreateOption(nextValue)
			) {
				updateValue(String(resolveCreatedOption(nextValue.label)));
				setInputValue('');
				return;
			}
			updateValue(nextValue && !Array.isArray(nextValue) ? String(nextValue.value) : null);
		},
		[props.isMultiple, isCreateOption, resolveCreatedOption, updateValue],
	);

	const handleInputKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (
				event.key !== 'Enter' ||
				!props.creatable ||
				!trimmedInput ||
				containsMatchingOption
			) {
				return;
			}

			event.preventDefault();
			const created = String(resolveCreatedOption(trimmedInput));
			const nextValue = props.isMultiple
				? [...(Array.isArray(value) ? value : []), created]
				: created;
			updateValue(nextValue);
			setInputValue('');
		},
		[
			containsMatchingOption,
			props.creatable,
			props.isMultiple,
			resolveCreatedOption,
			trimmedInput,
			updateValue,
			value,
		],
	);

	const ComboBoxInput = React.useCallback(() => {
		if (props.isMultiple) {
			return (
				<BaseCombobox.Chips className='flex w-full h-full flex-wrap items-center gap-1'>
					<BaseCombobox.Value>
						{(value: Option[]) => (
							<React.Fragment>
								{value.map((language) => (
									<BaseCombobox.Chip
										key={language.value}
										className='inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent'
										aria-label={language.label}>
										{language.label}
										<BaseCombobox.ChipRemove
											className='flex size-4 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit hover:bg-accent group-focus-within:hover:bg-neutral-700'
											aria-label={`Remove ${language.label}`}>
											<XIcon />
										</BaseCombobox.ChipRemove>
									</BaseCombobox.Chip>
								))}
								<BaseCombobox.Input
									id={id}
									placeholder={props.placeholder || 'Placeholder'}
									onKeyDown={handleInputKeyDown}
									className='min-h-11 h-full w-full border-0 bg-white pl-2 dark:bg-neutral-950 text-sm any-pointer-coarse:text-base font-normal text-neutral-950 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 dark:text-white'
								/>
							</React.Fragment>
						)}
					</BaseCombobox.Value>
				</BaseCombobox.Chips>
			);
		} else {
			return (
				<>
					<BaseCombobox.Input
						placeholder={props.placeholder || 'placeholder'}
						id={id}
						onKeyDown={handleInputKeyDown}
						className='min-h-11 h-full w-full border-0 bg-white pl-2 dark:bg-neutral-950 text-sm any-pointer-coarse:text-base font-normal text-neutral-950 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 dark:text-white '
					/>
					<div className='absolute right-0 bottom-0 flex h-full items-center justify-center text-neutral-500 dark:text-neutral-400'>
						<BaseCombobox.Clear
							className='BaseCombobox-clear flex h-full w-6 items-center justify-center border-0 bg-transparent p-0 text-neutral-950 dark:text-white'
							aria-label='Clear selection'>
							<XIcon size={12} />
						</BaseCombobox.Clear>
						<BaseCombobox.Trigger
							className='flex h-6 w-6 items-center justify-center border-0 bg-transparent p-0 dark:text-white'
							aria-label='Open popup'>
							<CaretDownIcon />
						</BaseCombobox.Trigger>
					</div>
				</>
			);
		}
	}, [props.isMultiple, id, props.placeholder, handleInputKeyDown, inputValue]);

	return (
		<BaseCombobox.Root
			items={combinedItems}
			multiple={props.isMultiple}
			value={selectedValue as any}
			onValueChange={handleValueChange as any}
			inputValue={inputValue}
			onInputValueChange={(nextValue) => setInputValue(String(nextValue))}
			itemToStringLabel={(item: Option) => item.label}
			itemToStringValue={(item: Option) => String(item.value)}>
			<div className='relative flex flex-col text-sm leading-5 font-bold text-neutral-950 dark:text-white'>
				<label
					htmlFor={id}
					className={clsx(
						'block text-xs font-semibold text-foreground',
						props.label && 'mb-1',
					)}>
					{props.label}
				</label>
				<BaseCombobox.InputGroup className='min-h-11 h-max w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground has-focus:border-ring has-focus:ring-3 has-focus:ring-ring/30 relative'>
					{ComboBoxInput()}
				</BaseCombobox.InputGroup>
			</div>

			<BaseCombobox.Portal>
				<BaseCombobox.Positioner
					className='outline-none z-70'
					sideOffset={4}>
					<BaseCombobox.Popup className='w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) border bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0_rgb(0_0_0/12%)] transition-[scale,opacity] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none rounded'>
						<BaseCombobox.Empty>
							<div className='py-4 pr-4 pl-2 text-sm leading-4 text-neutral-500 dark:text-neutral-400'>
								{props.notFoundLabel || 'Not Found'}
							</div>
						</BaseCombobox.Empty>
						<BaseCombobox.List className='max-h-[min(22.5rem,var(--available-height))] overflow-y-auto overscroll-contain py-1 scroll-py-1 outline-0 data-empty:p-0'>
							{(item: Option) => (
								<BaseCombobox.Item
									key={item.value}
									value={item}
									className='grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 p-2 text-sm leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white data-highlighted:before:absolute data-highlighted:before:inset-0 data-highlighted:before:z-[-1] data-highlighted:before:bg-neutral-950 dark:data-highlighted:text-neutral-950 dark:data-highlighted:before:bg-white'>
									<BaseCombobox.ItemIndicator className='col-start-1'>
										<CheckIcon size={14} />
									</BaseCombobox.ItemIndicator>
									<span className='col-start-2'>{item.label}</span>
								</BaseCombobox.Item>
							)}
						</BaseCombobox.List>
					</BaseCombobox.Popup>
				</BaseCombobox.Positioner>
			</BaseCombobox.Portal>
		</BaseCombobox.Root>
	);
}
function CaretDownIcon(props: React.ComponentProps<'svg'>) {
	return (
		<svg
			width='16'
			height='16'
			viewBox='0 0 16 16'
			fill='currentColor'
			{...props}
			style={{ display: 'block', ...props.style }}>
			<path d='M12 6H4l4 4.5z' />
		</svg>
	);
}
