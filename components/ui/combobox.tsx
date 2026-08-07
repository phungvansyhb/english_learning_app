'use client';
import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import { Option } from '@/lib/types';

type Props = {
	label: string;
	placeholder?: string;
	notFoundLabel?: string;
	items: Option[];
	isMultiple?: boolean;
};

export default function Combobox(props: Props) {
	const id = React.useId();

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
									placeholder={props.placeholder || 'placeholder'}
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
						className='h-full w-full border-0 bg-white pl-2 dark:bg-neutral-950 text-sm any-pointer-coarse:text-base font-normal text-neutral-950 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 dark:text-white'
					/>
					<div className='absolute right-0 bottom-0 flex h-full items-center justify-center text-neutral-500 dark:text-neutral-400'>
						<BaseCombobox.Clear
							className='BaseCombobox-clear flex h-full w-6 items-center justify-center border-0 bg-transparent p-0 text-neutral-950 dark:text-white'
							aria-label='Clear selection'>
							<XIcon />
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
	}, [props.isMultiple]);

	return (
		<BaseCombobox.Root
			items={props.items}
			multiple={props.isMultiple}>
			<div className='relative flex flex-col gap-1 text-sm leading-5 font-bold text-neutral-950 dark:text-white'>
				<label
					htmlFor={id}
					className="'mb-1.5 block text-xs font-semibold text-foreground'">
					{props.label}
				</label>
				<BaseCombobox.InputGroup className='min-h-11 h-max w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 relative'>
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
