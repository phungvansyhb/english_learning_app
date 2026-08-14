'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock3, Flag, Pause, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { testQuestions, testPartLabel, TestPart } from '@/lib/test-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestRunner({
	title,
	selectedParts,
}: {
	title: string;
	selectedParts: TestPart[];
}) {
	const questions = useMemo(
		() =>
			testQuestions.filter(
				(question) =>
					selectedParts.length === 0 ||
					selectedParts.some((part) => testPartLabel[part] === question.part),
			),
		[selectedParts],
	);
	const items = questions.length ? questions : testQuestions;
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [submitted, setSubmitted] = useState(false);
	const [paused, setPaused] = useState(false);
	const question = items[current];
	const answered = Object.keys(answers).length;
	const progress = Math.round((answered / items.length) * 100);
	if (submitted)
		return (
			<main className='min-h-full bg-muted-background p-4 md:p-8'>
				<div className='mx-auto flex max-w-3xl flex-col gap-5'>
					<Card>
						<CardHeader>
							<Badge variant='secondary'>Test complete</Badge>
							<CardTitle className='text-2xl'>Bạn đã hoàn thành {title}</CardTitle>
						</CardHeader>
						<CardContent className='flex flex-col gap-5'>
							<div className='grid gap-3 sm:grid-cols-3'>
								<div className='rounded-xl bg-secondary p-4'>
									<p className='text-xs text-muted-foreground'>Đã trả lời</p>
									<p className='mt-1 text-2xl font-bold'>
										{answered}/{items.length}
									</p>
								</div>
								<div className='rounded-xl bg-secondary p-4'>
									<p className='text-xs text-muted-foreground'>Thời gian</p>
									<p className='mt-1 text-2xl font-bold'>24:18</p>
								</div>
								<div className='rounded-xl bg-secondary p-4'>
									<p className='text-xs text-muted-foreground'>Trạng thái</p>
									<p className='mt-1 text-2xl font-bold text-primary'>Đã lưu</p>
								</div>
							</div>
							<Button asChild>
								<Link href='/test'>Về Test Center</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</main>
		);
	return (
		<main className='min-h-full bg-muted-background p-4 text-foreground md:p-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-5'>
				<header className='flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between'>
					<div className='flex items-center gap-3'>
						<Button
							variant='ghost'
							size='icon'
							asChild>
							<Link
								href='/test'
								aria-label='Quay lại Test Center'>
								<ArrowLeft />
							</Link>
						</Button>
						<div>
							<p className='text-xs text-muted-foreground'>TOEIC Test Center</p>
							<h1 className='text-lg font-bold'>{title}</h1>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='hidden items-center gap-2 text-sm text-muted-foreground sm:flex'>
							<Clock3 className='size-4' /> 29:42
						</div>
						<Button
							variant='outline'
							onClick={() => setPaused((value) => !value)}>
							<Pause data-icon='inline-start' /> {paused ? 'Tiếp tục' : 'Tạm dừng'}
						</Button>
					</div>
				</header>
				{paused && (
					<div className='rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary'>
						Bài test đang tạm dừng. Bạn có thể tiếp tục khi sẵn sàng.
					</div>
				)}
				<div className='flex items-center justify-between text-sm'>
					<span className='font-semibold'>
						Câu {current + 1} / {items.length}
					</span>
					<span className='text-muted-foreground'>
						{answered} câu đã trả lời · {progress}%
					</span>
				</div>
				<div className='h-2 rounded-full bg-secondary'>
					<div
						className='h-2 rounded-full bg-primary transition-all'
						style={{ width: `${Math.max(4, progress)}%` }}
					/>
				</div>
				<section className='grid gap-5 lg:grid-cols-[1fr_280px]'>
					<Card>
						<CardHeader>
							<div className='flex items-center justify-between gap-3'>
								<Badge variant='outline'>{question.part}</Badge>
								<span className='text-xs text-muted-foreground'>
									Question {question.id}
								</span>
							</div>
							<CardTitle className='pt-3 text-xl leading-8'>
								{question.prompt}
							</CardTitle>
						</CardHeader>
						<CardContent className='flex flex-col gap-3'>
							{question.options.map((option, index) => (
								<button
									key={option}
									onClick={() =>
										setAnswers((currentAnswers) => ({
											...currentAnswers,
											[question.id]: index,
										}))
									}
									className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${answers[question.id] === index ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'hover:border-primary/40'}`}>
									<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold'>
										{String.fromCharCode(65 + index)}
									</span>
									{option}
									{answers[question.id] === index && (
										<Check className='ml-auto size-4 text-primary' />
									)}
								</button>
							))}
							<div className='flex items-center justify-between border-t pt-5'>
								<Button
									variant='outline'
									disabled={current === 0}
									onClick={() => setCurrent((value) => value - 1)}>
									<ArrowLeft data-icon='inline-start' /> Câu trước
								</Button>
								{current === items.length - 1 ? (
									<Button onClick={() => setSubmitted(true)}>
										<Send data-icon='inline-start' /> Nộp bài
									</Button>
								) : (
									<Button onClick={() => setCurrent((value) => value + 1)}>
										Câu tiếp theo <ArrowRight data-icon='inline-end' />
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className='text-base'>Danh sách câu hỏi</CardTitle>
						</CardHeader>
						<CardContent className='flex flex-col gap-4'>
							<div className='grid grid-cols-5 gap-2'>
								{items.map((item, index) => (
									<button
										key={item.id}
										onClick={() => setCurrent(index)}
										className={`relative size-10 rounded-lg border text-sm ${current === index ? 'border-primary bg-primary text-primary-foreground' : answers[item.id] !== undefined ? 'border-primary/40 bg-primary/10 text-primary' : 'bg-background text-muted-foreground'}`}>
										{index + 1}
										{answers[item.id] !== undefined && current !== index && (
											<span className='absolute -right-1 -top-1 size-2 rounded-full bg-primary' />
										)}
									</button>
								))}
							</div>
							<div className='flex items-center gap-2 text-xs text-muted-foreground'>
								<Flag className='size-3.5' /> Đánh dấu câu để xem lại
							</div>
						</CardContent>
					</Card>
				</section>
			</div>
		</main>
	);
}
