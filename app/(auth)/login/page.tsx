'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeDashedIcon } from 'lucide-react';
import GoogleIcon from '@/components/ui/googleIcon';
import FacebookIcon from '@/components/ui/facebookIcon';
import { Button } from '@/components/ui/button';
import { signInWithPassword, signInOAuth } from '@/services/auth';
import GitHubIcon from '@/components/ui/githubIcon';

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isPending, startTransition] = useTransition();

	const schema = z.object({
		email: z.string().trim().min(1, 'Email is required').email('Invalid email'),
		password: z.string().trim().min(8, 'Password must be at least 8 characters'),
	});

	type FormData = z.infer<typeof schema>;

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = (data: FormData) => {
		startTransition(async () => {
			try {
				const error = await signInWithPassword(data);
				if (error) {
					setError('root.apiError', { type: 'server', message: error });
				}
			} catch (e) {
				console.error(e);
			}
		});
	};

	const onLoginSSO = (provider: 'github' | 'google' | 'facebook') => {
		startTransition(async () => {
			try {
				signInOAuth(provider);
			} catch (e) {
				console.error(e);
			}
		});
	};

	return (
		<div className='flex justify-center items-center p-4 min-h-screen'>
			<div className='flex bg-card shadow-lg rounded-3xl w-full max-w-6xl overflow-hidden'>
				{/* Left Section - Branding */}
				<div className='hidden relative lg:flex flex-col justify-between bg-linear-to-br from-primary via-primary to-primary/90 p-12 lg:w-1/2 overflow-hidden text-white'>
					{/* Decorative elements */}
					<div className='top-0 right-0 absolute bg-white/10 -mt-36 -mr-36 rounded-full w-72 h-72'></div>
					<div className='bottom-0 left-0 absolute bg-white/5 -mb-32 -ml-32 rounded-full w-60 h-60'></div>

					<div className='z-10 relative'>
						<h1 className='mb-6 font-bold text-5xl leading-tight'>
							Simplify management with our dashboard.
						</h1>
						<p className='opacity-90 text-lg'>
							Simplify your e-commerce management with our user-friendly admin
							dashboard.
						</p>
					</div>

					{/* Illustration placeholder */}
					<div className='z-10 relative flex justify-center items-end'>
						<div className='flex justify-center items-center w-full h-48'>
							<div className='flex gap-8'>
								{/* Person 1 */}
								<div className='flex flex-col items-center'>
									<div className='bg-white/20 mb-2 rounded-full w-24 h-24'></div>
									<div className='bg-linear-to-br from-blue-200 to-blue-300 rounded-lg w-16 h-20'></div>
								</div>
								{/* Person 2 */}
								<div className='flex flex-col items-center'>
									<div className='bg-white/20 mb-2 rounded-full w-24 h-24'></div>
									<div className='bg-linear-to-br from-yellow-200 to-yellow-300 rounded-lg w-16 h-20'></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Section - Login Form */}
				<div className='flex flex-col justify-center p-8 md:p-12 w-full lg:w-1/2'>
					{/* Logo/Brand */}
					<div className='mb-8'>
						<div className='flex items-center gap-2'>
							<div className='flex justify-center items-center bg-primary rounded-full w-10 h-10'>
								<span className='font-bold text-primary-foreground text-lg'>E</span>
							</div>
							<span className='font-bold text-foreground text-2xl'>
								Language Learning
							</span>
						</div>
					</div>

					{/* Welcome Text */}
					<div className='mb-8'>
						<h2 className='mb-3 font-bold text-foreground text-4xl'>Welcome Back</h2>
						<p className='text-muted-foreground text-lg'>
							Please login to your account
						</p>
					</div>

					{/* Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-5'>
						{/* Email Input */}
						<div className='space-y-2'>
							<label
								htmlFor='email'
								className='font-medium text-foreground text-sm'>
								Email address
							</label>
							<input
								id='email'
								type='email'
								placeholder='Enter your email'
								{...register('email')}
								className={`bg-card px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full text-foreground placeholder:text-muted-foreground transition ${errors.email ? 'border-red-500' : 'border-border'}`}
							/>
							{errors.email && (
								<p className='mt-1 error-text'>
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password Input */}
						<div className='space-y-2'>
							<label
								htmlFor='password'
								className='font-medium text-foreground text-sm'>
								Password
							</label>
							<div className='relative'>
								<input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='Enter your password'
									{...register('password')}
									className={`bg-card px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full text-foreground placeholder:text-muted-foreground transition ${errors.password ? 'border-red-500' : 'border-border'}`}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='top-1/2 right-3 absolute text-muted-foreground hover:text-foreground transition -translate-y-1/2'>
									{showPassword ? <EyeDashedIcon /> : <EyeClosedIcon />}
								</button>
							</div>
							{errors.password && (
								<p className='mt-1 error-text'>
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Forgot Password Link */}
						<div className='flex justify-end'>
							<Link
								href='/forgot-password'
								className='font-medium text-primary hover:text-primary/80 text-sm transition'>
								Forgot password?
							</Link>
						</div>
						{errors.root?.apiError && (
							<p className='mt-1 error-text animate-in duration-700 fade-in-5'>
								{errors.root?.apiError.message}
							</p>
						)}
						{/* Login Button */}
						<Button
							type='submit'
							size='lg'
							disabled={isPending}
							className='bg-primary hover:bg-primary/80 disabled:opacity-50 mt-6 px-4 py-3 rounded-lg w-full font-semibold text-primary-foreground transition disabled:cursor-not-allowed'>
							{isPending ? 'Logging in...' : 'Login'}
						</Button>
					</form>

					{/* Divider */}
					<div className='flex items-center gap-4 my-6'>
						<div className='flex-1 bg-border h-px'></div>
						<span className='text-muted-foreground text-sm'>Or Login with</span>
						<div className='flex-1 bg-border h-px'></div>
					</div>

					{/* Social Login */}
					<div className='flex justify-center gap-4'>
						<Button
							size='lg'
							variant='secondary'>
							<GoogleIcon />
							Google
						</Button>
						<Button
							size='lg'
							variant='secondary'>
							<FacebookIcon />
							Facebook
						</Button>
						<Button
							size='lg'
							variant='secondary'
							onClick={() => onLoginSSO('github')}>
							<GitHubIcon />
							Github
						</Button>
					</div>

					{/* Signup Link */}
					<div className='mt-8 text-center'>
						<span className='text-muted-foreground'>
							Don't have an account?{' '}
							<Link
								href='/signup'
								className='font-semibold text-primary hover:text-primary/80 transition'>
								Sign up
							</Link>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
