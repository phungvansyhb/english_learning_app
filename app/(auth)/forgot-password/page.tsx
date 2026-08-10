'use client';

import EmailForm from '@/components/dashboard/forgot-password/email-form';
import NewPassForm from '@/components/dashboard/forgot-password/newpass-form';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function LoginPage() {
	const [step, setStep] = useState(1);

	useEffect(() => {
		const supabase = createClient();
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == 'PASSWORD_RECOVERY') {
				setStep(2);
			}
		});
	}, []);
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
						<h2 className='mb-3 font-bold text-foreground text-4xl'>Don't worry</h2>
						<p className='text-muted-foreground text-lg'>
							Check your email to claim password
						</p>
					</div>

					{/* Form */}
					{step === 1 ? <EmailForm /> : <NewPassForm />}

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
