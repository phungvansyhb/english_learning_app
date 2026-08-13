'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
type Props = {};

export default function NewPassForm({}: Props) {
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);
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
			<Field
				label='Email adress'
				{...register('password')}
				error={errors.password}
				placeholder='Enter your new password'
				type={showPassword ? 'text' : 'password'}
				suffixIcon={
					<div
						className='absolute right-4 top-4  cursor-pointer'
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <EyeClosedIcon size={14} /> : <EyeIcon size={14} />}
					</div>
				}
			/>
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
