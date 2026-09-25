'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WandSparkles } from 'lucide-react';
import { z } from 'zod';

import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/ui/field';
import TopicSelect from '@/components/admin/topic-select';
import { generateWord } from '@/services/aidictionary';
import { createTopic } from '@/services/master-data';

const schema = z.object({
	topicId: z.string().min(1, 'Topic is required'),
	wordNumber: z.number().int().min(1, 'Enter at least 1 word').max(24, 'Maximum is 24 words'),
});

type FormData = z.infer<typeof schema>;

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function GenerateWordModal({ open, onClose, onSuccess }: Props) {
	const [isPending, startTransition] = useTransition();
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setError,
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { topicId: '', wordNumber: 12 },
	});

	function close() {
		if (isPending) return;
		reset();
		onClose();
	}

	function submit(data: FormData) {
		startTransition(async () => {
			try {
				await generateWord(Number(data.topicId), data.wordNumber);
				reset();
				onSuccess();
			} catch (error) {
				setError('root.apiError', {
					type: 'server',
					message: error instanceof Error ? error.message : 'Unable to generate words',
				});
			}
		});
	}

	return (
		<Modal
			open={open}
			onClose={close}
			closeOnOutsideClick={false}
			title='Generate words'
			description='Choose a topic and let AI create vocabulary entries for it.'
			className='w-xl'>
			<form
				onSubmit={handleSubmit(submit)}
				className='space-y-5 px-6 py-5'>
				<Controller
					name='topicId'
					control={control}
					render={({ field, fieldState }) => (
						<Field
							label='Topic'
							error={fieldState.error}>
							<TopicSelect
								label=''
								placeholder='Select or create a topic'
								creatable
								value={field.value}
								onValueChange={(value) =>
									field.onChange(
										Array.isArray(value) ? (value[0] ?? '') : (value ?? ''),
									)
								}
								onCreate={async (v) => {
									const match = v.match(/^create\s+(['"])(.*?)\1$/i);
									const topicName = match?.[2]?.trim() ?? v.trim();
									const topic = await createTopic({ name: topicName });
									return String(topic.id);
								}}
							/>
						</Field>
					)}
				/>

				<Field
					label='Number of words (1-24)'
					type='number'
					min={1}
					max={24}
					error={errors.wordNumber}
					{...register('wordNumber', { valueAsNumber: true })}
				/>

				{errors.root?.apiError && (
					<p className='text-sm text-destructive'>{errors.root.apiError.message}</p>
				)}

				<div className='flex justify-end gap-3 pt-2'>
					<button
						type='button'
						onClick={close}
						disabled={isPending}
						className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50'>
						Cancel
					</button>
					<button
						type='submit'
						disabled={isPending}
						className='inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60'>
						<WandSparkles className='size-4' />
						{isPending ? 'Generating...' : 'Generate words'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
