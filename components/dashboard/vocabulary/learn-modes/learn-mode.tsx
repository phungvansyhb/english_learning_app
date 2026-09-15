'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Ttip from '@/components/ui/ttip';
import { useDrag } from '@/hooks/use-drag';
import { WordCard } from '@/lib/types';
import { markWordLearningState } from '@/services/vocab-word';
import { KeyboardIcon, PodiumIcon, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Activity, useEffect, useRef, useState, useTransition } from 'react';
import ShortcutBoard from '../shortcut-board';

type Props = {
	words: WordCard[];
};

export default function LearnMode({ words }: Props) {
	const params = useSearchParams();
	const { category } = useParams();
	const [isPending, startTransition] = useTransition();
	const [index, setIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const current = words[index];
	const cardRef = useRef<HTMLDivElement>(null);
	const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

	const { direction, offset, progress, isDragging } = useDrag(cardRef, {
		onSwipe: (swipe) => {
			setSwipeDirection(swipe);
			startTransition(async () => {
				await markWordLearningState(current.id, swipe === 'left' ? 'new' : 'known');
				setIndex((value) => value + 1);
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
		if (index + 1 < words.length) {
			setIndex((value) => value + 1);
			setShowMeaning(false);
		}
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

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
				e.preventDefault();
			}
			switch (e.code) {
				case 'Space':
					flipCard();
					break;
				default:
					break;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [next, words.length, flipCard]);

	const DoneMessage = () => {
		return (
			<Activity mode={index + 1 > words.length ? 'visible' : 'hidden'}>
				<section className='w-full flex justify-center mt-6 animate-in slide-in-from-bottom-50 duration-200'>
					<div className='text-left'>
						<h3 className='text-2xl font-bold'>Hoàn thành</h3>
						<br />
						<span className='text-muted-foreground'>
							Xin chúc mừng bạn đã hoàn thành chủ để từ vựng
						</span>
						<br />
						<Link
							href={`/vocabulary/${category}?id=${params.get('id')}`}
							replace>
							<Button
								variant='default'
								className='mt-2'>
								Luyện tập ngay
							</Button>
						</Link>
					</div>
				</section>
			</Activity>
		);
	};

	if (words.length === 0) return <DoneMessage />;
	return (
		<div>
			{/* ==============card ========== */}
			<Activity mode={index + 1 <= words.length ? 'visible' : 'hidden'}>
				<>
					<section
						className={`w-1/2 relative overflow-hidden rounded-2xl border bg-card flex justify-between items-center p-6 mt-6 mx-auto ${
							isDragging
								? 'cursor-grabbing'
								: 'cursor-grab transition-transform duration-200'
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
								previewDirection === 'left'
									? 'right-0 bg-brand-orange'
									: 'left-0 bg-muted'
							}`}
							style={{ width: previewDirection ? previewWidth : '0%' }}
						/>
						<div className='relative z-10 w-full perspective-[1000px]'>
							<div
								className='grid min-h-[360px] w-full transition-transform duration-700 transform-3d'
								style={{
									transform: showMeaning ? 'rotateY(180deg)' : 'rotateY(0deg)',
								}}>
								<div className='col-start-1 row-start-1 flex items-center justify-center backface-hidden'>
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
								<div className='col-start-1 row-start-1 flex rotate-y-180 items-center backface-hidden'>
									<div className='w-full px-10'>
										<div className='text-left'>
											<h2 className='mb-4 text-2xl font-bold'>Meanings</h2>
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
													<h3 className='font-semibold'>Collocations:</h3>
													{current.collocations.map((collocation) => (
														<div
															key={collocation.id}
															className='text-sm text-muted-foreground'>
															- {collocation.phrase}:{' '}
															{collocation.meaning}
														</div>
													))}
												</section>
											) : null}
											{current.relations && current.relations.length > 0 && (
												<section className='mt-2'>
													<h3 className='font-semibold'>
														Related words:
													</h3>
													{current.relations.filter(
														(r) => r.relation_type === 'SYNONYMS',
													).length > 0 && (
														<div className='flex gap-1.5 items-baseline mt-2'>
															<Badge className='lowercase '>
																SYNONYMS
															</Badge>
															<p className='text-sm text-muted-foreground'>
																{current.relations
																	.filter(
																		(r) =>
																			r.relation_type ===
																			'SYNONYMS',
																	)
																	.map((r) => r.word)
																	.join(', ')}
															</p>
														</div>
													)}
													{current.relations.filter(
														(r) => r.relation_type === 'ANTONYMS',
													).length > 0 && (
														<div className='flex gap-1.5 items-baseline mt-2'>
															<Badge className='lowercase '>
																ANTONYMS
															</Badge>
															<p className='text-sm text-muted-foreground'>
																{current.relations
																	.filter(
																		(r) =>
																			r.relation_type ===
																			'ANTONYMS',
																	)
																	.map((r) => r.word)
																	.join(', ')}
															</p>
														</div>
													)}
												</section>
											)}
										</div>
										<div className='flex justify-center'>
											<Button
												variant='secondary'
												onClick={flipCard}
												className='mt-6 text-sm text-muted-foreground hover:text-foreground '>
												Đóng
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className='flex items-center justify-center gap-5 py-5'>
						<span className='font-semibold'>
							{index + 1}{' '}
							<span className='text-muted-foreground'>/ {words.length}</span>
						</span>
					</div>
				</>
			</Activity>

			<DoneMessage />

			{/* ===== Keyboard shortcut ========= */}
			<Activity mode={index + 1 <= words.length ? 'visible' : 'hidden'}>
				<ShortcutBoard />
			</Activity>
		</div>
	);
}
