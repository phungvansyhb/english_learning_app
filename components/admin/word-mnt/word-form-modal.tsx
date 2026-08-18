'use client';

import { useEffect, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { PARTS_OF_SPEECH, type PartOfSpeech, type Word } from '@/lib/types';
import { PART_OF_SPEECH_OPTIONS } from '@/lib/words-data';
import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/ui/field';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

const schema = z.object({
	word: z.string().trim().min(1, 'Word is required'),
	ipa_uk: z.string().trim().min(1, 'Ipa_uk is required'),
	ipa_us: z.string().trim().min(1, 'Ipa_us is required'),
	topic_id: z.string({ error: 'Topic is required' }),
	difficulty_id: z.string({ error: 'Difficulty level is required' }),
	meanings: z
		.array(
			z.object({
				part_of_speech: z.enum(PARTS_OF_SPEECH),
				meaning: z.string().trim().min(1, 'Meaning is required'),
				example: z.string().optional(),
				example_meaning: z.string().optional(),
				is_primary_use: z.boolean(),
			}),
		)
		.min(1, 'Meaning is required'),
	collocations: z.array(
		z.object({
			phrase: z.string().trim(),
			meaning_vi: z.string().trim(),
		}),
	),
	relations: z.array(
		z.object({
			relation_type: z.enum(['SYNNONYMS', 'ATONYMS']),
			word: z.string().trim(),
			meaning: z.string().trim(),
		}),
	),
});
type FormData = z.infer<typeof schema>;

interface Props {
	open: boolean;
	word: FormData | null;
	onClose: () => void;
	onSuccess: () => void;
}

export function WordFormModal({ open, word, onClose, onSuccess }: Props) {
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
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const meanings = useFieldArray({ control, name: 'meanings' });
	const collocations = useFieldArray({ control, name: 'collocations' });
	const relations = useFieldArray({ control, name: 'relations' });

	// useEffect(() => {
	// 	if (open) reset(word ? structuredClone(word) : emptyWord());
	// }, [open, word, reset]);

	const isEditing = Boolean(word);

	const submit = (data: FormData) => {
		startTransition(async () => {
			try {
				// call API
				onSuccess();
			} catch (error) {
				setError('root.apiError', { type: 'server', message: String(error) });
			}
		});
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={isEditing ? 'Edit word' : 'Add new word'}
			description={
				isEditing
					? `Update the details for "${word?.word}".`
					: 'Create a new vocabulary entry.'
			}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
						<Field
							label='Word'
							placeholder='access'
							error={errors.word}
							{...register('word', { required: 'Word is required.' })}
						/>
						<Field
							label='IPA_US'
							placeholder='ipa_us'
							error={errors.ipa_us}
							{...register('ipa_us')}
						/>
						<Field
							label='IPA_UK'
							placeholder='ipa_uk'
							error={errors.ipa_uk}
							{...register('ipa_uk')}
						/>
					</div>

					<section className='flex flex-col gap-3'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-bold'>Meanings</h3>
							<Button
								type='button'
								variant='secondary'
								onClick={() =>
									meanings.append({
										part_of_speech: 'noun',
										meaning: '',
										example_meaning: '',
										is_primary_use: false,
										example: '',
									})
								}>
								<Plus className='size-3.5' />
								Add meaning
							</Button>
						</div>

						{meanings.fields.map((item, index) => (
							<div
								key={item.id}
								className='rounded-2xl border border-border bg-secondary/40 p-8 relative animate-in fade-in-10 duration-100 '>
								<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
									<Field
										label='Part of speech'
										{...register(`meanings.${index}.part_of_speech` as const)}>
										<select>
											{PART_OF_SPEECH_OPTIONS.map((pos) => (
												<option
													key={pos}
													value={pos}>
													{pos}
												</option>
											))}
										</select>
									</Field>
									<Field
										label='Meaning'
										placeholder='Nghĩa'
										error={errors.meanings?.[index]?.meaning}
										{...register(`meanings.${index}.meaning` as const, {
											required: 'Meaning is required.',
										})}
									/>
									<Field
										label='Example'
										placeholder='ví dụ'
										{...register(`meanings.${index}.example` as const)}
									/>

									<Field
										label='Example Meaning'
										placeholder='Ý nghĩa của ví dụ'
										error={errors.meanings?.[index]?.example_meaning}
										{...register(`meanings.${index}.example_meaning` as const, {
											required: 'Meaning is required.',
										})}
									/>
									<Button
										type='button'
										variant='destructive'
										size='icon-lg'
										onClick={() => meanings.remove(index)}
										aria-label='Remove meaning'
										className='absolute right-2 top-2'>
										<Trash2 className='size-4' />
									</Button>
								</div>
							</div>
						))}
					</section>
				</div>
				<div className='flex justify-end gap-3 border-t border-border px-6 py-4'>
					<button
						type='button'
						onClick={onClose}
						className='h-11 rounded-full px-5 text-sm font-semibold hover:bg-secondary'>
						Cancel
					</button>
					<button
						type='submit'
						className='h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground'>
						{isEditing ? 'Save changes' : 'Create word'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
