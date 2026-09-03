'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Ttip from '@/components/ui/ttip';
import { WordCard } from '@/lib/types';
import { PreviewCard } from '@base-ui/react';
import {
	BrainIcon,
	MessageCircleDashedIcon,
	PodiumIcon,
	Volume2
} from 'lucide-react';
import { Activity, useEffect, useState, useTransition } from 'react';

type Props = {
	words: WordCard[];
};

export default function LearnMode({ words }: Props) {
	const [isPending, startTransition] = useTransition();
	const [index, setIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const [learned, setLearned] = useState<string[]>([]);
	const current = words[index];

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
	const toggleLearned = () => {
		startTransition(async () => {
			await new Promise((resolve) => setTimeout(resolve, 300));
			if (!learned.includes(current.word)) {
				setLearned((prev) => [...prev, current.word]);
			} else {
				setLearned((prev) => prev.filter((word) => word !== current.word));
			}
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
				default:
					break;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [next, words.length, flipCard, toggleLearned]);

	return (
		<div>
			<section className='rounded-2xl border bg-card flex justify-between items-start p-6 mt-6'>
				<div className='mx-auto text-center duration-500'>
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
					<Activity mode={showMeaning ? 'visible' : 'hidden'}>
						<div className='mt-4 animate-accordion-down'>
							{current.meanings && current.meanings.length > 0 && (
								<section className='mt-2 text-left'>
									<h3>Ý nghĩa:</h3>
									<div className='text-sm leading-6 text-muted-foreground '>
										{current.meanings &&
											current.meanings.length > 0 &&
											current.meanings.map((m) => (
												<div
													key={m.id}
													className='align-baseline'>
													-{' '}
													{m.is_primary_use && (
														<Ttip
															triggerComponent={
																<PodiumIcon className='size-4 text-primary inline' />
															}>
															Đây là nghĩa chính của từ
														</Ttip>
													)}{' '}
													<span>{m.meaning}</span>{' '}
													<span>({m.part_of_speech})</span>:{' '}
													<PreviewCard.Root>
														<span className='text-primary underline underline-offset-4 decoration-dashed decoration-1 cursor-pointer'>
															<PreviewCard.Trigger>
																{m.example}
															</PreviewCard.Trigger>
														</span>

														<PreviewCard.Portal>
															<PreviewCard.Positioner
																sideOffset={8}
																side='top'>
																<PreviewCard.Popup className='p-2 px-4 bg-secondary text-sm rounded-lg'>
																	<span>
																		{' '}
																		{m.example_meaning}
																	</span>
																</PreviewCard.Popup>
															</PreviewCard.Positioner>
														</PreviewCard.Portal>
													</PreviewCard.Root>
												</div>
											))}
									</div>
								</section>
							)}
							{current.collocations && current.collocations.length > 0 && (
								<section className='mt-2 text-left'>
									<h3>Các cụm từ:</h3>
									<div className='text-sm leading-6 text-muted-foreground '>
										{current.collocations &&
											current.collocations.length > 0 &&
											current.collocations.map((c) => (
												<div
													key={c.id}
													className='flex gap-1'>
													<span>- {c.phrase}: </span>
													<span> {c.meaning}</span>
												</div>
											))}
									</div>
								</section>
							)}
							{current.relations && current.relations.length > 0 && (
								<section className='mt-2 text-left'>
									<h3>Các từ liên quan:</h3>
									{current.relations.filter((r) => r.relation_type === 'SYNONYMS')
										.length > 0 && (
										<div className='flex gap-1.5 items-baseline mt-2'>
											<Badge className='lowercase '>Đồng nghĩa</Badge>
											<p className='text-sm text-muted-foreground'>
												{current.relations
													.filter((r) => r.relation_type === 'SYNONYMS')
													.map((r) => r.word)
													.join(', ')}
											</p>
										</div>
									)}
									{current.relations.filter((r) => r.relation_type === 'ANTONYMS')
										.length > 0 && (
										<div className='flex gap-1.5 items-baseline mt-2'>
											<Badge className='lowercase '>Trái nghĩa</Badge>
											<p className='text-sm text-muted-foreground'>
												{current.relations
													.filter((r) => r.relation_type === 'ANTONYMS')
													.map((r) => r.word)
													.join(', ')}
											</p>
										</div>
									)}
								</section>
							)}
						</div>
					</Activity>
					<Button
						variant='secondary'
						onClick={flipCard}
						className='mt-4 text-sm text-muted-foreground hover:text-foreground'>
						{showMeaning ? 'Đóng' : 'Nhấn để xem nghĩa'}
					</Button>
				</div>
				<div className='flex gap-1 text-muted-foreground justify-end'>
					<Button
						size='icon-lg'
						variant={learned.includes(current.word) ? 'secondary' : 'ghost'}
						onClick={() => toggleLearned()}
						aria-label={`Đánh dấu đã học ${current.word}`}
						className={learned.includes(current.word) ? 'text-primary' : ''}
						loading={isPending}>
						{learned.includes(current.word) ? (
							<BrainIcon className='size-6' />
						) : (
							<MessageCircleDashedIcon className='size-6' />
						)}
					</Button>
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
		</div>
	);
}
