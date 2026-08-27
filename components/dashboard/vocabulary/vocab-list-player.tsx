'use client';

import { useMemo, useState } from 'react';
import {
	ArrowLeft,
	Check,
	CheckCircle2,
	ChevronDown,
	Gamepad2,
	Headphones,
	Lightbulb,
	Menu,
	RefreshCw,
	Settings2,
	Shuffle,
	Star,
	Volume2,
	BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { getWordsByTopicId } from '@/services/vocab-word';
import { WordCard } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function VocabListPlayer({
	words,
	categoryName,
}: {
	words: WordCard[];
	categoryName: string;
}) {
	const [index, setIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [learned, setLearned] = useState<string[]>([]);
	const current = words[index];
	const speak = () => {
		if ('speechSynthesis' in window)
			window.speechSynthesis.speak(new SpeechSynthesisUtterance(current.word));
	};
	const next = () => {
		setIndex((value) => (value + 1) % words.length);
		setShowMeaning(false);
	};
	const toggle = (list: string[], setList: (value: string[]) => void, word: string) =>
		setList(list.includes(word) ? list.filter((item) => item !== word) : [...list, word]);

	return (
		<>
			<div className='mx-auto max-w-5xl px-4 pb-12'>
				<div className='flex items-center gap-2 py-5 text-sm text-muted-foreground'>
					<Lightbulb className='size-4' /> Hiển thị gợi ý{' '}
					<span className='ml-auto hidden text-xs md:block'>Bộ từ: {categoryName}</span>
				</div>
				<section className='rounded-2xl border bg-card p-6 text-center shadow-sm md:p-12'>
					<p className='mb-5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
						{categoryName}
					</p>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl mb-4'>
						{current.word}
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
						onClick={() => setShowMeaning((value) => !value)}
						className='mt-8 text-sm text-muted-foreground hover:text-foreground'>
						{/* {showMeaning ? current.meaning : 'Nhấn để xem nghĩa'} */}
						{showMeaning ? 'meaning' : 'Nhấn để xem nghĩa'}
					</Button>
				</section>
				<div className='flex items-center justify-center gap-5 py-5'>
					<button
						onClick={() => {
							setIndex((value) => (value - 1 + words.length) % words.length);
							setShowMeaning(false);
						}}
						className='rounded-xl border p-3 hover:bg-muted'
						aria-label='Từ trước'>
						←
					</button>
					<span className='font-semibold'>
						{index + 1} <span className='text-muted-foreground'>/ {words.length}</span>
					</span>
					<button
						onClick={next}
						className='rounded-xl border p-3 hover:bg-muted'
						aria-label='Từ tiếp theo'>
						→
					</button>
				</div>
				<div className='flex flex-col gap-3 py-2 md:flex-row md:items-center md:justify-between'>
					<h2 className='font-semibold text-muted-foreground'>
						{words.length} thuật ngữ
					</h2>
					<div className='flex flex-wrap items-center gap-2 text-sm'>
						<button className='inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted'>
							<BookOpen /> Xem chi tiết
						</button>
						<span className='text-muted-foreground'>★ {favorites.length}</span>
						<span className='text-muted-foreground'>✓ Đã thuộc ({learned.length})</span>
						<button className='inline-flex items-center gap-1 text-muted-foreground'>
							Thứ tự gốc <ChevronDown className='size-4' />
						</button>
					</div>
				</div>
				<div className='flex flex-col gap-3 pt-2'>
					{words.map((item) => (
						<article
							key={item.word}
							className='rounded-xl border bg-card p-4 shadow-sm md:p-5'>
							<div className='grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start'>
								<div>
									<h3 className='font-bold'>{item.word}</h3>
								</div>
								{/* <h3 className='font-semibold'>{item.meaning}</h3> */}
								<h3 className='font-semibold'>Meaning</h3>
								<div className='flex gap-4 text-muted-foreground'>
									<button
										onClick={() => {
											if ('speechSynthesis' in window)
												window.speechSynthesis.speak(
													new SpeechSynthesisUtterance(item.word),
												);
										}}
										aria-label={`Phát âm ${item.word}`}>
										<Volume2 className='size-4' />
									</button>
									<button
										onClick={() => toggle(favorites, setFavorites, item.word)}
										aria-label={`Yêu thích ${item.word}`}
										className={
											favorites.includes(item.word) ? 'text-primary' : ''
										}>
										<Star
											className='size-4'
											fill={
												favorites.includes(item.word)
													? 'currentColor'
													: 'none'
											}
										/>
									</button>
									<button
										onClick={() => toggle(learned, setLearned, item.word)}
										aria-label={`Đánh dấu đã học ${item.word}`}
										className={
											learned.includes(item.word) ? 'text-primary' : ''
										}>
										<CheckCircle2 className='size-4' />
									</button>
								</div>
								<div className='text-sm leading-6 text-muted-foreground md:col-span-2'>
									{/* <p className='text-foreground'>{item.example}</p>
									<p>{item.translation}</p> */}

									<p className='text-foreground'>Example1</p>
									<p>example translation</p>
								</div>
							</div>
						</article>
					))}
				</div>
				<button
					onClick={next}
					className='mx-auto mt-6 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted'>
					<RefreshCw className='size-4' /> Học lại từ tiếp theo
				</button>
			</div>
		</>
	);
}
