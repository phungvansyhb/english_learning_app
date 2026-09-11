'use client';

import { type DictionaryEntry, type DictionaryMeaning, posLabels } from '@/lib/dictionary-data';
import { InsertVocabDataPayload, PartOfSpeech } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
	addWordToCategory,
	checkWordSavedInCate,
	createUserVocabCategory,
	listUserVocabCategories,
	type UserVocabCategoryRow,
} from '@/services/user-vocab-category';
import { BookmarkIcon, ChevronDown, Loader2Icon, Plus, Sparkles, Volume2, X } from 'lucide-react';
import { useEffect, useMemo, useState, useTransition } from 'react';
import ModalCreateCusCate, {
	type CustomerCategoryFormValues,
} from '../vocabulary/customer-category/modal-create-cus-cate';
import MeaningTab from './meaning-tab';

type TabKey = 'meaning' | 'phrases' | 'examples' | 'synonyms' | 'family';

const tabs: { key: TabKey; label: string }[] = [
	{ key: 'meaning', label: 'Nghĩa' },
	{ key: 'phrases', label: 'Cụm từ' },
	{ key: 'examples', label: 'Ví dụ' },
	{ key: 'synonyms', label: 'Đồng nghĩa' },
	{ key: 'family', label: 'Họ từ' },
];

function mapVocabEntry(entry: InsertVocabDataPayload): DictionaryEntry {
	const groups = new Map<string, DictionaryMeaning[]>();

	for (const meaning of entry.meanings ?? []) {
		const pos = meaning.part_of_speech.toLowerCase() as PartOfSpeech;
		const current = groups.get(pos) ?? [];
		current.push({
			meaning: meaning.meaning,
			definition: meaning.meaning,
			examples: meaning.example
				? [{ en: meaning.example, vi: meaning.example_meaning ?? '' }]
				: [],
		});
		groups.set(pos, current);
	}

	return {
		id: entry.id!,
		word: entry.word,
		ipaUs: entry.ipa_us ?? '',
		ipaUk: entry.ipa_uk ?? '',
		groups: Array.from(groups, ([pos, meanings]) => ({
			pos: pos as DictionaryEntry['groups'][number]['pos'],
			meanings,
		})),
		phrases: (entry.collocations ?? []).map((collocation) => ({
			text: collocation.phrase,
			meaning: collocation.meaning_vi,
		})),
		synonyms: (entry.relations ?? [])
			.filter((relation) => relation.relation_type === 'SYNONYMS')
			.map((relation) => relation.word),
		family: [],
	};
}

function speak(text: string, lang = 'en-US') {
	if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang;
	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utterance);
}

export function DictionaryPopup({
	entry,
	onClose,
}: {
	entry: InsertVocabDataPayload;
	onClose: () => void;
}) {
	const displayEntry = mapVocabEntry(entry);
	const [tab, setTab] = useState<TabKey>('meaning');
	const [withExamples, setWithExamples] = useState(true);
	const [categories, setCategories] = useState<UserVocabCategoryRow[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<React.Key | null>(null);
	const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [categoryError, setCategoryError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const isSaved = useMemo(async () => {
		if (selectedCategoryId && entry.id) {
			return await checkWordSavedInCate(selectedCategoryId, entry.word);
		}
		return false;
	}, [selectedCategoryId]);

	useEffect(() => {
		async function loadCategories() {
			setIsCategoriesLoading(true);
			try {
				const data = await listUserVocabCategories();
				setCategories(data);
				setSelectedCategoryId(data[0] ? String(data[0].id) : null);
			} catch (error) {
				setCategoryError(error instanceof Error ? error.message : 'Không thể tải danh mục');
			} finally {
				setIsCategoriesLoading(false);
			}
		}

		void loadCategories();
	}, []);

	const handleSaveWord = async () => {
		if (selectedCategoryId && entry.id) {
			startTransition(async () => {
				await addWordToCategory(selectedCategoryId, entry.id as number);
			});
		} else window.alert('Please select category to insert');
	};

	function openCategoryModal() {
		setCategoryError(null);
		setIsCategoryModalOpen(true);
	}

	function handleCreateCategory(values: CustomerCategoryFormValues) {
		setCategoryError(null);
		startTransition(async () => {
			try {
				const createdCategory = await createUserVocabCategory({
					name: values.name.trim(),
					description: values.description.trim() || null,
				});
				setCategories((current) => [createdCategory, ...current]);
				setSelectedCategoryId(String(createdCategory.id));
				setIsCategoryModalOpen(false);
			} catch (error) {
				setCategoryError(error instanceof Error ? error.message : 'Không thể tạo danh mục');
			}
		});
	}

	return (
		<div className='flex max-h-128 w-88 flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-2xl ring-1 ring-foreground/10'>
			{/* Header */}
			<div className='flex items-start justify-between gap-2 px-4 pt-4'>
				<div className='flex items-center gap-2'>
					<h2 className='text-xl font-bold tracking-tight'>{displayEntry.word}</h2>
					<span className='inline-flex items-center gap-1 rounded-full bg-brand-purple/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground'>
						<Sparkles className='size-3' /> AI-VI
					</span>
				</div>
				<button
					onClick={onClose}
					aria-label='Đóng từ điển'
					className='rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer'>
					<X className='size-4' />
				</button>
			</div>

			{/* Pronunciation */}
			<div className='flex flex-wrap items-center gap-4 px-4 pb-3 pt-1 text-sm text-muted-foreground'>
				<button
					onClick={() => speak(displayEntry.word, 'en-US')}
					className='flex items-center gap-1.5 transition-colors hover:text-foreground'>
					<Volume2 className='size-4 text-primary' />
					<span className='font-medium text-foreground'>US</span> {displayEntry.ipaUs}
				</button>
				<button
					onClick={() => speak(displayEntry.word, 'en-GB')}
					className='flex items-center gap-1.5 transition-colors hover:text-foreground'>
					<Volume2 className='size-4 text-primary' />
					<span className='font-medium text-foreground'>UK</span> {displayEntry.ipaUk}
				</button>
			</div>

			{/* Tabs */}
			<div className='flex items-center gap-1 border-b px-2'>
				{tabs.map((item) => (
					<button
						key={item.key}
						onClick={() => setTab(item.key)}
						className={cn(
							'relative px-2.5 py-2 text-xs font-semibold transition-colors',
							tab === item.key
								? 'text-primary after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary'
								: 'text-muted-foreground hover:text-foreground',
						)}>
						{item.label}
					</button>
				))}
			</div>

			{/* Body */}
			<div className='flex-1 overflow-y-auto px-4 py-3'>
				{tab === 'meaning' && (
					<MeaningTab
						entry={displayEntry}
						withExamples={withExamples}
						setWithExamples={setWithExamples}
					/>
				)}

				{tab === 'phrases' && (
					<ul className='flex flex-col gap-2'>
						{displayEntry.phrases.length ? (
							displayEntry.phrases.map((phrase) => (
								<li
									key={phrase.text}
									className='rounded-xl bg-secondary px-3 py-2.5 text-sm'>
									<span className='font-semibold text-foreground'>
										{phrase.text}
									</span>
									<span className='text-muted-foreground'>
										{' '}
										— {phrase.meaning}
									</span>
								</li>
							))
						) : (
							<EmptyState label='Chưa có cụm từ' />
						)}
					</ul>
				)}

				{tab === 'examples' && (
					<ul className='flex flex-col gap-3'>
						{displayEntry.groups
							.flatMap((group) => group.meanings)
							.flatMap((meaning) => meaning.examples)
							.map((example, index) => (
								<li
									key={index}
									className='rounded-xl bg-secondary px-3 py-2.5 text-sm'>
									<p className='leading-6 text-foreground'>{example.en}</p>
									<p className='mt-1 italic leading-6 text-muted-foreground'>
										{example.vi}
									</p>
								</li>
							))}
					</ul>
				)}

				{tab === 'synonyms' && (
					<div className='flex flex-wrap gap-2'>
						{displayEntry.synonyms.length ? (
							displayEntry.synonyms.map((synonym) => (
								<span
									key={synonym}
									className='rounded-full bg-brand-mint/40 px-3 py-1 text-sm font-medium text-brand-mint-foreground'>
									{synonym}
								</span>
							))
						) : (
							<EmptyState label='Chưa có từ đồng nghĩa' />
						)}
					</div>
				)}

				{tab === 'family' && (
					<ul className='flex flex-col gap-2'>
						{displayEntry.family.length ? (
							displayEntry.family.map((item) => (
								<li
									key={item.word}
									className='flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 text-sm'>
									<span className='font-semibold text-foreground'>
										{item.word}
									</span>
									<span className='text-xs text-muted-foreground'>
										{posLabels[item.pos]}
									</span>
								</li>
							))
						) : (
							<EmptyState label='Chưa có họ từ' />
						)}
					</ul>
				)}
			</div>

			{/* Footer */}
			<div className='border-t bg-muted/40 px-4 py-3'>
				<div className='flex items-center gap-2'>
					<div className='relative flex-1'>
						<select
							value={selectedCategoryId as string}
							onChange={(event) => setSelectedCategoryId(event.target.value)}
							aria-label='Chọn học phần'
							disabled={isCategoriesLoading || isPending}
							className='h-9 w-full appearance-none rounded-lg border bg-card px-3 pr-8 text-sm font-medium text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30'>
							{isCategoriesLoading ? (
								<option value=''>Đang tải học phần...</option>
							) : categories.length === 0 ? (
								<option value=''>Chưa có học phần</option>
							) : (
								categories.map((category) => (
									<option
										key={category.id}
										value={category.id}>
										{category.name}
									</option>
								))
							)}
						</select>
						<ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					</div>
					<button
						type='button'
						className='cursor-pointer inline-flex h-9 items-center gap-1 rounded-lg border px-2.5 text-sm font-medium transition-colors hover:bg-muted'
						onClick={openCategoryModal}>
						<Plus className='size-4' /> Mới
					</button>
					<button
						aria-label='Lưu lại'
						className='inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer'
						onClick={handleSaveWord}>
						{isPending ? (
							<Loader2Icon className='size-4 animate-spin' />
						) : (
							<BookmarkIcon className='size-4' />
						)}
					</button>
				</div>
			</div>
			<ModalCreateCusCate
				open={isCategoryModalOpen}
				onClose={() => !isPending && setIsCategoryModalOpen(false)}
				onSubmit={handleCreateCategory}
				editingCategory={null}
				isBusy={isPending}
				error={categoryError}
			/>
		</div>
	);
}

function EmptyState({ label }: { label: string }) {
	return <p className='py-6 text-center text-sm text-muted-foreground'>{label}</p>;
}
