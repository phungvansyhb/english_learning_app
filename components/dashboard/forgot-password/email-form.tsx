'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
type Props = {};

export default function EmailForm({}: Props) {
	const [isPending, startTransition] = useTransition();

	const schema = z.object({
		email: z.string().trim().min(1, 'Email is required').email('Invalid email'),
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
			<Field
				label='Email adress'
				{...register('email')}
				error={errors.email}
				placeholder='Enter your email'
			/>
			{/* Login Button */}
			<Button
				type='submit'
				size='lg'
				disabled={isPending}
				className='bg-primary hover:bg-primary/80 disabled:opacity-50 mt-6 px-4 py-3 rounded-lg w-full font-semibold text-primary-foreground transition disabled:cursor-not-allowed'>
				{isPending ? 'Claiming...' : 'Claim password'}
			</Button>
		</form>
	);
}
