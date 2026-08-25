'use client';

import { useEffect, useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { PARTS_OF_SPEECH, type PartOfSpeech } from '@/lib/types';
import { PART_OF_SPEECH_OPTIONS } from '@/lib/words-data';
import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/ui/field';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import DifficultySelect from '@/components/admin/difficulty-select';
import TopicSelect from '@/components/admin/topic-select';
import { createVocabWord } from '@/services/vocab-word';

const schema = z.object({
	word: z.string().trim().min(1, 'Word is required'),
	ipa_uk: z.string().trim().min(1, 'Ipa_uk is required'),
	ipa_us: z.string().trim().min(1, 'Ipa_us is required'),
	topic_id: z.string().min(1, 'Topic is required'),
	difficulty_id: z.string().min(1, 'Difficulty level is required'),
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
			relation_type: z.enum(['SYNONYMS', 'ANTONYMS']),
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

const emptyWord = (): FormData => ({
	word: '',
	ipa_uk: '',
	ipa_us: '',
	topic_id: '',
	difficulty_id: '',
	meanings: [
		{
			part_of_speech: 'noun',
			meaning: '',
			example: '',
			example_meaning: '',
			is_primary_use: true,
		},
	],
	collocations: [],
	relations: [],
});

export function WordFormModal({ open, word, onClose, onSuccess }: Props) {
	const [isPending, startTransition] = useTransition();

	const {
		control,
		reset,
		register,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: emptyWord(),
	});

	const meanings = useFieldArray({ control, name: 'meanings' });
	const collocations = useFieldArray({ control, name: 'collocations' });
	const relations = useFieldArray({ control, name: 'relations' });

	useEffect(() => {
		if (open) {
			reset(word ? structuredClone(word) : emptyWord());
		}
	}, [open, word, reset]);

	const submit = (data: FormData) => {
		startTransition(async () => {
			try {
				await createVocabWord(data);
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
			closeOnOutsideClick={false}
			title={word ? 'Edit word' : 'Add new word'}
			className='w-3xl max-h-[85vh] flex flex-col'
			description={
				word
					? `Update the details for "${word?.word}".`
					: 'Create a new vocabulary entry.'
			}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col overflow-hidden'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5 min-h-0'>
					{/* Basic Word Info */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
						<Field
							label='Word'
							placeholder='e.g. access'
							error={errors.word}
							{...register('word')}
						/>
						<Field
							label='IPA US'
							placeholder='e.g. /ˈækses/'
							error={errors.ipa_us}
							{...register('ipa_us')}
						/>
						<Field
							label='IPA UK'
							placeholder='e.g. /ˈækses/'
							error={errors.ipa_uk}
							{...register('ipa_uk')}
						/>
					</div>

					{/* Topic & Difficulty Selectors */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Controller
							name='topic_id'
							control={control}
							render={({ field, fieldState }) => (
								<Field
									label='Topic'
									error={fieldState.error}>
									<TopicSelect
										placeholder='Select topic'
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

						<Controller
							name='difficulty_id'
							control={control}
							render={({ field, fieldState }) => (
								<Field
									label='Difficulty Level'
									error={fieldState.error}>
									<DifficultySelect
										placeholder='Select difficulty level'
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
					</div>

					{/* Meanings Array */}
					<section className='flex flex-col gap-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-bold text-foreground'>Meanings</h3>
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

						{errors.meanings?.message && (
							<p className='error-text'>{errors.meanings.message}</p>
						)}

						<div className='space-y-4'>
							{meanings.fields.map((item, index) => (
								<div
									key={item.id}
									className='rounded-2xl border border-border bg-secondary/20 p-6 relative animate-in fade-in-10 duration-100'>
									<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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

										<div className='flex items-center pt-6'>
											<label className='flex items-center gap-2 cursor-pointer select-none'>
												<input
													type='checkbox'
													className='rounded border-border text-primary focus:ring-primary size-4 bg-card'
													{...register(`meanings.${index}.is_primary_use` as const)}
												/>
												<span className='text-sm font-medium text-foreground'>Is primary use?</span>
											</label>
										</div>

										<div className='sm:col-span-2'>
											<Field
												label='Meaning'
												placeholder='e.g. truy cập'
												error={errors.meanings?.[index]?.meaning}
												{...register(`meanings.${index}.meaning` as const)}
											/>
										</div>

										<Field
											label='Example English'
											placeholder='e.g. Authorized users can access the database.'
											error={errors.meanings?.[index]?.example}
											{...register(`meanings.${index}.example` as const)}
										/>

										<Field
											label='Example Meaning (VI)'
											placeholder='e.g. Người dùng được ủy quyền có thể truy cập cơ sở dữ liệu.'
											error={errors.meanings?.[index]?.example_meaning}
											{...register(`meanings.${index}.example_meaning` as const)}
										/>

										<Button
											type='button'
											variant='destructive'
											size='icon-lg'
											onClick={() => meanings.remove(index)}
											aria-label='Remove meaning'
											className='absolute right-3 top-3 h-8 w-8 rounded-lg'>
											<Trash2 className='size-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Collocations Array */}
					<section className='flex flex-col gap-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-bold text-foreground'>Collocations</h3>
							<Button
								type='button'
								variant='secondary'
								onClick={() =>
									collocations.append({
										phrase: '',
										meaning_vi: '',
									})
								}>
								<Plus className='size-3.5' />
								Add collocation
							</Button>
						</div>

						<div className='space-y-4'>
							{collocations.fields.map((item, index) => (
								<div
									key={item.id}
									className='rounded-2xl border border-border bg-secondary/20 p-6 relative animate-in fade-in-10 duration-100'>
									<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
										<Field
											label='Phrase'
											placeholder='e.g. access the system'
											error={errors.collocations?.[index]?.phrase}
											{...register(`collocations.${index}.phrase` as const)}
										/>
										<Field
											label='Meaning (VI)'
											placeholder='e.g. truy cập hệ thống'
											error={errors.collocations?.[index]?.meaning_vi}
											{...register(`collocations.${index}.meaning_vi` as const)}
										/>

										<Button
											type='button'
											variant='destructive'
											size='icon-lg'
											onClick={() => collocations.remove(index)}
											aria-label='Remove collocation'
											className='absolute right-3 top-3 h-8 w-8 rounded-lg'>
											<Trash2 className='size-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Relations Array */}
					<section className='flex flex-col gap-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-bold text-foreground'>Relations</h3>
							<Button
								type='button'
								variant='secondary'
								onClick={() =>
									relations.append({
										relation_type: 'SYNONYMS',
										word: '',
										meaning: '',
									})
								}>
								<Plus className='size-3.5' />
								Add relation
							</Button>
						</div>

						<div className='space-y-4'>
							{relations.fields.map((item, index) => (
								<div
									key={item.id}
									className='rounded-2xl border border-border bg-secondary/20 p-6 relative animate-in fade-in-10 duration-100'>
									<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
										<Field
											label='Relation Type'
											{...register(`relations.${index}.relation_type` as const)}>
											<select>
												<option value='SYNONYMS'>Synonym</option>
												<option value='ANTONYMS'>Antonym</option>
											</select>
										</Field>

										<Field
											label='Word'
											placeholder='e.g. reach'
											error={errors.relations?.[index]?.word}
											{...register(`relations.${index}.word` as const)}
										/>

										<Field
											label='Meaning'
											placeholder='e.g. tiếp cận'
											error={errors.relations?.[index]?.meaning}
											{...register(`relations.${index}.meaning` as const)}
										/>

										<Button
											type='button'
											variant='destructive'
											size='icon-lg'
											onClick={() => relations.remove(index)}
											aria-label='Remove relation'
											className='absolute right-3 top-3 h-8 w-8 rounded-lg'>
											<Trash2 className='size-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					</section>
				</div>

				{errors.root?.apiError && (
					<p className='my-2 px-2 error-text text-center text-sm'>{errors.root.apiError.message}</p>
				)}

				<div className='flex justify-end gap-3 border-t border-border px-6 py-4 bg-card shrink-0'>
					<Button
						type='button'
						variant='secondary'
						onClick={onClose}
						>
						Cancel
					</Button>
					<Button
						type='submit'
						variant='default'
						loading={isPending}
						>
						Create word
					</Button>
				</div>
			</form>
		</Modal>
	);
}
