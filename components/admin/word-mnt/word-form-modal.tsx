'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import type { PartOfSpeech, Word, WordMeaning } from '@/lib/types';
import { DEFAULT_PART_ID, PART_OF_SPEECH_OPTIONS } from '@/lib/words-data';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/admin/modal';
import Combobox from '@/components/ui/combobox';

const fieldClass =
	'h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30';

const labelClass = 'mb-1.5 block text-xs font-semibold text-foreground';

function emptyWord(): Word {
	return {
		id: '',
		part_id: DEFAULT_PART_ID,
		word: '',
		ipa: '',
		audio_us: null,
		audio_uk: null,
		image_url: null,
		meanings: [{ pos: 'noun', meaning: '', example: '' }],
		phrases: [],
		synonyms: [],
		order_index: 0,
		difficulty_level: 1,
	};
}

interface WordFormModalProps {
	open: boolean;
	word: Word | null;
	onClose: () => void;
	onSave: (word: Word) => void;
}

export function WordFormModal({ open, word, onClose, onSave }: WordFormModalProps) {
	const [draft, setDraft] = useState<Word>(emptyWord());
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setDraft(word ? structuredClone(word) : emptyWord());
			setError(null);
		}
	}, [open, word]);

	const isEditing = Boolean(word);

	function update<K extends keyof Word>(key: K, value: Word[K]) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	function updateMeaning(index: number, patch: Partial<WordMeaning>) {
		setDraft((prev) => ({
			...prev,
			meanings: prev.meanings.map((m, i) => (i === index ? { ...m, ...patch } : m)),
		}));
	}

	function addMeaning() {
		setDraft((prev) => ({
			...prev,
			meanings: [...prev.meanings, { pos: 'noun', meaning: '', example: '' }],
		}));
	}

	function removeMeaning(index: number) {
		setDraft((prev) => ({
			...prev,
			meanings: prev.meanings.filter((_, i) => i !== index),
		}));
	}

	function updateList(key: 'phrases' | 'synonyms', index: number, value: string) {
		setDraft((prev) => ({
			...prev,
			[key]: prev[key].map((item, i) => (i === index ? value : item)),
		}));
	}

	function addListItem(key: 'phrases' | 'synonyms') {
		setDraft((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
	}

	function removeListItem(key: 'phrases' | 'synonyms', index: number) {
		setDraft((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!draft.word.trim()) {
			setError('Word is required.');
			return;
		}
		const cleaned: Word = {
			...draft,
			id: draft.id || crypto.randomUUID(),
			word: draft.word.trim(),
			ipa: draft.ipa.trim(),
			audio_us: draft.audio_us?.trim() || null,
			audio_uk: draft.audio_uk?.trim() || null,
			image_url: draft.image_url?.trim() || null,
			meanings: draft.meanings
				.map((m) => ({ ...m, meaning: m.meaning.trim(), example: m.example.trim() }))
				.filter((m) => m.meaning),
			phrases: draft.phrases.map((p) => p.trim()).filter(Boolean),
			synonyms: draft.synonyms.map((s) => s.trim()).filter(Boolean),
		};
		if (cleaned.meanings.length === 0) {
			setError('Add at least one meaning.');
			return;
		}
		onSave(cleaned);
	}

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
				onSubmit={handleSubmit}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					{/* Basics */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div>
							<label
								className={labelClass}
								htmlFor='word'>
								Word
							</label>
							<input
								id='word'
								className={fieldClass}
								value={draft.word}
								onChange={(e) => update('word', e.target.value)}
								placeholder='access'
							/>
						</div>
						<div>
							<label
								className={labelClass}
								htmlFor='ipa'>
								IPA
							</label>
							<input
								id='ipa'
								className={fieldClass}
								value={draft.ipa}
								onChange={(e) => update('ipa', e.target.value)}
								placeholder='UK: /ˈækses/ | US: /ˈækses/'
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
						<div className='col-span-2'>
							<Combobox
								label='Difficulty'
								items={[
									{ value: 1, label: '300 esstional' },
									{ value: 2, label: '600 medium' },
								]}
								isMultiple
								placeholder='Select difficulty'
								creatable
							/>
						</div>

						<div>
							<label
								className={labelClass}
								htmlFor='audio_uk'>
								Audio UK
							</label>
							<input
								id='audio_uk'
								className={fieldClass}
								value={draft.audio_uk ?? ''}
								onChange={(e) => update('audio_uk', e.target.value)}
								placeholder='https://…'
							/>
						</div>
						<div>
							<label
								className={labelClass}
								htmlFor='audio_us'>
								Audio US
							</label>
							<input
								id='audio_us'
								className={fieldClass}
								value={draft.audio_us ?? ''}
								onChange={(e) => update('audio_us', e.target.value)}
								placeholder='https://…'
							/>
						</div>
					</div>

					{/* Meanings */}
					<section className='space-y-3'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-bold text-foreground'>Meanings</h3>
							<button
								type='button'
								onClick={addMeaning}
								className='inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent'>
								<Plus className='size-3.5' /> Add meaning
							</button>
						</div>
						{draft.meanings.map((meaning, index) => (
							<div
								key={index}
								className='rounded-2xl border border-border bg-secondary/40 p-3'>
								<div className='flex gap-3'>
									<div className='w-32 shrink-0'>
										<label className={labelClass}>Part of speech</label>
										<select
											className={fieldClass}
											value={meaning.pos}
											onChange={(e) =>
												updateMeaning(index, {
													pos: e.target.value as PartOfSpeech,
												})
											}>
											{PART_OF_SPEECH_OPTIONS.map((pos) => (
												<option
													key={pos}
													value={pos}>
													{pos}
												</option>
											))}
										</select>
									</div>
									<div className='flex-1'>
										<label className={labelClass}>Meaning</label>
										<input
											className={fieldClass}
											value={meaning.meaning}
											onChange={(e) =>
												updateMeaning(index, { meaning: e.target.value })
											}
											placeholder='truy cập'
										/>
									</div>
									<button
										type='button'
										onClick={() => removeMeaning(index)}
										aria-label='Remove meaning'
										className='mt-6 flex size-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
										<Trash2 className='size-4' />
									</button>
								</div>
								<div className='mt-3'>
									<label className={labelClass}>Example</label>
									<textarea
										className={cn(
											fieldClass,
											'h-auto min-h-16 py-2.5 leading-relaxed',
										)}
										value={meaning.example}
										onChange={(e) =>
											updateMeaning(index, { example: e.target.value })
										}
										placeholder='Authorized users can access the database. (…)'
									/>
								</div>
							</div>
						))}
					</section>

					{/* Phrases + Synonyms */}
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
						<ListEditor
							title='Phrases'
							items={draft.phrases}
							placeholder='access the system: truy cập hệ thống'
							onAdd={() => addListItem('phrases')}
							onChange={(i, v) => updateList('phrases', i, v)}
							onRemove={(i) => removeListItem('phrases', i)}
						/>
						<ListEditor
							title='Synonyms'
							items={draft.synonyms}
							placeholder='reach: tiếp cận'
							onAdd={() => addListItem('synonyms')}
							onChange={(i, v) => updateList('synonyms', i, v)}
							onRemove={(i) => removeListItem('synonyms', i)}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between gap-3 border-t border-border px-6 py-4'>
					<p
						className='text-sm text-destructive'
						role='alert'>
						{error}
					</p>
					<div className='flex gap-3'>
						<button
							type='button'
							onClick={onClose}
							className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
							Cancel
						</button>
						<button
							type='submit'
							className='h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
							{isEditing ? 'Save changes' : 'Create word'}
						</button>
					</div>
				</div>
			</form>
		</Modal>
	);
}

interface ListEditorProps {
	title: string;
	items: string[];
	placeholder: string;
	onAdd: () => void;
	onChange: (index: number, value: string) => void;
	onRemove: (index: number) => void;
}

function ListEditor({ title, items, placeholder, onAdd, onChange, onRemove }: ListEditorProps) {
	return (
		<section className='space-y-3'>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-bold text-foreground'>{title}</h3>
				<button
					type='button'
					onClick={onAdd}
					className='inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent'>
					<Plus className='size-3.5' /> Add
				</button>
			</div>
			{items.length === 0 && (
				<p className='text-xs text-muted-foreground'>No {title.toLowerCase()} yet.</p>
			)}
			<div className='space-y-2'>
				{items.map((item, index) => (
					<div
						key={index}
						className='flex gap-2'>
						<input
							className={fieldClass}
							value={item}
							onChange={(e) => onChange(index, e.target.value)}
							placeholder={placeholder}
						/>
						<button
							type='button'
							onClick={() => onRemove(index)}
							aria-label={`Remove ${title.toLowerCase()} item`}
							className='flex size-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
							<Trash2 className='size-4' />
						</button>
					</div>
				))}
			</div>
		</section>
	);
}
