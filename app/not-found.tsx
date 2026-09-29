import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-background p-6'>
			<div className='w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-sm md:p-10'>
				<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary'>
					<Search
						className='h-9 w-9 text-primary'
						aria-hidden='true'
					/>
				</div>
				<p className='text-5xl font-bold tracking-tight text-primary'>404</p>
				<h1 className='mt-3 text-balance text-xl font-semibold text-foreground'>
					Trang không tôn tại
				</h1>
				<p className='mt-2 text-pretty text-sm leading-relaxed text-muted-foreground'>
					Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
				</p>
				<div className='mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row'>
					<Link
						href='/'
						className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto'>
						<Home
							className='h-4 w-4'
							aria-hidden='true'
						/>
						Trang chủ
					</Link>
				</div>
			</div>
		</div>
	);
}
