'use client';

import { Button } from '@/components/ui/button';
import { Word, WordCard } from '@/lib/types';
import { CheckCircle2, Star, Volume2 } from 'lucide-react';
import React, { useRef, useState } from 'react';

type Props = {
	words: WordCard[];
};

export default function LearnMode({ words }: Props) {
	const [index, setIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const [count, setCount] = useState(0);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [learned, setLearned] = useState<string[]>([]);
	const current = words[index];
	const cardRef = useRef<HTMLDivElement>(null);
	const speak = () => {
		if ('speechSynthesis' in window)
			window.speechSynthesis.speak(new SpeechSynthesisUtterance(current.word));
	};
	const next = () => {
		setIndex((value) => (value + 1) % words.length);
		setShowMeaning(false);
	};
	const toggle = (list: string[], setList: (value: string[]) => void, word: string) => {
		setList(list.includes(word) ? list.filter((item) => item !== word) : [...list, word]);
	};
	const flipCard = () => {
		setShowMeaning(!showMeaning);
		setCount(count + 1);
	};
	return (
		<div>
			<section className='rounded-2xl border bg-card flex justify-between items-start p-6 mt-6'>
				<div
					ref={cardRef}
					className='mx-auto text-center animate-in fade-in-20 spin-in-180 duration-500'
					key={`${current.word}-${count}`}>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl mb-4'>
						{current.word}
						<span className='text-muted-foreground text-base'>(verb)</span>
					</h1>
					<div className='flex gap-2 justify-center items-center'>
						<Button
							size='icon'
							variant='ghost'
							onClick={speak}>
							<Volume2 className='size-5' />
						</Button>
						{current.ipa_uk}
					</div>
					<div className='flex gap-2 justify-center items-center'>
						<Button
							size='icon'
							variant='ghost'
							onClick={speak}>
							<Volume2 className='size-5' />
						</Button>
						{current.ipa_us}
					</div>

					<Button
						variant='secondary'
						onClick={flipCard}
						className='mt-8 text-sm text-muted-foreground hover:text-foreground'>
						{/* {showMeaning ? current.meaning : 'Nhấn để xem nghĩa'} */}
						{showMeaning ? 'Meaning' : 'Nhấn để xem nghĩa'}
					</Button>
				</div>
				<div className='flex gap-1 text-muted-foreground justify-end'>
					<Button
						size='icon-lg'
						variant='ghost'
						onClick={() => toggle(favorites, setFavorites, current.word)}
						aria-label={`Yêu thích ${current.word}`}
						className={favorites.includes(current.word) ? 'text-primary' : ''}>
						<Star
							className='size-6'
							fill={favorites.includes(current.word) ? 'currentColor' : 'none'}
						/>
					</Button>
					<Button
						size='icon-lg'
						variant='ghost'
						onClick={() => toggle(learned, setLearned, current.word)}
						aria-label={`Đánh dấu đã học ${current.word}`}
						className={learned.includes(current.word) ? 'text-primary' : ''}>
						<CheckCircle2 className='size-6' />
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
