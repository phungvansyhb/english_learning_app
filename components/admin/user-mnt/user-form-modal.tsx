'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateUserInput, UserRow } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

interface UserFormModalProps {
	open: boolean;
	user: UserRow | null;
	onClose: () => void;
	onSave: (user: CreateUserInput & { id?: string }) => void;
}

const defaults: CreateUserInput = {
	email: '',
	display_name: '',
	avatar_url: null,
	status: 'active',
	role: 'USER',
};

export function UserFormModal({ open, user, onClose, onSave }: UserFormModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateUserInput>({ defaultValues: defaults });
	useEffect(() => {
		if (open)
			reset(
				user
					? {
							id: user.id,
							email: user.email,
							display_name: user.display_name,
							avatar_url: user.avatar_url ?? null,
							status: user.status,
							role: user.role,
						}
					: defaults,
			);
	}, [open, user, reset]);
	const isEditing = Boolean(user);
	const submit = (values: CreateUserInput) =>
		onSave({
			...values,
			email: values.email.trim(),
			display_name: values.display_name.trim(),
			avatar_url: values.avatar_url?.trim() || null,
		});

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={isEditing ? 'Edit user' : 'Create new user'}
			description={isEditing ? `Update ${user?.display_name}` : 'Add a new user account.'}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 overflow-y-auto px-6 py-5'>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Field
							label='Email'
							placeholder='name@example.com'
							type='email'
							error={errors.email}
							{...register('email', { required: 'Email is required.' })}
						/>
						<Field
							label='Display name'
							placeholder='Jane Doe'
							error={errors.display_name}
							{...register('display_name', { required: 'Display name is required.' })}
						/>
					</div>
					<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
						<Field
							label='Role'
							error={errors.role}
							{...register('role')}>
							<select>
								<option value='USER'>USER</option>
								<option value='SYSTEM_ADMIN'>SYSTEM_ADMIN</option>
								<option value='CONTENT_ADMIN'>CONTENT_ADMIN</option>
							</select>
						</Field>
						<Field
							label='Status'
							error={errors.status}
							{...register('status')}>
							<select>
								<option value='active'>active</option>
								<option value='suspended'>suspended</option>
								<option value='deleted'>deleted</option>
							</select>
						</Field>
						<Field
							label='Avatar URL'
							placeholder='https://...'
							error={errors.avatar_url}
							{...register('avatar_url')}
						/>
					</div>
				</div>
				<div className='flex justify-end gap-3 border-t border-border px-6 py-5'>
					<Button
						type='button'
						onClick={onClose}
						variant='secondary'>
						Cancel
					</Button>
					<Button
						type='submit'
						>
						{isEditing ? 'Save changes' : 'Create user'}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
