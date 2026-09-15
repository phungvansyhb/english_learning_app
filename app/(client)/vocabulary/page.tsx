import { ListCategory, ListCategorySuspense } from '@/components/dashboard/vocabulary/listCategory';
import CustomCategoryList from '@/components/dashboard/vocabulary/customer-category/custom-category-list';
import { Button } from '@/components/ui/button'; 
import { ServerPageProps } from '@/lib/types';
import { BrainIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function VocabScreen({ searchParams }: ServerPageProps) {
	return (
		<section>
			<div className='flex flex-col gap-4 rounded-2xl border bg-primary p-5 text-primary-foreground md:flex-row md:items-center md:justify-between'>
				<div>
					<p className='flex items-center gap-2 text-sm font-medium'>
						<BrainIcon className='size-4' /> Ôn tập cách quãng
					</p>
					<h1 className='mt-1 text-xl font-bold'>Giữ từ vựng luôn sẵn sàng</h1>
					<p className='mt-1 text-sm text-primary-foreground/80'>
						Ôn các từ đã lưu theo lịch ghi nhớ cá nhân.
					</p>
				</div>
				<Link
					href='/vocabulary/review'
					className='inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80'>
					Bắt đầu ôn tập
				</Link>
			</div>
			<div className='gap-6 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] mt-6'>
				<div className='bg-white border p-4 md:p-6 lg:p-8 rounded-2xl max-h-[60vh] md:max-h-none overflow-y-auto'>
					<h2 className='font-bold text-foreground text-lg'>Từ vựng theo chủ đề</h2>
					<Suspense fallback={<ListCategorySuspense />}>
						<ListCategory searchParams={searchParams} />
					</Suspense>
				</div>
				<div className='bg-white p-4 md:p-6 lg:p-8 border rounded-2xl'>
					<h2 className='font-bold text-foreground text-lg'>Từ vựng của tôi</h2>
					<div className='mt-4'>
						<CustomCategoryList />
					</div>
				</div>
			</div>
		</section>
	);
}
