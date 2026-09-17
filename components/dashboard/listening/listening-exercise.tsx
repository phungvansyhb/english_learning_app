'use client';

import Link from 'next/link';
import {
	ArrowLeft,
	Check,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	FileAudio,
	Lightbulb,
	RotateCcw,
	Shuffle,
	Type,
	Volume2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ListeningLesson, listeningPartLabels } from '@/lib/listening-data';
import ListeningPlayer from '../practice/listening-player';

type PracticeMode = 'dictation' | 'ordering';

export default function ListeningExercise({ lesson }: { lesson: ListeningLesson }) {
	const [current, setCurrent] = useState(0);
	const [mode, setMode] = useState<PracticeMode>('dictation');
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [checked, setChecked] = useState(false);
	const question = lesson.questions[current];
	const answer = answers[question.id] ?? '';
	const words = useMemo(
		() => question.answer.replace(/[.!?]/g, '').split(' '),
		[question.answer],
	);
	const selectedWords = answer ? answer.split(' ') : [];
	const result = checked && answer.trim().toLowerCase() === question.answer.trim().toLowerCase();

	const updateAnswer = (value: string) => {
		setAnswers((state) => ({ ...state, [question.id]: value }));
		setChecked(false);
	};

	const chooseWord = (word: string, index: number) => {
		const next = [...selectedWords];
		next.push(word);
		updateAnswer(next.join(' '));
		if (index >= 0) {
			const remaining = words.filter((_, wordIndex) => wordIndex !== index);
			if (remaining.length === 0) updateAnswer(next.join(' '));
		}
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
						<ArrowLeft className='size-4' /> Thư viện bài nghe
					</Link>
					<span className='rounded-full bg-card px-3 py-2 text-xs text-muted-foreground'>
						{lesson.questions.length} bài tập
					</span>
				</header>

				<section className='rounded-2xl border bg-card p-5 shadow-sm md:p-7'>
					<div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
						<div>
							<div className='flex flex-wrap items-center gap-2'>
								<span className='rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary'>
									Listening practice
								</span>
								<span className='rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground'>
									{lesson.difficulty}
								</span>
							</div>
							<h1 className='mt-4 text-2xl font-bold tracking-tight md:text-3xl'>
								{lesson.title}
							</h1>
							<p className='mt-2 max-w-2xl text-sm text-muted-foreground'>
								{lesson.subtitle}
							</p>
						</div>
						<div className='rounded-xl bg-primary/10 p-4 text-sm text-primary'>
							<FileAudio className='mb-2 size-5' />
							Bài {current + 1} / {lesson.questions.length}
						</div>
					</div>
				</section>

				<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]'>
					<section className='flex flex-col gap-5'>
						<ListeningPlayer />
						<article className='rounded-2xl border bg-card p-5 shadow-sm md:p-7'>
							<div className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between'>
								<div>
									<p className='text-sm font-semibold text-primary'>
										Nghe và luyện tập
									</p>
									<h2 className='mt-2 text-lg font-semibold leading-7'>
										Nghe đoạn audio, sau đó hoàn thành câu trả lời
									</h2>
								</div>
								<span className='w-fit rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground'>
									Câu {question.id}
								</span>
							</div>

							<div className='mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1'>
								<button
									onClick={() => {
										setMode('dictation');
										setChecked(false);
									}}
									className={cn(
										'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
										mode === 'dictation'
											? 'bg-card text-foreground shadow-sm'
											: 'text-muted-foreground hover:text-foreground',
									)}>
									<Type className='size-4' /> Nghe và chép lại
								</button>
								<button
									onClick={() => {
										setMode('ordering');
										setChecked(false);
									}}
									className={cn(
										'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
										mode === 'ordering'
											? 'bg-card text-foreground shadow-sm'
											: 'text-muted-foreground hover:text-foreground',
									)}>
									<Shuffle className='size-4' /> Sắp xếp từ
								</button>
							</div>

							<p className='mt-6 text-sm leading-6 text-muted-foreground'>
								{mode === 'dictation'
									? 'Gõ lại chính xác câu bạn nghe được. Không cần viết hoa hoặc thêm dấu câu.'
									: 'Chọn các từ theo đúng thứ tự để tạo thành câu hoàn chỉnh.'}
							</p>

							{mode === 'dictation' ? (
								<textarea
									value={answer}
									onChange={(event) => updateAnswer(event.target.value)}
									placeholder='Nhập câu bạn nghe được...'
									aria-label='Câu trả lời chép lại'
									className='mt-4 min-h-32 w-full resize-y rounded-xl border bg-background p-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
								/>
							) : (
								<div className='mt-4 space-y-4'>
									<div className='flex min-h-16 flex-wrap gap-2 rounded-xl border border-dashed bg-muted/40 p-3'>
										{selectedWords.length ? (
											selectedWords.map((word, index) => (
												<span
													key={`${word}-${index}`}
													className='rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground'>
													{word}
												</span>
											))
										) : (
											<span className='self-center text-sm text-muted-foreground'>
												Các từ bạn chọn sẽ xuất hiện ở đây
											</span>
										)}
									</div>
									<div className='flex flex-wrap gap-2'>
										{words.map((word, index) => (
											<button
												key={`${word}-${index}`}
												onClick={() => chooseWord(word, index)}
												disabled={
													selectedWords.filter((item) => item === word)
														.length >=
													words.filter((item) => item === word).length
												}
												className='rounded-lg border bg-background px-3 py-2 text-sm transition hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-35'>
												{word}
											</button>
										))}
									</div>
									<button
										onClick={() => updateAnswer('')}
										className='inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground'>
										<RotateCcw className='size-3.5' /> Xóa câu trả lời
									</button>
								</div>
							)}

							{checked && (
								<div
									className={cn(
										'mt-5 flex items-start gap-2 rounded-lg p-3 text-sm',
										result
											? 'bg-primary/10 text-primary'
											: 'bg-destructive/10 text-destructive',
									)}>
									<CheckCircle2 className='mt-0.5 size-4 shrink-0' />
									{result
										? 'Chính xác! Bạn đã nghe rất tốt.'
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
									disabled={!answer.trim()}
									className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40'>
									<Check className='size-4' /> Kiểm tra
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
								<Lightbulb className='size-4 text-primary' /> Mẹo luyện nghe
							</div>
							<p className='mt-3 text-sm leading-6 text-muted-foreground'>
								Nghe lần đầu để nắm ý chính. Nghe lại từng cụm ngắn và chú ý âm cuối
								trước khi kiểm tra.
							</p>
						</div>
						<div className='rounded-xl border bg-card p-5 shadow-sm'>
							<p className='text-sm font-semibold'>Tiến độ bài nghe</p>
							<div className='mt-4 grid grid-cols-5 gap-2'>
								{lesson.questions.map((item, index) => (
									<button
										key={item.id}
										onClick={() => setCurrent(index)}
										aria-label={`Mở bài ${item.id}`}
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
							<Volume2 className='mb-2 size-4 text-primary' />
							Phím tắt: Space phát/dừng · R nghe lại · ← → tua 5 giây · M tắt tiếng.
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
