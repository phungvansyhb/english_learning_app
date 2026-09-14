'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Ttip from '@/components/ui/ttip';
import { useDrag } from '@/hooks/use-drag';
import { WordCard } from '@/lib/types';
import { markWordLearningState } from '@/services/vocab-word';
import { PreviewCard } from '@base-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, KeyboardIcon, PodiumIcon, Volume2 } from 'lucide-react';
import { Activity, useEffect, useRef, useState, useTransition } from 'react';

type Props = {
	words: WordCard[];
};

export default function LearnMode({ words }: Props) {
	const [isPending, startTransition] = useTransition();
	const [index, setIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const [learned, setLearned] = useState<string[]>([]);
	const current = words[index];
	const cardRef = useRef<HTMLDivElement>(null);
	const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
	const { direction, offset, progress, isDragging } = useDrag(cardRef, {
		onSwipe: (swipe) => {
			setSwipeDirection(swipe);
			startTransition(async () => {
				await markWordLearningState(current.id, swipe === 'left' ? 'new' : 'known');
				setIndex((value) => (value + 1) % words.length);
				setShowMeaning(false);
				setSwipeDirection(null);
			});
		},
	});
	const speak = (langCode: string) => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(current.word);
			utterance.lang = langCode;
			window.speechSynthesis.speak(utterance);
		}
	};
	const next = () => {
		setIndex((value) => (value + 1) % words.length);
		setShowMeaning(false);
	};

	const flipCard = () => {
		setShowMeaning(!showMeaning);
	};

	const getPrimaryMeaning = (item: WordCard) => {
		if (item.meanings && item.meanings.length > 0) {
			return item.meanings.find((m) => m.is_primary_use) || null;
		}
		return null;
	};
	const previewDirection = direction ?? swipeDirection;
	const previewWidth = `${Math.max(progress, swipeDirection ? 1 : 0) * 100}%`;

	const toggleLearned = () => {
		startTransition(async () => {
			await markWordLearningState(current.id, 'known');
			if (!learned.includes(current.word)) {
				setLearned((prev) => [...prev, current.word]);
			} else {
				setLearned((prev) => prev.filter((word) => word !== current.word));
			}
			setIndex((value) => (value - 1 + words.length) % words.length);
		});
	};

	const toggleNewWord = () => {
		startTransition(async () => {
			await markWordLearningState(current.id, 'new');
			setIndex((value) => (value - 1 + words.length) % words.length);
		});
	};

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
				e.preventDefault();
			}
			switch (e.code) {
				case 'ArrowRight':
					next();
					break;
				case 'ArrowLeft':
					setIndex((value) => (value - 1 + words.length) % words.length);
					setShowMeaning(false);
					break;
				case 'Space':
					flipCard();
					break;
				case 'Enter':
					toggleLearned();
					break;
				case 'Tab':
					toggleNewWord();
					break;
				default:
					break;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [next, words.length, flipCard, toggleLearned]);

	return (
		<div>
			<section
				className={`w-1/2 relative overflow-hidden rounded-2xl border bg-card flex justify-between items-center p-6 mt-6 mx-auto ${
					isDragging ? 'cursor-grabbing' : 'cursor-grab transition-transform duration-200'
				}`}
				ref={cardRef}
				style={{
					transform: `translate3d(${offset.x}px, 0, 0) rotate(${offset.x / 20}deg)`,
					transition: isDragging ? undefined : 'transform 200ms ease-out',
					touchAction: 'pan-y',
					userSelect: 'none',
				}}>
				<div
					aria-hidden='true'
					className={`pointer-events-none absolute inset-y-0 z-0 transition-[width] duration-150 ease-out ${
						previewDirection === 'left' ? 'right-0 bg-brand-orange' : 'left-0 bg-muted'
					}`}
					style={{ width: previewDirection ? previewWidth : '0%' }}
				/>
				<div className='relative z-10 w-full [perspective:1000px]'>
					<div
						className='grid min-h-[360px] w-full transition-transform duration-700 [transform-style:preserve-3d]'
						style={{ transform: showMeaning ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
						<div className='col-start-1 row-start-1 flex items-center justify-center [backface-visibility:hidden]'>
							<div className='mx-auto text-center'>
								<h1 className='text-4xl font-bold tracking-tight md:text-5xl mb-4'>
									{current.word}
									<span className='text-muted-foreground text-base ml-3'>
										({getPrimaryMeaning(current)?.part_of_speech})
									</span>
								</h1>
								<div className='flex gap-2 justify-center items-center'>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => speak('en-GB')}>
										<Volume2 className='size-5' />
									</Button>
									{current.ipa_uk}
								</div>
								<div className='flex gap-2 justify-center items-center'>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => speak('en-US')}>
										<Volume2 className='size-5' />
									</Button>
									{current.ipa_us}
								</div>
								<Button
									variant='secondary'
									onClick={() => flipCard()}
									className='mt-4 text-sm text-muted-foreground hover:text-foreground'>
									{showMeaning ? 'Đóng' : 'Nhấn để xem nghĩa'}
								</Button>
							</div>
						</div>
						<div className='col-start-1 row-start-1 flex rotate-y-180 items-center justify-center [backface-visibility:hidden]'>
							<div className='w-full max-w-2xl text-left'>
								<h2 className='mb-4 text-2xl font-bold'>Ý nghĩa</h2>
								<div className='space-y-3 text-sm leading-6 text-muted-foreground'>
									{current.meanings?.map((meaning) => (
										<div key={meaning.id}>
											<span className='mr-1'>-</span>
											{meaning.is_primary_use && (
												<Ttip
													triggerComponent={
														<PodiumIcon className='mr-1 inline size-4 text-primary' />
													}>
													Đây là nghĩa chính của từ
												</Ttip>
											)}
											{meaning.meaning} ({meaning.part_of_speech})
										</div>
									))}
								</div>
								{current.collocations?.length ? (
									<section className='mt-4'>
										<h3 className='font-semibold'>Các cụm từ:</h3>
										{current.collocations.map((collocation) => (
											<div
												key={collocation.id}
												className='text-sm text-muted-foreground'>
												- {collocation.phrase}: {collocation.meaning}
											</div>
										))}
									</section>
								) : null}
								<Button
									variant='secondary'
									onClick={flipCard}
									className='mt-6 text-sm text-muted-foreground hover:text-foreground'>
									Đóng
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className='flex items-center justify-center gap-5 py-5'>
				<Button
					size='icon'
					variant='ghost'
					onClick={() => {
						setIndex((value) => (value - 1 + words.length) % words.length);
						setShowMeaning(false);
					}}
					className='rounded-xl border p-3 hover:bg-muted'
					aria-label='Từ trước'>
					←
				</Button>
				<span className='font-semibold'>
					{index + 1} <span className='text-muted-foreground'>/ {words.length}</span>
				</span>
				<Button
					size='icon'
					variant='ghost'
					onClick={next}
					className='rounded-xl border p-3 hover:bg-muted'
					aria-label='Từ tiếp theo'>
					→
				</Button>
			</div>
			<section className='flex flex-col items-center gap-4 text-muted-foreground'>
				<KeyboardIcon className='size-6' />
				<div className='space-y-2 text-sm'>
					<div className='flex items-center'>
						Use <ArrowLeftIcon className='size-4 mx-2' /> to view previous
					</div>
					<div className='flex items-center'>
						Use <ArrowRightIcon className='size-4 mx-2' /> to view next
					</div>
					<div className='flex gap-2 items-center'>
						Use <Badge>space</Badge> to toggle meaning
					</div>
					<div className='flex gap-2 items-center'>
						Use <Badge>enter</Badge> to mark as learned
					</div>
					<div className='flex gap-2 items-center'>
						Use <Badge>tab</Badge> to mark as new
					</div>
				</div>
			</section>
		</div>
	);
}
