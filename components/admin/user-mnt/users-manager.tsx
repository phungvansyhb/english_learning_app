'use client';

import { useState, useTransition } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import type { CreateUserInput, UserRow } from '@/lib/types';
import { createUser, deleteUser, listUsers, updateUser } from '@/services/user';
import { Modal } from '@/components/ui/modal';
import { UserFormModal } from '@/components/admin/user-mnt/user-form-modal';
import { Pagination } from '@/components/ui/pagination';
import { DataTable } from '@/components/ui/data-table';
import { usePagination } from '../../../hooks/use-pagination';

const ROLE_OPTIONS = ['USER', 'SYSTEM_ADMIN', 'CONTENT_ADMIN'];
const STATUS_OPTIONS = ['active', 'suspended', 'deleted'];

export function UsersManager() {
	const [query, setQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<UserRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
	const [savePending, startSaveTransition] = useTransition();
	const [deletePending, startDeleteTransition] = useTransition();

	const {
		data: users,
		page,
		totalPages,
		error,
		pending,
		setPage,
		reload,
	} = usePagination({
		apiFunction: listUsers,
		params: {
			search: query || undefined,
			role: roleFilter || undefined,
			status: statusFilter || undefined,
		},
	});

	function handleSave(user: Partial<UserRow> & { id?: string }) {
		startSaveTransition(async () => {
			try {
				if (user.id) {
					await updateUser(user.id, user);
				} else {
					await createUser(user as CreateUserInput);
				}
				await reload();
				setFormOpen(false);
				setEditing(null);
			} catch (err) {
				console.error(err);
			}
		});
	}

	function handleDelete() {
		if (!deleteTarget) return;

		startDeleteTransition(async () => {
			try {
				await deleteUser(deleteTarget.id);
				setDeleteTarget(null);
				await reload();
			} catch (err) {
				console.error(err);
			}
		});
	}

	const loading = pending || savePending || deletePending;

	return (
		<section className='rounded-3xl border border-border bg-card p-4 sm:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-xl font-bold text-foreground'>Users</h1>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						{users.length} {users.length === 1 ? 'user' : 'users'} found
					</p>
				</div>

				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<div className='relative flex-1 sm:w-64'>
						<Search className='pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<input
							type='search'
							value={query}
							onChange={(e) => {
								setPage(1);
								setQuery(e.target.value);
							}}
							placeholder='Search email or name'
							aria-label='Search users'
							className='h-11 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30'
						/>
					</div>
					<div className='flex items-center gap-2'>
						<select
							value={roleFilter}
							onChange={(e) => {
								setPage(1);
								setRoleFilter(e.target.value);
							}}
							className='h-11 rounded-full border border-border bg-secondary/50 px-4 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30'>
							<option value=''>All roles</option>
							{ROLE_OPTIONS.map((role) => (
								<option
									key={role}
									value={role}>
									{role}
								</option>
							))}
						</select>
						<select
							value={statusFilter}
							onChange={(e) => {
								setPage(1);
								setStatusFilter(e.target.value);
							}}
							className='h-11 rounded-full border border-border bg-secondary/50 px-4 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30'>
							<option value=''>All statuses</option>
							{STATUS_OPTIONS.map((status) => (
								<option
									key={status}
									value={status}>
									{status}
								</option>
							))}
						</select>
						<button
							type='button'
							onClick={() => {
								setEditing(null);
								setFormOpen(true);
							}}
							className='inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
							<Plus className='size-4' />
							<span className='hidden sm:inline'>Add user</span>
						</button>
					</div>
				</div>
			</div>

			<DataTable
				isLoading={loading}
				columns={[
					{
						key: 'email',
						header: 'Email',
						cellClassName: 'break-all text-foreground',
					},
					{
						key: 'display_name',
						header: 'Display name',
						cellClassName: 'text-foreground',
					},
					{ key: 'role', header: 'Role', cellClassName: 'text-foreground' },
					{ key: 'status', header: 'Status', cellClassName: 'text-foreground' },
					{
						key: 'created_at',
						header: 'Created',
						cellClassName: 'text-muted-foreground',
						render: (user) => new Date(user.created_at).toLocaleDateString(),
					},
					{
						key: 'actions',
						header: 'Actions',
						className: 'text-right',
						cellClassName: 'text-right',
						render: (user) => (
							<div className='flex justify-end gap-1'>
								<button
									type='button'
									onClick={() => {
										setEditing(user);
										setFormOpen(true);
									}}
									aria-label={`Edit ${user.email}`}
									className='flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'>
									<Pencil className='size-4' />
								</button>
								<button
									type='button'
									onClick={() => setDeleteTarget(user)}
									aria-label={`Delete ${user.email}`}
									className='flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
									<Trash2 className='size-4' />
								</button>
							</div>
						),
					},
				]}
				data={users}
				rowKey={(user) => user.id}
				emptyState='No users found.'
				renderMobileCard={(user) => (
					<div>
						<div className='flex items-start justify-between gap-3'>
							<div>
								<p className='font-semibold text-foreground'>{user.display_name}</p>
								<p className='text-sm text-muted-foreground'>{user.email}</p>
							</div>
							<span className='rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-muted-foreground'>
								{user.status}
							</span>
						</div>
						<div className='mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground'>
							<span>{user.role}</span>
							<span>{new Date(user.created_at).toLocaleDateString()}</span>
						</div>
						<div className='mt-4 flex gap-2'>
							<button
								type='button'
								onClick={() => {
									setEditing(user);
									setFormOpen(true);
								}}
								className='inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-accent'>
								<Pencil className='size-4' /> Edit
							</button>
							<button
								type='button'
								onClick={() => setDeleteTarget(user)}
								className='inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20'>
								<Trash2 className='size-4' /> Delete
							</button>
						</div>
					</div>
				)}
				className='mt-6'
			/>

			<Pagination
				page={page}
				totalPages={totalPages}
				pending={loading}
				onPageChange={setPage}
			/>

			{error && (
				<div className='mt-4 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive'>
					{error}
				</div>
			)}

			<UserFormModal
				open={formOpen}
				user={editing}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSave={handleSave}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete user'
				description={`This will permanently remove ${deleteTarget?.display_name}.`}>
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
		</section>
	);
}
