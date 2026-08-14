'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { Plus, Search, Pencil, Trash2, LoaderIcon } from 'lucide-react';

import type { BadgeRow, CreateBadgeInput } from '@/lib/types';
import { cn } from '@/lib/utils';
import { createBadge, deleteBadge, listBadges, updateBadge } from '@/services/master-data';
import { Modal } from '../../modal';
import { fieldClass, labelClass, StatusError } from '../shared';

const CRITERIA_TYPES = ['points', 'streak', 'completed'] as const;

export default function BadgesTab() {
	const [items, setItems] = useState<BadgeRow[]>([]);
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [perPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<BadgeRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<BadgeRow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setError(null);
		startTransition(async () => {
			try {
				const response = await listBadges({
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

	async function handleSave(item: Partial<BadgeRow> & { id?: number }) {
		setError(null);
		startTransition(async () => {
			try {
				if (item.id) {
					await updateBadge(item.id, item as Partial<CreateBadgeInput>);
				} else {
					await createBadge(item as CreateBadgeInput);
				}
				setFormOpen(false);
				setEditing(null);
				const response = await listBadges({
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
				await deleteBadge(deleteTarget.id);
				setDeleteTarget(null);
				const response = await listBadges({
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
					<h2 className='text-lg font-bold text-foreground'>Badges</h2>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Manage achievement badges and criteria.
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
							placeholder='Search badges'
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
						Add badge
					</button>
				</div>
			</div>

			<div className='overflow-hidden rounded-2xl border border-border'>
				<table className='w-full border-collapse text-left text-sm'>
					<thead>
						<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
							<th className='px-4 py-3 font-semibold'>Code</th>
							<th className='px-4 py-3 font-semibold'>Name</th>
							<th className='px-4 py-3 font-semibold'>Criteria</th>
							<th className='px-4 py-3 text-right font-semibold'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr
								key={item.id}
								className='border-t border-border align-baseline'>
								<td className='px-4 py-2 text-foreground'>{item.code}</td>
								<td className='px-4 py-2 text-foreground'>{item.name}</td>
								<td className='px-4 py-2 text-foreground'>
									{item.criteria_type} · {item.criteria_value}
								</td>
								<td className='px-4 py-3'>
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
						No badges found.
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

			<BadgeFormModal
				open={formOpen}
				badge={editing}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSave={handleSave}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete badge'
				description={`This will permanently remove ${deleteTarget?.name}.`}>
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

function BadgeFormModal({
	open,
	badge,
	onClose,
	onSave,
}: {
	open: boolean;
	badge: BadgeRow | null;
	onClose: () => void;
	onSave: (input: Partial<BadgeRow> & { id?: number }) => void;
}) {
		const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBadgeInput>({ defaultValues: { code: '', name: '', description: null, icon_url: null, criteria_type: CRITERIA_TYPES[0], criteria_value: 0 } });
		const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		reset(badge ? { id: badge.id, code: badge.code, name: badge.name, description: badge.description ?? null, icon_url: badge.icon_url ?? null, criteria_type: badge.criteria_type, criteria_value: badge.criteria_value } : { code: '', name: '', description: null, icon_url: null, criteria_type: CRITERIA_TYPES[0], criteria_value: 0 });
		setError(null);
	}, [open, badge, reset]);

		const submit = (draft: CreateBadgeInput) => onSave({ ...(badge ? { id: badge.id } : {}), ...draft, code: draft.code.trim(), name: draft.name.trim(), description: draft.description?.trim() || null, icon_url: draft.icon_url?.trim() || null });

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={badge ? 'Edit badge' : 'Create badge'}
			description={badge ? `Update badge ${badge.name}.` : 'Add a new badge.'}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<Field label='Code' error={errors.code} placeholder='STREAK_7' {...register('code', { required: 'Code is required.' })} />
					<Field label='Name' error={errors.name} placeholder='7-day streak' {...register('name', { required: 'Name is required.' })} />
					<Field label='Description' placeholder='Awarded for 7 days in a row' {...register('description')} />
					<Field label='Icon URL' placeholder='https://...' {...register('icon_url')} />
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Field label='Criteria type' error={errors.criteria_type}>
							<select className={fieldClass} {...register('criteria_type', { required: 'Criteria type is required.' })}>{CRITERIA_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select>
						</Field>
						<Field label='Criteria value' error={errors.criteria_value}><input type='number' min={0} className={fieldClass} {...register('criteria_value', { valueAsNumber: true, min: { value: 0, message: 'Must be zero or greater.' } })} /></Field>
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
						{badge ? 'Save badge' : 'Create badge'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
