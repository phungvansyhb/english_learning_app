'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import type { BadgeRow, CreateBadgeInput } from '@/lib/types';
import { createBadge, deleteBadge, listBadges, updateBadge } from '@/services/master-data';
import { Modal } from '../../../ui/modal';
import { fieldClass, labelClass, StatusError } from '../shared';

const CRITERIA_TYPES = ['points', 'streak', 'completed'] as const;

export default function BadgesTab() {
	const [query, setQuery] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<BadgeRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<BadgeRow | null>(null);
	const [mutationError, setMutationError] = useState<string | null>(null);
	const {
		data: items,
		page,
		totalPages,
		pending,
		error,
		setPage,
		reload,
	} = usePagination({
		apiFunction: listBadges,
		perPage: 10,
		params: { search: query || undefined },
	});

	async function handleSave(item: Partial<BadgeRow> & { id?: number }) {
		setMutationError(null);
		try {
			if (item.id) {
				await updateBadge(item.id, item as Partial<CreateBadgeInput>);
			} else {
				await createBadge(item as CreateBadgeInput);
			}
			setFormOpen(false);
			setEditing(null);
			reload();
		} catch (err) {
			setMutationError((err as Error).message);
		}
	}

	async function handleDelete() {
		if (!deleteTarget) return;
		setMutationError(null);
		try {
			await deleteBadge(deleteTarget.id);
			setDeleteTarget(null);
			reload();
		} catch (err) {
			setMutationError((err as Error).message);
		}
	}

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

			<DataTable
				data={items}
				isLoading={pending}
				rowKey={(item) => item.id}
				emptyState='No badges found.'
				columns={[
					{ key: 'code', header: 'Code' },
					{ key: 'name', header: 'Name' },
					{
						key: 'criteria',
						header: 'Criteria',
						render: (item) => `${item.criteria_type} · ${item.criteria_value}`,
					},
					{
						key: 'actions',
						header: 'Actions',
						className: 'text-right',
						cellClassName: 'w-24',
						render: (item) => (
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
						),
					},
				]}
				renderMobileCard={(item) => (
					<div className='space-y-3'>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Code
							</p>
							<p className='mt-1 text-sm font-medium text-foreground'>{item.code}</p>
						</div>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Name
							</p>
							<p className='mt-1 text-sm text-foreground'>{item.name}</p>
						</div>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Criteria
							</p>
							<p className='mt-1 text-sm text-foreground'>
								{item.criteria_type} · {item.criteria_value}
							</p>
						</div>
						<div className='flex gap-2 pt-1'>
							<button
								type='button'
								onClick={() => {
									setEditing(item);
									setFormOpen(true);
								}}
								className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
								<Pencil className='size-4' />
								Edit
							</button>
							<button
								type='button'
								onClick={() => setDeleteTarget(item)}
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

			{(mutationError || error) && <StatusError message={mutationError || error || ''} />}

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
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateBadgeInput>({
		defaultValues: {
			code: '',
			name: '',
			description: null,
			icon_url: null,
			criteria_type: CRITERIA_TYPES[0],
			criteria_value: 0,
		},
	});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		reset(
			badge
				? {
						id: badge.id,
						code: badge.code,
						name: badge.name,
						description: badge.description ?? null,
						icon_url: badge.icon_url ?? null,
						criteria_type: badge.criteria_type,
						criteria_value: badge.criteria_value,
					}
				: {
						code: '',
						name: '',
						description: null,
						icon_url: null,
						criteria_type: CRITERIA_TYPES[0],
						criteria_value: 0,
					},
		);
		setError(null);
	}, [open, badge, reset]);

	const submit = (draft: CreateBadgeInput) =>
		onSave({
			...(badge ? { id: badge.id } : {}),
			...draft,
			code: draft.code.trim(),
			name: draft.name.trim(),
			description: draft.description?.trim() || null,
			icon_url: draft.icon_url?.trim() || null,
		});

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
					<Field
						label='Code'
						error={errors.code}
						placeholder='STREAK_7'
						{...register('code', { required: 'Code is required.' })}
					/>
					<Field
						label='Name'
						error={errors.name}
						placeholder='7-day streak'
						{...register('name', { required: 'Name is required.' })}
					/>
					<Field
						label='Description'
						placeholder='Awarded for 7 days in a row'
						{...register('description')}
					/>
					<Field
						label='Icon URL'
						placeholder='https://...'
						{...register('icon_url')}
					/>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Field
							label='Criteria type'
							error={errors.criteria_type}>
							<select
								className={fieldClass}
								{...register('criteria_type', {
									required: 'Criteria type is required.',
								})}>
								{CRITERIA_TYPES.map((type) => (
									<option
										key={type}
										value={type}>
										{type}
									</option>
								))}
							</select>
						</Field>
						<Field
							label='Criteria value'
							error={errors.criteria_value}>
							<input
								type='number'
								min={0}
								className={fieldClass}
								{...register('criteria_value', {
									valueAsNumber: true,
									min: { value: 0, message: 'Must be zero or greater.' },
								})}
							/>
						</Field>
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
