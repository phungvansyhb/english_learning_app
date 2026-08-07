'use client';

import { useEffect, useState, useTransition } from 'react';
import { Plus, Search, Pencil, Trash2, LoaderIcon } from 'lucide-react';

import type { CreateDifficultyLevelInput, DifficultyLevelRow } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
	createDifficultyLevel,
	deleteDifficultyLevel,
	listDifficultyLevels,
	updateDifficultyLevel,
} from '@/services/master-data';
import { Modal } from '../../modal';
import { fieldClass, labelClass, StatusError } from '../shared';

export default function DifficultyLevelsTab() {
	const [items, setItems] = useState<DifficultyLevelRow[]>([]);
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [perPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<DifficultyLevelRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<DifficultyLevelRow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setError(null);
		startTransition(async () => {
			try {
				const response = await listDifficultyLevels({
					page,
					perPage,
					search: query || undefined,
				});
				setItems(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}, [query, page, perPage]);

	async function handleSave(item: Partial<DifficultyLevelRow> & { id?: number }) {
		setError(null);
		startTransition(async () => {
			try {
				if (item.id) {
					await updateDifficultyLevel(item.id, item);
				} else {
					await createDifficultyLevel(item as CreateDifficultyLevelInput);
				}
				setFormOpen(false);
				setEditing(null);
				const response = await listDifficultyLevels({
					page,
					perPage,
					search: query || undefined,
				});
				setItems(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}

	async function handleDelete() {
		if (!deleteTarget) return;
		setError(null);
		startTransition(async () => {
			try {
				await deleteDifficultyLevel(deleteTarget.id);
				setDeleteTarget(null);
				const response = await listDifficultyLevels({
					page,
					perPage,
					search: query || undefined,
				});
				setItems(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}

	const pending = isPending;

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h2 className='text-lg font-bold text-foreground'>Difficulty levels</h2>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Create and edit difficulty labels used across content.
					</p>
				</div>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<div className='relative flex-1 sm:w-72'>
						<Search className='pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<input
							type='search'
							value={query}
							onChange={(e) => {
								setPage(1);
								setQuery(e.target.value);
							}}
							placeholder='Search difficulty'
							className={fieldClass}
						/>
					</div>
					<button
						type='button'
						onClick={() => {
							setEditing(null);
							setFormOpen(true);
						}}
						className='inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
						<Plus className='size-4' />
						Add level
					</button>
				</div>
			</div>

			<div className='overflow-hidden rounded-2xl border border-border'>
				<table className='w-full border-collapse text-left text-sm'>
					<thead>
						<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
							<th className='px-4 py-3 font-semibold'>Code</th>
							<th className='px-4 py-3 font-semibold'>Label</th>
							<th className='px-4 py-3 text-right font-semibold'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr
								key={item.id}
								className='border-t border-border align-baseline'>
								<td className='px-4 py-2 text-foreground'>{item.code}</td>
								<td className='px-4 py-2 text-foreground'>{item.label}</td>
								<td className='px-4 py-2'>
									<div className='flex justify-end gap-1'>
										<button
											type='button'
											onClick={() => {
												setEditing(item);
												setFormOpen(true);
											}}
											className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'>
											<Pencil className='size-4' />
										</button>
										<button
											type='button'
											onClick={() => setDeleteTarget(item)}
											className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
											<Trash2 className='size-4' />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{items.length === 0 && !pending && (
					<div className='p-6 text-center text-sm text-muted-foreground'>
						No levels found.
					</div>
				)}
				{pending && (
					<div className='p-6 flex justify-center text-muted-foreground'>
						<LoaderIcon className='animate animate-spin' />
					</div>
				)}
			</div>

			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-sm text-muted-foreground'>
					Page {page} of {totalPages}
				</p>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setPage((prev) => Math.max(1, prev - 1))}
						disabled={page <= 1 || pending}
						className={cn(
							'h-11 rounded-full border border-border px-4 text-sm transition-colors',
							page <= 1 || pending
								? 'cursor-not-allowed text-muted-foreground bg-secondary'
								: 'text-foreground bg-card hover:bg-secondary',
						)}>
						Previous
					</button>
					<button
						type='button'
						onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
						disabled={page >= totalPages || pending}
						className={cn(
							'h-11 rounded-full border border-border px-4 text-sm transition-colors',
							page >= totalPages || pending
								? 'cursor-not-allowed text-muted-foreground bg-secondary'
								: 'text-foreground bg-card hover:bg-secondary',
						)}>
						Next
					</button>
				</div>
			</div>

			{error && <StatusError message={error} />}

			<DifficultyLevelFormModal
				open={formOpen}
				level={editing}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSave={handleSave}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete difficulty level'
				description={`This will permanently remove ${deleteTarget?.label}.`}>
				<div className='flex justify-end gap-3 px-6 py-5'>
					<button
						type='button'
						onClick={() => setDeleteTarget(null)}
						className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
						Cancel
					</button>
					<button
						type='button'
						onClick={handleDelete}
						className='h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90'>
						Delete
					</button>
				</div>
			</Modal>
		</div>
	);
}

function DifficultyLevelFormModal({
	open,
	level,
	onClose,
	onSave,
}: {
	open: boolean;
	level: DifficultyLevelRow | null;
	onClose: () => void;
	onSave: (input: Partial<DifficultyLevelRow> & { id?: number }) => void;
}) {
	const [draft, setDraft] = useState<CreateDifficultyLevelInput>({ code: '', label: '' });
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		if (level) {
			setDraft({ id: level.id, code: level.code, label: level.label });
			setError(null);
		} else {
			setDraft({ code: '', label: '' });
			setError(null);
		}
	}, [open, level]);

	function handleChange<K extends keyof CreateDifficultyLevelInput>(
		key: K,
		value: CreateDifficultyLevelInput[K],
	) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!draft.code.trim()) {
			setError('Code is required.');
			return;
		}
		if (!draft.label.trim()) {
			setError('Label is required.');
			return;
		}
		onSave({
			...(level ? { id: level.id } : {}),
			...draft,
			code: draft.code.trim(),
			label: draft.label.trim(),
		});
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={level ? 'Edit difficulty level' : 'Create difficulty level'}
			description={
				level ? `Update difficulty level ${level.label}.` : 'Add a new difficulty level.'
			}>
			<form
				onSubmit={handleSubmit}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<div>
						<label
							className={labelClass}
							htmlFor='difficulty-code'>
							Code
						</label>
						<input
							id='difficulty-code'
							className={fieldClass}
							value={draft.code}
							onChange={(e) => handleChange('code', e.target.value)}
							placeholder='BEGINNER'
						/>
					</div>
					<div>
						<label
							className={labelClass}
							htmlFor='difficulty-label'>
							Label
						</label>
						<input
							id='difficulty-label'
							className={fieldClass}
							value={draft.label}
							onChange={(e) => handleChange('label', e.target.value)}
							placeholder='Beginner'
						/>
					</div>
				</div>

				{error && <StatusError message={error} />}

				<div className='flex items-center justify-end gap-3 border-t border-border px-6 py-5'>
					<button
						type='button'
						onClick={onClose}
						className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
						Cancel
					</button>
					<button
						type='submit'
						className='h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
						{level ? 'Save level' : 'Create level'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
