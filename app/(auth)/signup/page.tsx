'use client';

import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp, signUpWithOAuth } from '@/services/auth';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import GoogleIcon from '@/components/ui/googleIcon';
import FacebookIcon from '@/components/ui/facebookIcon';
import GitHubIcon from '@/components/ui/githubIcon';
import { Field } from '@/components/ui/field';

const schema = z
	.object({
		email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
		password: z.string().trim().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
		repassword: z.string().trim().min(1, 'Vui lòng nhập lại mật khẩu'),
	})
	.refine((data) => data.password === data.repassword, {
		message: 'Mật khẩu không khớp',
		path: ['repassword'],
	});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showRePassword, setShowRePassword] = useState(false);
	const [isPending, startTransition] = useTransition();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = (data: FormData) => {
		startTransition(async () => {
			try {
				await signUp(data);
			} catch (e) {
				setError('root.apiError', {
					type: 'server',
					message: e instanceof Error ? e.message : 'Đã xảy ra lỗi',
				});
				console.log(e);
			}
		});
	};

	const onSSOSignup = async (provider: 'github' | 'google' | 'facebook') => {
		await signUpWithOAuth(provider);
	};

	return (
		<div className='flex justify-center items-center p-4 min-h-screen'>
			<div className='flex bg-card shadow-lg rounded-3xl w-full max-w-6xl overflow-hidden'>
				<div className='hidden relative lg:flex flex-col justify-between bg-linear-to-br from-primary via-primary to-primary/90 p-12 lg:w-1/2 overflow-hidden text-white'>
					<div className='top-0 right-0 absolute bg-white/10 -mt-36 -mr-36 rounded-full w-72 h-72'></div>
					<div className='bottom-0 left-0 absolute bg-white/5 -mb-32 -ml-32 rounded-full w-60 h-60'></div>

					<div className='z-10 relative'>
						<h1 className='mb-6 font-bold text-5xl leading-tight'>
							Bắt đầu hành trình học tập của bạn.
						</h1>
						<p className='opacity-90 text-lg'>
							Tạo tài khoản để theo dõi tiến độ học ngôn ngữ.
						</p>
					</div>

					<div className='z-10 relative flex justify-center items-end'>
						<div className='flex justify-center items-center w-full h-48'>
							<div className='flex gap-8'>
								<div className='flex flex-col items-center'>
									<div className='bg-white/20 mb-2 rounded-full w-24 h-24'></div>
									<div className='bg-linear-to-br from-blue-200 to-blue-300 rounded-lg w-16 h-20'></div>
								</div>
								<div className='flex flex-col items-center'>
									<div className='bg-white/20 mb-2 rounded-full w-24 h-24'></div>
									<div className='bg-linear-to-br from-yellow-200 to-yellow-300 rounded-lg w-16 h-20'></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='flex flex-col justify-center p-8 md:p-12 w-full lg:w-1/2'>
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

					<div className='mb-8'>
						<h2 className='mb-3 font-bold text-foreground text-4xl'>Tạo tài khoản</h2>
						<p className='text-muted-foreground text-lg'>
							Điền biểu mẫu để tạo tài khoản mới
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-5'>
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
						<Field
							label='Nhập lại mật khẩu'
							error={errors.repassword}
							placeholder='Nhập lại mật khẩu của bạn'
							type={showRePassword ? 'text' : 'password'}
							{...register('repassword')}
							suffixIcon={
								<div
									className='absolute right-4 top-4  cursor-pointer'
									onClick={() => setShowRePassword(!showRePassword)}>
									{showRePassword ? (
										<EyeClosedIcon size={14} />
									) : (
										<EyeIcon size={14} />
									)}
								</div>
							}
						/>

						<div className='flex justify-end'>
							<Link
								href='/login'
								className='font-medium text-primary hover:text-primary/80 text-sm transition'>
								Đã có tài khoản?
							</Link>
						</div>
						{errors.root?.apiError?.message && (
							<div className='mt-1 error-text'>{errors.root?.apiError?.message}</div>
						)}
						<button
							type='submit'
							disabled={isPending}
							className='bg-primary hover:bg-primary/80 disabled:opacity-50 mt-6 px-4 py-3 rounded-lg w-full font-semibold text-primary-foreground transition disabled:cursor-not-allowed'>
							{isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
						</button>
					</form>

					<div className='flex items-center gap-4 my-6'>
						<div className='flex-1 bg-border h-px'></div>
						<span className='text-muted-foreground text-sm'>Hoặc đăng ký bằng</span>
						<div className='flex-1 bg-border h-px'></div>
					</div>

					<div className='flex gap-4'>
						<button className='flex flex-1 justify-center items-center gap-2 hover:bg-secondary px-4 py-3 border border-border rounded-lg font-medium text-foreground transition'>
							<GoogleIcon />
							Google
						</button>
						<button className='flex flex-1 justify-center items-center gap-2 hover:bg-secondary px-4 py-3 border border-border rounded-lg font-medium text-foreground transition'>
							<FacebookIcon />
							Facebook
						</button>
						<button
							className='flex flex-1 justify-center items-center gap-2 hover:bg-secondary px-4 py-3 border border-border rounded-lg font-medium text-foreground transition'
							onClick={() => onSSOSignup('github')}>
							<GitHubIcon />
							Github
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
