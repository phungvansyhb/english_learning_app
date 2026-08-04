'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useTransition } from 'react';
import { Button } from '@/components/ui/button';
type Props = {};

export default function NewPassForm({}: Props) {
	const [isPending, startTransition] = useTransition();

	const schema = z.object({
		password: z.string().trim().min(8, 'New Password must be at least 8 characters'),
	});

	type FormData = z.infer<typeof schema>;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = (data: FormData) => {
		startTransition(async () => {
			try {
			} catch (e) {
				console.error(e);
			}
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-5'>
			<div className='space-y-2'>
				<label
					htmlFor='new-password'
					className='font-medium text-foreground text-sm'>
					Email address
				</label>
				<input
					id='new-password'
					type='password'
					placeholder='Enter your new password'
					{...register('password')}
					className={`bg-card px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full text-foreground placeholder:text-muted-foreground transition ${errors.password ? 'border-red-500' : 'border-border'}`}
				/>
				{errors.password && <p className='mt-1 error-text'>{errors.password.message}</p>}
			</div>
			{/* Login Button */}
			<Button
				type='submit'
				size='lg'
				disabled={isPending}
				className='bg-primary hover:bg-primary/80 disabled:opacity-50 mt-6 px-4 py-3 rounded-lg w-full font-semibold text-primary-foreground transition disabled:cursor-not-allowed'>
				{isPending ? 'Creating...' : 'Create new password'}
			</Button>
		</form>
	);
}
