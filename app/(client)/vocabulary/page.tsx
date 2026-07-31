import React from 'react';
import { vocabCategories } from '@/lib/data';
import CategoryVocab from '@/components/dashboard/vocabulary/category-vocab';
type Props = {};

export default function VocabScreen({}: Props) {
	return (
		<section>
			<div className='gap-6 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] mt-6'>
				<div className='bg-muted p-4 md:p-6 lg:p-8 rounded-2xl max-h-[60vh] md:max-h-none overflow-y-auto'>
					<h2 className='font-bold text-foreground text-lg'>Từ vựng theo chủ đề</h2>
					<div className='gap-4 columns-2 md:columns-4 mt-4'>
						{vocabCategories.map((item) => (
							<CategoryVocab
								{...item}
								cardClassName='break-inside-avoid mb-4'
								key={item.id}
							/>
						))}
					</div>
				</div>
				<div className='bg-white p-4 md:p-6 lg:p-8 border rounded-2xl'>
					<h2 className='font-bold text-foreground text-lg'>Từ vựng của tôi</h2>
				</div>
			</div>
		</section>
	);
}
