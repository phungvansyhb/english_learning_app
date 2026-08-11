'use client';

import Link from 'next/link';
import {
	ArrowLeft,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	FileAudio,
	Image as ImageIcon,
	Lightbulb,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ListeningLesson, listeningPartLabels } from '@/lib/listening-data';
import ListeningPlayer from './listening-player';

export default function ListeningExercise({ lesson }: { lesson: ListeningLesson }) {
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [checked, setChecked] = useState(false);
	const question = lesson.questions[current];
	const result = useMemo(
		() => checked && answers[question.id] === question.answer,
		[answers, checked, question],
	);
	const choose = (value: string) => {
		setAnswers((state) => ({ ...state, [question.id]: value }));
		setChecked(false);
	};
	const move = (amount: number) => {
		setCurrent((value) => Math.max(0, Math.min(lesson.questions.length - 1, value + amount)));
		setChecked(false);
	};
	return (
		<main className='min-h-full bg-muted-background p-4 text-foreground md:p-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-6'>
				<header className='flex items-center justify-between gap-4'>
					<Link
						href='/listening'
						className='flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground'>
						<ArrowLeft className='size-4' /> Thư viện Listening
					</Link>
					<span className='rounded-full bg-card px-3 py-2 text-xs text-muted-foreground'>
						{lesson.questions.length} câu hỏi
					</span>
				</header>
				<section className='rounded-2xl border bg-card p-5 shadow-sm md:p-7'>
					<div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
						<div>
							<div className='flex flex-wrap items-center gap-2'>
								<span className='rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary'>
									{listeningPartLabels[lesson.part]}
								</span>
								<span className='rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground'>
									{lesson.difficulty}
								</span>
							</div>
							<h1 className='mt-4 text-2xl font-bold tracking-tight md:text-3xl'>
								{lesson.title}
							</h1>
							<p className='mt-2 text-sm text-muted-foreground'>{lesson.subtitle}</p>
						</div>
						<div className='rounded-xl bg-primary/10 p-4 text-sm text-primary'>
							<FileAudio className='mb-2 size-5' />
							Câu {current + 1} / {lesson.questions.length}
						</div>
					</div>
				</section>
				<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]'>
					<section className='flex flex-col gap-5'>
						<ListeningPlayer />
						{lesson.image && (
							<div className='overflow-hidden rounded-xl border bg-card shadow-sm'>
								<img
									src={lesson.image}
									alt='Minh họa cho bài nghe'
									className='h-56 w-full object-cover md:h-72'
								/>
							</div>
						)}
						{lesson.transcript && (
							<details className='rounded-xl border bg-card p-5 text-sm shadow-sm'>
								<summary className='cursor-pointer font-semibold'>
									Mở transcript sau khi nghe
								</summary>
								<p className='mt-4 whitespace-pre-line leading-7 text-muted-foreground'>
									{lesson.transcript}
								</p>
							</details>
						)}
						<article className='rounded-xl border bg-card p-5 shadow-sm md:p-7'>
							<p className='text-sm font-semibold text-primary'>Câu {question.id}</p>
							<h2 className='mt-3 text-lg font-semibold leading-7'>
								{question.prompt}
							</h2>
							<div className='mt-6 grid gap-3'>
								{question.options.map((option, index) => (
									<button
										key={option}
										onClick={() => choose(option)}
										className={cn(
											'flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors',
											answers[question.id] === option
												? 'border-primary bg-primary/10'
												: 'hover:bg-secondary',
										)}>
										<span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-muted-foreground'>
											{String.fromCharCode(65 + index)}
										</span>
										{option}
									</button>
								))}
							</div>
							{checked && (
								<div
									className={cn(
										'mt-5 flex items-center gap-2 rounded-lg p-3 text-sm',
										result
											? 'bg-primary/10 text-primary'
											: 'bg-destructive/10 text-destructive',
									)}>
									<CheckCircle2 className='size-4' />
									{result
										? 'Chính xác! Hãy tiếp tục duy trì nhịp nghe này.'
										: `Đáp án tham khảo: ${question.answer}`}
								</div>
							)}
							<div className='mt-7 flex flex-wrap justify-between gap-3 border-t pt-5'>
								<button
									onClick={() => move(-1)}
									disabled={current === 0}
									className='inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-40'>
									<ChevronLeft className='size-4' /> Trước
								</button>
								<button
									onClick={() => setChecked(true)}
									disabled={!answers[question.id]}
									className='rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40'>
									Kiểm tra
								</button>
								<button
									onClick={() => move(1)}
									disabled={current === lesson.questions.length - 1}
									className='inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-40'>
									Tiếp <ChevronRight className='size-4' />
								</button>
							</div>
						</article>
					</section>
					<aside className='flex flex-col gap-4'>
						<div className='rounded-xl border bg-card p-5 shadow-sm'>
							<div className='flex items-center gap-2 font-semibold'>
								<Lightbulb className='size-4 text-primary' /> Mẹo nghe nhanh
							</div>
							<p className='mt-3 text-sm leading-6 text-muted-foreground'>
								Nghe lần đầu để nắm bối cảnh. Nếu bỏ lỡ một từ, hãy giữ nhịp và tập
								trung vào từ khóa ở lần nghe tiếp theo.
							</p>
						</div>
						<div className='rounded-xl border bg-card p-5 shadow-sm'>
							<p className='text-sm font-semibold'>Câu hỏi</p>
							<div className='mt-4 grid grid-cols-5 gap-2'>
								{lesson.questions.map((item, index) => (
									<button
										key={item.id}
										onClick={() => setCurrent(index)}
										className={cn(
											'size-9 rounded-lg border text-xs font-semibold',
											current === index
												? 'border-primary bg-primary text-primary-foreground'
												: answers[item.id]
													? 'border-primary/40 bg-primary/10 text-primary'
													: 'bg-background text-muted-foreground',
										)}>
										{item.id}
									</button>
								))}
							</div>
						</div>
						<div className='rounded-xl border border-dashed bg-card p-5 text-xs leading-6 text-muted-foreground'>
							<ImageIcon className='mb-2 size-4 text-primary' />
							Phím tắt: Space phát/dừng · R replay · ← → tua 5 giây · ↑ ↓ âm lượng · M
							mute.
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
