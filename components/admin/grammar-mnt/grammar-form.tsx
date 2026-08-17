import DifficultySelect from '@/components/ui/components/difficulty-select';
import { Field } from '@/components/ui/field';
import { Check } from 'lucide-react';
import React, { useEffect, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import GrammarContentEditor from './grammar-content-editor';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGrammarPoint, updateGrammarPoint } from '@/services/grammar';

type Props = {
	onCancel: () => void;
	onSuccess: () => void;
	initialData?: {
		id: number;
		name: string;
		description?: string | null;
		difficulty_id: number;
		difficulty_label?: string;
		content?: string | null;
	};
};

export default function GrammarForm(props: Props) {
	const optionSchema = z.object({
		label: z.string(),
		value: z.union([z.string(), z.number()]),
	});

	const schema = z.object({
		name: z.string().trim().min(1, 'Name is required'),
		description: z.string().trim().min(1, 'Description is required'),
		difficulty_id: z.string().trim().min(1, 'Difficulty is required'),
		content: z.string().trim(),
	});
	type FormData = z.infer<typeof schema>;

	const [isPending, startTransition] = useTransition();

	const {
		control,
		watch,
		reset,
		setValue,
		register,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			description: '',
			difficulty_id: '',
			content: '',
		},
	});

	useEffect(() => {
		if (!props.initialData) {
			reset({
				name: '',
				description: '',
				difficulty_id: '',
				content: '',
			});
			return;
		}

		reset({
			name: props.initialData.name,
			description: props.initialData.description ?? '',
			difficulty_id: String(props.initialData.difficulty_id),
			content: props.initialData.content ?? '',
		});
	}, [props.initialData, reset]);

	const contentValue = watch('content');

	const onSubmit = (data: FormData) => {
		startTransition(async () => {
			try {
				const payload = {
					name: data.name,
					description: data.description,
					difficulty_id: data.difficulty_id,
					content: data.content,
				};

				if (props.initialData?.id) {
					await updateGrammarPoint(props.initialData.id, payload);
				} else {
					await createGrammarPoint(payload);
				}

				props.onSuccess();
			} catch (error) {
				setError('root.apiError', { type: 'server', message: String(error) });
			}
		});
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-5'>
			<div className='flex-1 gap-5 grid md:grid-cols-[260px_1fr] p-6 overflow-y-auto'>
				<div className='flex flex-col gap-4'>
					<Field
						label='Title'
						error={errors.name}
						placeholder='e.g. Present Simple'
						{...register('name', { required: 'Title is required.' })}
					/>
					<Field
						label='Short description'
						{...register('description')}
						error={errors.description}
						placeholder='Enter short description in 256 words'></Field>
					<Controller
						name='difficulty_id'
						control={control}
						render={({ field, fieldState }) => (
							<Field
								label='Difficulty'
								error={fieldState.error}>
								<DifficultySelect
									placeholder='Select difficult level'
									type='grammar'
									label=''
									value={field.value}
									onValueChange={(value) =>
										field.onChange(
											Array.isArray(value) ? (value[0] ?? '') : (value ?? ''),
										)
									}
								/>
							</Field>
						)}
					/>

					<div className='bg-secondary p-4 rounded-xl text-muted-foreground text-xs leading-5'>
						<p className='font-semibold text-foreground'>Writing tip</p>
						<p className='mt-1'>
							Use a short rule, then add examples learners can reuse in real
							conversations.
						</p>
					</div>
				</div>
				<div className='flex flex-col gap-3 min-w-0'>
					<div className='border border-border rounded-xl overflow-hidden'>
						<GrammarContentEditor
							value={contentValue}
							onChange={(content) => setValue('content', content)}
						/>
					</div>
				</div>
			</div>
			{errors.root?.apiError && (
				<p className='mt-1 error-text text-center'>{errors.root?.apiError.message}</p>
			)}
			<div className='flex justify-end items-center gap-3 bg-secondary/40 px-6 py-4 border-border border-t'>
				<button
					type='button'
					onClick={() => props.onCancel()}
					className='hover:bg-secondary px-4 rounded-xl h-10 font-semibold text-muted-foreground text-sm'>
					Cancel
				</button>
				<button
					type='submit'
					disabled={isPending}
					className='inline-flex items-center gap-2 disabled:opacity-50 bg-primary hover:bg-primary/90 px-4 rounded-xl h-10 font-semibold text-primary-foreground text-sm'>
					<Check className='size-4' />
					{isPending
						? 'Saving...'
						: props.initialData
							? 'Update grammar point'
							: 'Save grammar point'}
				</button>
			</div>
		</form>
	);
}
