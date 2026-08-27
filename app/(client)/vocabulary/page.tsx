import React, { Suspense } from 'react';
import { vocabCategories } from '@/lib/data';
import CategoryVocab from '@/components/dashboard/vocabulary/category-vocab';
import { getVocabWordCategories } from '@/services/vocab-word';
import { Pagination } from '@/components/ui/pagination';
import { Server } from 'http';
import { GetServerSideProps } from 'next';
import { ServerPageProps } from '@/lib/types';
import { ListCategorySuspense, ListCategory } from '@/components/dashboard/vocabulary/listCategory';

export default async function VocabScreen({ searchParams }: ServerPageProps) {
	return (
		<section>
			<div className='gap-6 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] mt-6'>
				<div className='bg-muted p-4 md:p-6 lg:p-8 rounded-2xl max-h-[60vh] md:max-h-none overflow-y-auto'>
					<h2 className='font-bold text-foreground text-lg'>Từ vựng theo chủ đề</h2>
					<Suspense fallback={<ListCategorySuspense />}>
						<ListCategory searchParams={searchParams} />
					</Suspense>
				</div>
				<div className='bg-white p-4 md:p-6 lg:p-8 border rounded-2xl'>
					<h2 className='font-bold text-foreground text-lg'>Từ vựng của tôi</h2>
				</div>
			</div>
		</section>
	);
}
