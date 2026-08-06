'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import type { CreateUserInput, UserRow } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/admin/modal';

const fieldClass =
	'h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30';
const labelClass = 'mb-1.5 block text-xs font-semibold text-foreground';

interface UserFormModalProps {
	open: boolean;
	user: UserRow | null;
	onClose: () => void;
	onSave: (user: CreateUserInput & { id?: string }) => void;
}

export function UserFormModal({ open, user, onClose, onSave }: UserFormModalProps) {
	const [draft, setDraft] = useState<CreateUserInput>({
		email: '',
		display_name: '',
		avatar_url: null,
		status: 'active',
		role: 'USER',
	});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		if (user) {
			setDraft({
				id: user.id,
				email: user.email,
				display_name: user.display_name,
				avatar_url: user.avatar_url ?? null,
				status: user.status,
				role: user.role,
			});
			setError(null);
		} else {
			setDraft({
				email: '',
				display_name: '',
				avatar_url: null,
				status: 'active',
				role: 'USER',
			});
			setError(null);
		}
	}, [open, user]);

	function update<K extends keyof CreateUserInput>(key: K, value: CreateUserInput[K]) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!draft.email.trim()) {
			setError('Email is required.');
			return;
		}
		if (!draft.display_name.trim()) {
			setError('Display name is required.');
			return;
		}
		onSave({
			...draft,
			email: draft.email.trim(),
			display_name: draft.display_name.trim(),
		});
	}

	const isEditing = Boolean(user);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={isEditing ? 'Edit user' : 'Create new user'}
			description={isEditing ? `Update ${user?.display_name}` : 'Add a new user account.'}>
			<form
				onSubmit={handleSubmit}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div>
							<label
								className={labelClass}
								htmlFor='email'>
								Email
							</label>
							<input
								id='email'
								type='email'
								className={fieldClass}
								value={draft.email}
								onChange={(e) => update('email', e.target.value)}
								placeholder='name@example.com'
							/>
						</div>
						<div>
							<label
								className={labelClass}
								htmlFor='display_name'>
								Display name
							</label>
							<input
								id='display_name'
								className={fieldClass}
								value={draft.display_name}
								onChange={(e) => update('display_name', e.target.value)}
								placeholder='Jane Doe'
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
						<div>
							<label
								className={labelClass}
								htmlFor='role'>
								Role
							</label>
							<select
								id='role'
								className={fieldClass}
								value={draft.role}
								onChange={(e) => update('role', e.target.value)}>
								<option value='USER'>USER</option>
								<option value='SYSTEM_ADMIN'>SYSTEM_ADMIN</option>
								<option value='CONTENT_ADMIN'>CONTENT_ADMIN</option>
							</select>
						</div>
						<div>
							<label
								className={labelClass}
								htmlFor='status'>
								Status
							</label>
							<select
								id='status'
								className={fieldClass}
								value={draft.status}
								onChange={(e) =>
									update('status', e.target.value as CreateUserInput['status'])
								}>
								<option value='active'>active</option>
								<option value='suspended'>suspended</option>
								<option value='deleted'>deleted</option>
							</select>
						</div>
						<div>
							<label
								className={labelClass}
								htmlFor='avatar_url'>
								Avatar URL
							</label>
							<input
								id='avatar_url'
								className={fieldClass}
								value={draft.avatar_url ?? ''}
								onChange={(e) => update('avatar_url', e.target.value || null)}
								placeholder='https://...'
							/>
						</div>
					</div>
				</div>

				{error && (
					<div className='rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive'>
						{error}
					</div>
				)}

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
						{isEditing ? 'Save changes' : 'Create user'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
