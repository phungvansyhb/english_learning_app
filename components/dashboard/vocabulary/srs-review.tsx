'use client';

import { Button } from '@/components/ui/button';
import type { SrsReviewCard } from '@/services/vocab-word';
import { submitVocabReview } from '@/services/vocab-word';
import { Check, Loader2, Volume2, X } from 'lucide-react';
import { useState, useTransition } from 'react';

type Props = {
	initialCards: SrsReviewCard[];
	dueCount: number;
};

function getPrimaryMeaning(card: SrsReviewCard) {
	return card.meanings.find((meaning) => meaning.is_primary_use) ?? card.meanings[0];
}

export default function SrsReview({ initialCards, dueCount }: Props) {
	const [cards, setCards] = useState(initialCards);
	const [index, setIndex] = useState(0);
	const [isRevealed, setIsRevealed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const current = cards[index];
	const sessionTotal = initialCards.length;

	function speak() {
		if ('speechSynthesis' in window && current) {
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(new SpeechSynthesisUtterance(current.word));
		}
	}

	function answer(rating: 'correct' | 'incorrect') {
		if (!current) return;
		setError(null);
		startTransition(async () => {
			try {
				await submitVocabReview(current.id, rating);
				setIndex(0);
				setIsRevealed(false);
				setCards((value) => value.filter((card) => card.id !== current.id));
			} catch (submitError) {
				setError(
					submitError instanceof Error
						? submitError.message
						: 'Không thể lưu kết quả ôn tập',
				);
			}
		});
	}

	if (!current) {
		return (
			<section className='mx-auto mt-8 max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm'>
				<div className='mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
					<Check className='size-7' />
				</div>
				<h1 className='mt-4 text-2xl font-bold'>Bạn đã hoàn thành phiên ôn</h1>
				<p className='mt-2 text-muted-foreground'>
					Không còn từ nào đến hạn trong phiên này.
				</p>
				<p className='mt-4 text-sm text-muted-foreground'>Đã xử lý {sessionTotal} từ.</p>
			</section>
		);
	}

	const meaning = getPrimaryMeaning(current);
	const completed = sessionTotal - cards.length;

	return (
		<section className='mx-auto mt-6 max-w-2xl'>
			<div className='mb-4 flex items-center justify-between text-sm text-muted-foreground'>
				<span>Ôn tập hôm nay</span>
				<span>
					{Math.max(0, completed)} / {sessionTotal} từ
				</span>
			</div>
			<div className='h-2 overflow-hidden rounded-full bg-primary/10'>
				<div
					className='h-full bg-primary transition-all'
					style={{ width: `${sessionTotal ? (completed / sessionTotal) * 100 : 100}%` }}
				/>
			</div>
			<article className='mt-6 rounded-2xl border bg-card p-6 shadow-sm md:p-10'>
				<div className='flex items-start justify-between gap-4'>
					<div>
						<p className='text-sm text-muted-foreground'>Từ vựng</p>
						<h1 className='mt-3 text-4xl font-bold tracking-tight'>{current.word}</h1>
						<p className='mt-2 text-muted-foreground'>
							{current.ipa_us || current.ipa_uk}
						</p>
					</div>
					<Button
						type='button'
						size='icon'
						variant='ghost'
						onClick={speak}
						aria-label={`Phát âm ${current.word}`}>
						<Volume2 className='size-5' />
					</Button>
				</div>
				<div className='mt-10 min-h-28 rounded-xl bg-secondary p-5 text-center'>
					{isRevealed ? (
						<>
							<p className='font-semibold'>
								{meaning?.meaning ?? 'Chưa có nghĩa chính'}
							</p>
							{meaning?.example && (
								<p className='mt-3 text-sm text-muted-foreground'>
									{meaning.example}
								</p>
							)}
						</>
					) : (
						<Button
							type='button'
							variant='outline'
							onClick={() => setIsRevealed(true)}>
							Hiện nghĩa
						</Button>
					)}
				</div>
				{error && (
					<p
						role='alert'
						className='mt-4 text-sm text-destructive text-center'>
						{error}
					</p>
				)}
				<div className='mt-8 grid grid-cols-2 gap-3'>
					<Button
						type='button'
						variant='secondary'
						disabled={isPending}
						onClick={() => answer('incorrect')}>
						{isPending ? <Loader2 className='animate-spin' /> : <X />}
						Sai
					</Button>
					<Button
						type='button'
						disabled={isPending}
						onClick={() => answer('correct')}>
						{isPending ? <Loader2 className='animate-spin' /> : <Check />}
						Đúng
					</Button>
				</div>
			</article>
		</section>
	);
}
