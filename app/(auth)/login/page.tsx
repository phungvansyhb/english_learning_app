'use client';

import { Activity, useState, useTransition } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import GoogleIcon from '@/components/ui/googleIcon';
import FacebookIcon from '@/components/ui/facebookIcon';
import { Button } from '@/components/ui/button';
import { signInWithPassword, signInOAuth } from '@/services/auth';
import GitHubIcon from '@/components/ui/githubIcon';
import { Field } from '@/components/ui/field';
import Logo from '@/components/ui/logo';

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isPending, startTransition] = useTransition();

	const schema = z.object({
		email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
		password: z.string().trim().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
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
		<div className='flex justify-center items-center p-0 lg:p-4 min-h-screen'>
			<div className='flex bg-card lg:shadow-lg rounded-3xl w-full max-w-6xl overflow-hidden'>
				{/* Left Section - Branding */}
				<div className='hidden relative lg:flex flex-col justify-between bg-linear-to-br from-primary via-primary to-primary/90 p-12 lg:w-1/2 overflow-hidden text-white'>
					{/* Decorative elements */}
					<div className='top-0 right-0 absolute bg-white/10 -mt-36 -mr-36 rounded-full w-72 h-72'></div>
					<div className='bottom-0 left-0 absolute bg-white/5 -mb-32 -ml-32 rounded-full w-60 h-60'></div>

					<div className='z-10 relative'>
						<h1 className='mb-6 font-bold text-5xl leading-tight'>
							Học tập đơn giản hơn với Lingua.
						</h1>
						<p className='opacity-90 text-lg'>
							Quản lý việc học dễ dàng với bảng điều khiển thân thiện.
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
					<Logo />

					{/* Welcome Text */}
					<div className='mb-8'>
						<h2 className='title-text'>Chào mừng trở lại</h2>
						<p className='content-text'>Vui lòng đăng nhập vào tài khoản của bạn</p>
					</div>

					{/* Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-5'>
						{/* Email Input */}
						<Field
							label='Địa chỉ email'
							error={errors.email}
							placeholder='Nhập email của bạn'
							{...register('email')}
						/>
						<Field
							label='Mật khẩu'
							error={errors.password}
							placeholder='Nhập mật khẩu của bạn'
							{...register('password')}
							type={showPassword ? 'text' : 'password'}
							suffixIcon={
								<div
									className='absolute right-4 top-4  cursor-pointer'
									onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? (
										<EyeClosedIcon size={14} />
									) : (
										<EyeIcon size={14} />
									)}
								</div>
							}
						/>

						{/* Forgot Password Link */}
						<div className='flex justify-end'>
							<Link
								href='/forgot-password'
								className='label-text'>
								Quên mật khẩu?
							</Link>
						</div>
						<Activity mode={errors.root?.apiError ? 'visible' : 'hidden'}>
							<p className='error-text'>{errors.root?.apiError.message}</p>
						</Activity>
						{/* Login Button */}
						<Button
							type='submit'
							size='lg'
							disabled={isPending}
							className='w-full'>
							{isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</Button>
					</form>

					{/* Divider */}
					<div className='flex items-center gap-4 my-6'>
						<div className='flex-1 bg-border h-px'></div>
						<span className='help-text'>Hoặc đăng nhập bằng</span>
						<div className='flex-1 bg-border h-px'></div>
					</div>

					{/* Social Login */}
					<div className='flex justify-center flex-wrap gap-2 lg:gap-4'>
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
						<span className='help-text'>
							Chưa có tài khoản?{' '}
							<Link
								href='/signup'
								className='label-text'>
								Đăng ký
							</Link>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
