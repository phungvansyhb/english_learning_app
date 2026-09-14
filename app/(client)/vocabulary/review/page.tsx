import SrsReview from '@/components/dashboard/vocabulary/srs-review';
import { getDueVocabWords } from '@/services/vocab-word';

export const metadata = {
	title: 'Ôn tập từ vựng',
};

export default async function VocabularyReviewPage() {
	const { cards, dueCount } = await getDueVocabWords();

	return (
		<section>
			<div className='flex items-end justify-between gap-4'>
				<div>
					<p className='text-sm font-medium text-primary'>SRS</p>
					<h1 className='mt-1 text-2xl font-bold tracking-tight'>Ôn tập từ vựng</h1>
					<p className='mt-2 text-sm text-muted-foreground'>
						Ôn đúng thời điểm để ghi nhớ lâu hơn.
					</p>
				</div>
				<div className='rounded-xl bg-primary/10 px-4 py-3 text-right'>
					<p className='text-2xl font-bold text-primary'>{dueCount}</p>
					<p className='text-xs text-muted-foreground'>từ đến hạn</p>
				</div>
			</div>
			<SrsReview
				initialCards={cards}
				dueCount={dueCount}
			/>
		</section>
	);
}
