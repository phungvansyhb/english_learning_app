'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { PartOfSpeech, Word } from '@/lib/types';
import { DEFAULT_PART_ID, PART_OF_SPEECH_OPTIONS } from '@/lib/words-data';
import { Modal } from '@/components/admin/modal';
import { Field } from '@/components/ui/field';

function emptyWord(): Word { return { id: '', part_id: DEFAULT_PART_ID, word: '', ipa: '', audio_us: null, audio_uk: null, image_url: null, meanings: [{ pos: 'noun', meaning: '', example: '' }], phrases: [], synonyms: [], order_index: 0, difficulty_level: 1 }; }
interface Props { open: boolean; word: Word | null; onClose: () => void; onSave: (word: Word) => void; }

export function WordFormModal({ open, word, onClose, onSave }: Props) {
	const { register, control, handleSubmit, reset, formState: { errors } } = useForm<Word>({ defaultValues: emptyWord() });
	const meanings = useFieldArray({ control, name: 'meanings' });
	const phrases = useFieldArray({ control, name: 'phrases' as never });
	const synonyms = useFieldArray({ control, name: 'synonyms' as never });
	useEffect(() => { if (open) reset(word ? structuredClone(word) : emptyWord()); }, [open, word, reset]);
	const isEditing = Boolean(word);
	const submit = (draft: Word) => {
		const cleaned = { ...draft, id: draft.id || crypto.randomUUID(), word: draft.word.trim(), ipa: draft.ipa.trim(), audio_us: draft.audio_us?.trim() || null, audio_uk: draft.audio_uk?.trim() || null, image_url: draft.image_url?.trim() || null, meanings: draft.meanings.map((m) => ({ ...m, meaning: m.meaning.trim(), example: m.example.trim() })).filter((m) => m.meaning), phrases: draft.phrases.map((p) => p.trim()).filter(Boolean), synonyms: draft.synonyms.map((s) => s.trim()).filter(Boolean) };
		if (cleaned.meanings.length) onSave(cleaned); else return;
	};
	return <Modal open={open} onClose={onClose} title={isEditing ? 'Edit word' : 'Add new word'} description={isEditing ? `Update the details for "${word?.word}".` : 'Create a new vocabulary entry.'}>
		<form onSubmit={handleSubmit(submit)} className='flex min-h-0 flex-1 flex-col'><div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'><Field label='Word' placeholder='access' error={errors.word} {...register('word', { required: 'Word is required.' })} /><Field label='IPA' placeholder='UK: /ˈækses/ | US: /ˈækses/' error={errors.ipa} {...register('ipa')} /></div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'><Field label='Audio UK' placeholder='https://…' {...register('audio_uk')} /><Field label='Audio US' placeholder='https://…' {...register('audio_us')} /></div>
			<section className='flex flex-col gap-3'><div className='flex items-center justify-between'><h3 className='text-sm font-bold'>Meanings</h3><button type='button' onClick={() => meanings.append({ pos: 'noun', meaning: '', example: '' })} className='inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold'><Plus className='size-3.5' />Add meaning</button></div>{meanings.fields.map((item, index) => <div key={item.id} className='rounded-2xl border border-border bg-secondary/40 p-3'><div className='grid grid-cols-1 gap-3 sm:grid-cols-[8rem_1fr_auto]'><Field label='Part of speech' {...register(`meanings.${index}.pos` as const)}><select>{PART_OF_SPEECH_OPTIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}</select></Field><Field label='Meaning' placeholder='truy cập' error={errors.meanings?.[index]?.meaning} {...register(`meanings.${index}.meaning` as const, { required: 'Meaning is required.' })} /><button type='button' onClick={() => meanings.remove(index)} aria-label='Remove meaning' className='mt-6 flex size-11 items-center justify-center rounded-xl hover:bg-destructive/10'><Trash2 className='size-4' /></button></div><Field label='Example' className='mt-3' {...register(`meanings.${index}.example` as const)}><textarea /></Field></div>)}</section>
			<ListEditor title='Phrases' fields={phrases.fields} append={() => (phrases.append as (value: string) => void)('')} remove={phrases.remove} register={register} name='phrases' placeholder='access the system: truy cập hệ thống' /><ListEditor title='Synonyms' fields={synonyms.fields} append={() => (synonyms.append as (value: string) => void)('')} remove={synonyms.remove} register={register} name='synonyms' placeholder='reach: tiếp cận' />
		</div><div className='flex justify-end gap-3 border-t border-border px-6 py-4'><button type='button' onClick={onClose} className='h-11 rounded-full px-5 text-sm font-semibold hover:bg-secondary'>Cancel</button><button type='submit' className='h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground'>{isEditing ? 'Save changes' : 'Create word'}</button></div></form>
	</Modal>;
}

function ListEditor({ title, fields, append, remove, register, name, placeholder }: { title: string; fields: Array<{ id: string }>; append: () => void; remove: (index: number) => void; register: ReturnType<typeof useForm<Word>>['register']; name: 'phrases' | 'synonyms'; placeholder: string }) { return <section className='flex flex-col gap-3'><div className='flex items-center justify-between'><h3 className='text-sm font-bold'>{title}</h3><button type='button' onClick={append} className='inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold'><Plus className='size-3.5' />Add</button></div>{fields.map((item, index) => <div key={item.id} className='flex gap-2'><Field label={`${title} ${index + 1}`} className='flex-1' placeholder={placeholder} {...register(`${name}.${index}` as const)} /><button type='button' onClick={() => remove(index)} aria-label={`Remove ${title.toLowerCase()} item`} className='mt-6 flex size-11 items-center justify-center rounded-xl'><Trash2 className='size-4' /></button></div>)}</section>; }
