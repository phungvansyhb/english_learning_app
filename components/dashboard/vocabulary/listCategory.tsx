import { ServerPageProps } from '@/lib/types';
import { getMasteredWordCountsByTopic, getVocabWordCategories } from '@/services/vocab-word';
import CategoryVocab from './category-vocab';
import { Pagination } from '@/components/ui/pagination';

export function ListCategorySuspense() {
	return (
		<div className='gap-4 columns-2 md:columns-4 mt-4'>
			{Array.from({ length: 12 }).map((_, index) => (
				<div
					key={index}
					className='break-inside-avoid mb-4 bg-gray-200 rounded-lg h-32 animate-pulse'
				/>
			))}
		</div>
	);
}

export async function ListCategory({
	searchParams,
}: {
	searchParams: ServerPageProps['searchParams'];
}) {
	const { page: initPage, search: initSearch } = await searchParams;

	const { data, page, totalPages } = await getVocabWordCategories({
		page: Number(initPage) || 1,
		perPage: 12,
		sortOrder: 'asc',
		search: initSearch as string | undefined,
	});
	const masterdWordOfTopic = await getMasteredWordCountsByTopic();
	return (
		<>
			<div className='gap-4 grid grid-cols-2 md:grid-cols-3 mt-4'>
				{data.map((item) => (
					<CategoryVocab
						name={item.name}
						imageUrl={item.image_url || '/placeholder.svg'}
						description={item.description || ''}
						wordCount={item.total_word || 0}
						learnedword={
							masterdWordOfTopic.find((m) => m.topic_id === item.id)
								?.mastered_word_count ?? 0
						}
						id={item.id}
						cardClassName='break-inside-avoid mb-4'
						key={item.id}
					/>
				))}
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				isPushToUrl
			/>
		</>
	);
}
