'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { GrammarPointRow } from '@/lib/types';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import DifficultySelect from '@/components/admin/difficulty-select';
import GrammarForm from './grammar-form';
import { deleteGrammarPoint, listGrammarPoints } from '@/services/grammar';
import { Modal } from '@/components/ui/modal';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';
import { DataTable } from '@/components/ui/data-table';

type GrammarPointWithDifficulty = GrammarPointRow & {
	difficulty_label: string;
};

export function GrammarManager() {
	const [selected, setSelected] = useState<GrammarPointWithDifficulty | null>(null);
	const [query, setQuery] = useState('');
	const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState('');

	const {
		data,
		page,
		totalPages,
		pending: isLoadingList,
		setPage,
		reload,
	} = usePagination({
		apiFunction: listGrammarPoints,
		params: {
			search: query || undefined,
			difficulty_id: selectedDifficulty || undefined,
		},
	});

	const onCreateSuccess = async () => {
		setIsCreating(false);
		setSelected(null);
		reload();
	};

	const onEdit = (item: GrammarPointWithDifficulty) => {
		setSelected(item);
		setIsCreating(true);
	};

	const onDelete = (id: number) => {
		const confirmed = window.confirm('Delete this grammar point?');
		if (!confirmed) {
			return;
		}

		startTransition(async () => {
			try {
				await deleteGrammarPoint(id);
				reload();
			} catch (nextError) {
				setError(String(nextError));
			}
		});
	};
	const isLoading = isLoadingList || isPending;
	return (
		<section className='rounded-3xl border border-border bg-card p-4 sm:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-xl font-bold text-foreground'>Grammar points</h1>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						{data.length} {data.length === 1 ? 'lesson' : 'lessons'} found
					</p>
				</div>

				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<label className='relative flex-1 sm:w-64'>
						<Search className='pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder='Search grammar points'
							aria-label='Search grammar points'
							className='h-11 w-full rounded-full border border-border pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30'
						/>
					</label>
					<DifficultySelect
						label=''
						placeholder='All difficulties'
						value={selectedDifficulty}
						onValueChange={(value) =>
							setSelectedDifficulty(Array.isArray(value) ? (value[0] ?? null) : value)
						}
					/>
					<button
						type='button'
						onClick={() => {
							setSelected(null);
							setIsCreating(true);
						}}
						className='inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
						<Plus className='size-4' />
						<span className='hidden sm:inline'>Add grammar</span>
					</button>
				</div>
			</div>

			{error && <p className='error-text'>{error}</p>}

			<div className='mt-6 rounded-2xl bg-card'>
				<DataTable
					isLoading={isLoading}
					columns={[
						{
							key: 'name',
							header: 'Grammar point',
							cellClassName: 'align-top',
							render: (item) => (
								<div className='min-w-[220px]'>
									<div className='flex items-center gap-2'>
										<span className='truncate font-semibold text-foreground'>
											{item.name}
										</span>
									</div>
								</div>
							),
						},
						{
							key: 'description',
							header: 'Description',
							cellClassName: 'min-w-[260px] text-muted-foreground',
							render: (item) => item.description,
						},
						{
							key: 'difficulty_label',
							header: 'Difficulty',
							cellClassName: 'whitespace-nowrap',
							render: (item) => (
								<span className='rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground'>
									{item.difficulty_label}
								</span>
							),
						},
						{
							key: 'actions',
							header: 'Actions',
							className: 'text-right',
							cellClassName: 'text-right',
							render: (item) => (
								<div className='flex justify-end gap-4 text-muted-foreground'>
									<button
										type='button'
										aria-label={`Edit ${item.name}`}
										onClick={() => onEdit(item)}
										className='hover:text-foreground'>
										<Pencil className='size-4' />
									</button>
									<button
										type='button'
										aria-label={`Delete ${item.name}`}
										onClick={() => onDelete(item.id)}
										className='hover:text-destructive'>
										<Trash2 className='size-4' />
									</button>
								</div>
							),
						},
					]}
					data={data}
					rowKey={(item) => item.id}
					emptyState={
						isLoading
							? 'Loading grammar points...'
							: 'No grammar points match your filters.'
					}
					renderMobileCard={(item) => (
						<div>
							<div className='flex items-start justify-between gap-3'>
								<div className='min-w-0'>
									<p className='truncate font-semibold text-foreground'>
										{item.name}
									</p>
									<p className='mt-1 text-sm text-muted-foreground'>
										{item.description}
									</p>
								</div>
								<span className='rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground'>
									{item.difficulty_label}
								</span>
							</div>
							<div className='mt-4 flex gap-2'>
								<button
									type='button'
									onClick={() => onEdit(item)}
									className='inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-accent'>
									<Pencil className='size-4' /> Edit
								</button>
								<button
									type='button'
									onClick={() => onDelete(item.id)}
									className='inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20'>
									<Trash2 className='size-4' /> Delete
								</button>
							</div>
						</div>
					)}
					className='mt-0'
				/>

				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>

			{isCreating && (
				<Modal
					open={isCreating}
					onClose={() => setIsCreating(false)}
					title={selected ? 'Edit grammar point' : 'Create new grammar point'}>
					<GrammarForm
						onCancel={() => setIsCreating(false)}
						onSuccess={onCreateSuccess}
						initialData={
							selected
								? {
										id: selected.id,
										name: selected.name,
										description: selected.description,
										difficulty_id: selected.difficulty_id,
										difficulty_label: selected.difficulty_label,
										content: selected.content,
									}
								: undefined
						}
					/>
				</Modal>
			)}
		</section>
	);
}
