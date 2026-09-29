import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, Mail, RefreshCw } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
	title: 'Kiểm tra email | Lingua',
	description: 'Xác nhận địa chỉ email để hoàn tất việc tạo tài khoản Lingua.',
	robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
	return (
		<main className='relative flex min-h-screen items-center justify-center overflow-hidden  px-4 py-10 sm:px-6'>
			<section className='relative w-full max-w-xl rounded-3xl bg-card p-6 sm:p-10'>
				<div className='flex flex-col items-center text-center'>
					<div className='relative mb-7 flex size-24 items-center justify-center rounded-full bg-secondary text-primary'>
						<div className='absolute inset-2 rounded-full border border-primary/10' />
						<Mail
							aria-hidden='true'
							className='size-10'
							strokeWidth={1.8}
						/>
					</div>
					<p className='mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary'>
						Gần hoàn tất
					</p>
					<h1 className='max-w-md text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
						Kiểm tra email của bạn
					</h1>
					<p className='mt-4 max-w-md text-base leading-7 text-muted-foreground sm:text-lg'>
						Chúng tôi đã gửi một đường link xác nhận đến địa chỉ email bạn vừa đăng ký.
						Hãy nhấp vào link đó để kích hoạt tài khoản và bắt đầu học.
					</p>
				</div>

				<div className='my-8 rounded-2xl border border-border bg-muted/45 p-5'>
					<p className='mb-4 font-semibold text-foreground'>Chưa thấy email?</p>
					<ul className='space-y-3 text-sm leading-6 text-muted-foreground'>
						<li className='flex gap-3'>
							<Check
								aria-hidden='true'
								className='mt-1 size-4 shrink-0 text-primary'
							/>
							<span>Kiểm tra thư mục Spam hoặc Thư rác.</span>
						</li>
						<li className='flex gap-3'>
							<Check
								aria-hidden='true'
								className='mt-1 size-4 shrink-0 text-primary'
							/>
							<span>Đảm bảo bạn đã nhập đúng địa chỉ email.</span>
						</li>
						<li className='flex gap-3'>
							<Check
								aria-hidden='true'
								className='mt-1 size-4 shrink-0 text-primary'
							/>
							<span>Có thể mất vài phút để email được gửi đến.</span>
						</li>
					</ul>
				</div>

				<div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
					<Link
						href='/login'
						className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
						<ArrowLeft aria-hidden='true' />
						Quay lại đăng nhập
					</Link>
					<Link
						href='/signup'
						className={cn(
							buttonVariants({ variant: 'secondary', size: 'lg' }),
							'w-full sm:w-auto',
						)}>
						<RefreshCw aria-hidden='true' />
						Đổi email đăng ký
					</Link>
				</div>

				<p className='mt-8 text-center text-xs leading-5 text-muted-foreground'>
					Link xác nhận có thể chỉ được sử dụng một lần. Bạn có thể đóng trang này sau khi
					đã xác nhận email.
				</p>
			</section>
		</main>
	);
}
