'use client';

import { useCallback, useState } from 'react';
import { Pencil, Plus, Search, Trash2, Volume2 } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import type { Word } from '@/lib/types';
import { seedWords } from '@/lib/words-data';
import { Modal } from '@/components/ui/modal';
import { WordFormModal } from '@/components/admin/word-mnt/word-form-modal';

const difficultyTone: Record<number, string> = {
	1: 'bg-brand-mint text-brand-mint-foreground',
	2: 'bg-brand-purple text-accent-foreground',
	3: 'bg-brand-orange text-foreground',
	4: 'bg-brand-pink text-primary-foreground',
	5: 'bg-primary text-primary-foreground',
};

export function WordsManager() {
	const [words, setWords] = useState<Word[]>(seedWords);
	const [query, setQuery] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Word | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Word | null>(null);

	const listWords = useCallback(
		async ({ page, perPage, search }: { page: number; perPage: number; search?: string }) => {
			const q = search?.trim().toLowerCase();
			const filtered = q
				? words.filter(
						(word) =>
							word.word.toLowerCase().includes(q) ||
							word.meanings.some((meaning) =>
								meaning.meaning.toLowerCase().includes(q),
							),
					)
				: words;

			const sorted = [...filtered].sort((a, b) => a.order_index - b.order_index);
			const total = sorted.length;
			const totalPages = Math.max(1, Math.ceil(total / perPage));
			const safePage = Math.min(Math.max(page, 1), totalPages);
			const start = (safePage - 1) * perPage;
			const data = sorted.slice(start, start + perPage);

			return {
				data,
				total,
				page: safePage,
				perPage,
				totalPages,
			};
		},
		[words],
	);

	const {
		data: wordsPage,
		page,
		totalPages,
		pending,
		setPage,
		reload,
	} = usePagination({
		apiFunction: listWords,
		perPage: 10,
		params: { search: query || undefined },
	});

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	function openEdit(word: Word) {
		setEditing(word);
		setFormOpen(true);
	}

	function handleSave(word: Word) {
		setWords((prev) => {
			const exists = prev.some((w) => w.id === word.id);
			return exists ? prev.map((w) => (w.id === word.id ? word : w)) : [...prev, word];
		});
		setFormOpen(false);
		setEditing(null);
		reload();
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setWords((prev) => prev.filter((w) => w.id !== deleteTarget.id));
		setDeleteTarget(null);
		reload();
	}

	return (
		<section className='rounded-3xl border border-border bg-card p-4 sm:p-6 '>
			{/* Toolbar */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
				<div>
					<h1 className='text-xl font-bold text-foreground'>Words</h1>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						{words.length} {words.length === 1 ? 'entry' : 'entries'} in the vocabulary
						library
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<div className='relative flex-1 sm:w-64'>
						<Search className='pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<input
							type='search'
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								setPage(1);
							}}
							placeholder='Search words'
							aria-label='Search words'
							className='h-11 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30'
						/>
					</div>
					<button
						type='button'
						onClick={openCreate}
						className='inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
						<Plus className='size-4' />
						<span className='hidden sm:inline'>Add word</span>
					</button>
				</div>
			</div>

			<DataTable
				data={wordsPage}
				isLoading={pending}
				rowKey={(word) => word.id}
				emptyState={<EmptyState onCreate={openCreate} />}
				columns={[
					{
						key: 'word',
						header: 'Word',
						render: (word) => (
							<div>
								<div className='flex items-center gap-2'>
									<span className='font-semibold text-foreground'>
										{word.word}
									</span>
									{(word.audio_uk || word.audio_us) && (
										<Volume2
											className='size-3.5 text-muted-foreground'
											aria-label='Has audio'
										/>
									)}
								</div>
								<span className='text-xs text-muted-foreground'>{word.ipa}</span>
							</div>
						),
					},
					{
						key: 'meanings',
						header: 'Meaning',
						render: (word) => (
							<div className='flex flex-wrap gap-1.5'>
								{word.meanings.slice(0, 3).map((meaning, index) => (
									<span
										key={index}
										className='rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground'>
										<span className='text-muted-foreground'>{meaning.pos}</span>{' '}
										· {meaning.meaning}
									</span>
								))}
							</div>
						),
					},
					{
						key: 'difficulty_level',
						header: 'Difficulty',
						render: (word) => (
							<span
								className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyTone[word.difficulty_level] ?? difficultyTone[1]}`}>
								Level {word.difficulty_level}
							</span>
						),
					},
					{ key: 'order_index', header: 'Order', cellClassName: 'text-muted-foreground' },
					{
						key: 'actions',
						header: 'Actions',
						className: 'text-right',
						cellClassName: 'w-24',
						render: (word) => (
							<div className='flex justify-end gap-1'>
								<button
									type='button'
									onClick={() => openEdit(word)}
									aria-label={`Edit ${word.word}`}
									className='flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'>
									<Pencil className='size-4' />
								</button>
								<button
									type='button'
									onClick={() => setDeleteTarget(word)}
									aria-label={`Delete ${word.word}`}
									className='flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
									<Trash2 className='size-4' />
								</button>
							</div>
						),
					},
				]}
				renderMobileCard={(word) => (
					<div className='space-y-3'>
						<div className='flex items-start justify-between gap-3'>
							<div>
								<div className='flex items-center gap-2'>
									<span className='font-semibold text-foreground'>
										{word.word}
									</span>
									{(word.audio_uk || word.audio_us) && (
										<Volume2
											className='size-3.5 text-muted-foreground'
											aria-label='Has audio'
										/>
									)}
								</div>
								<span className='text-xs text-muted-foreground'>{word.ipa}</span>
							</div>
							<span
								className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyTone[word.difficulty_level] ?? difficultyTone[1]}`}>
								Level {word.difficulty_level}
							</span>
						</div>
						<div className='flex flex-wrap gap-1.5'>
							{word.meanings.map((meaning, index) => (
								<span
									key={index}
									className='rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground'>
									<span className='text-muted-foreground'>{meaning.pos}</span> ·{' '}
									{meaning.meaning}
								</span>
							))}
						</div>
						<div className='flex gap-2 pt-1'>
							<button
								type='button'
								onClick={() => openEdit(word)}
								className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
								<Pencil className='size-4' />
								Edit
							</button>
							<button
								type='button'
								onClick={() => setDeleteTarget(word)}
								className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-destructive transition-colors hover:bg-destructive/10'>
								<Trash2 className='size-4' />
								Delete
							</button>
						</div>
					</div>
				)}
			/>

			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				pending={pending}
			/>

			<WordFormModal
				open={formOpen}
				word={null}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSuccess={()=>{
					setFormOpen(false);
					setEditing(null);
				}}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete word'
				className='w-xl'
				description={`This will permanently remove "${deleteTarget?.word}".`}>
				<div className='flex justify-end gap-3 px-6 py-5'>
					<button
						type='button'
						onClick={() => setDeleteTarget(null)}
						className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
						Cancel
					</button>
					<button
						type='button'
						onClick={confirmDelete}
						className='h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90'>
						Delete
					</button>
				</div>
			</Modal>
		</section>
	);
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
	return (
		<div className='flex flex-col items-center gap-3 px-4 py-12 text-center'>
			<p className='text-sm text-muted-foreground'>No words match your search.</p>
			<button
				type='button'
				onClick={onCreate}
				className='inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent'>
				<Plus className='size-4' /> Add a word
			</button>
		</div>
	);
}
