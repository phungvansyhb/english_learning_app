'use client';
import Link from 'next/link';
import {
	ArrowRight,
	BookMarked,
	CheckCircle2,
	Clock3,
	Play,
	RotateCcw,
	SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { attempts, testParts, tests } from '@/lib/test-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestLibrary() {
	const [selected, setSelected] = useState(tests[0]);
	const [parts, setParts] = useState(testParts.map((part) => part.id));
	const [mode, setMode] = useState<'quick' | 'full'>('quick');
	const togglePart = (id: (typeof parts)[number]) =>
		setParts((current) =>
			current.includes(id) ? current.filter((part) => part !== id) : [...current, id],
		);
	const questionCount = mode === 'full' ? 200 : Math.min(30, Math.max(10, parts.length * 6));
	return (
		<main className='min-h-full bg-muted-background p-4 text-foreground md:p-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-7'>
				<section className='rounded-2xl border bg-card p-6 shadow-sm md:p-9'>
					<div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
						<div className='flex max-w-2xl flex-col gap-3'>
							<span className='flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>
								<BookMarked className='size-3.5' /> Test center
							</span>
							<h1 className='text-balance text-3xl font-bold tracking-tight md:text-4xl'>
								Chọn cách bạn muốn kiểm tra hôm nay
							</h1>
							<p className='text-pretty leading-6 text-muted-foreground'>
								Làm một vài Part để luyện nhanh, hoặc mô phỏng đầy đủ áp lực của bài
								TOEIC thật.
							</p>
						</div>
						<div className='rounded-xl bg-secondary p-4'>
							<p className='text-xs text-muted-foreground'>Điểm gần nhất</p>
							<p className='mt-1 text-2xl font-bold text-primary'>
								785{' '}
								<span className='text-sm font-medium text-muted-foreground'>
									TOEIC
								</span>
							</p>
						</div>
					</div>
				</section>
				<section className='grid gap-4 md:grid-cols-3'>
					{tests.map((test) => (
						<button
							key={test.slug}
							onClick={() => setSelected(test)}
							className={`text-left rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary/50 ${selected.slug === test.slug ? 'border-primary ring-2 ring-primary/10' : ''}`}>
							<div className='flex items-start justify-between gap-3'>
								<Badge variant='secondary'>{test.accent}</Badge>
								<span className='text-xs text-muted-foreground'>
									{test.difficulty}
								</span>
							</div>
							<h2 className='mt-5 text-lg font-bold'>{test.title}</h2>
							<p className='mt-2 min-h-12 text-sm leading-6 text-muted-foreground'>
								{test.subtitle}
							</p>
							<div className='mt-5 flex items-center gap-4 text-xs text-muted-foreground'>
								<span className='flex items-center gap-1'>
									<Clock3 className='size-3.5' /> {test.duration} phút
								</span>
								<span>{test.questions} câu</span>
							</div>
						</button>
					))}
				</section>
				<section className='grid gap-5 lg:grid-cols-[1fr_340px]'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-2'>
								<SlidersHorizontal className='size-4 text-primary' />
								<CardTitle>Cấu hình bài kiểm tra</CardTitle>
							</div>
							<CardDescription>
								Chọn phạm vi phù hợp trước khi bắt đầu.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col gap-6'>
							<div>
								<p className='mb-3 text-sm font-semibold'>Chế độ làm bài</p>
								<div className='grid gap-3 sm:grid-cols-2'>
									{(['quick', 'full'] as const).map((value) => (
										<button
											key={value}
											onClick={() => setMode(value)}
											className={`rounded-xl border p-4 text-left ${mode === value ? 'border-primary bg-primary/5' : 'bg-background'}`}>
											<p className='font-semibold'>
												{value === 'quick' ? 'Rút gọn' : 'Đầy đủ full test'}
											</p>
											<p className='mt-1 text-xs leading-5 text-muted-foreground'>
												{value === 'quick'
													? '10–30 câu, phù hợp cho một phiên ngắn.'
													: 'Đủ 200 câu theo cấu trúc TOEIC.'}
											</p>
										</button>
									))}
								</div>
							</div>
							<div>
								<p className='mb-3 text-sm font-semibold'>Chọn Part muốn làm</p>
								<div className='flex flex-wrap gap-2'>
									{testParts.map((part) => (
										<button
											key={part.id}
											onClick={() => togglePart(part.id)}
											className={`rounded-lg border px-3 py-2 text-sm ${parts.includes(part.id) ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
											{part.label}
										</button>
									))}
								</div>
							</div>
							<div className='flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-sm'>
								<span className='text-muted-foreground'>
									{parts.length} Part · {questionCount} câu ·{' '}
									{mode === 'full' ? 120 : 30} phút
								</span>
								<Button asChild>
									<Link
										href={`/test/${selected.slug}?parts=${parts.join(',')}&mode=${mode}`}>
										<Play data-icon='inline-start' /> Bắt đầu bài test
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Bài đang dở</CardTitle>
							<CardDescription>Tiếp tục nơi bạn đã dừng lại.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='rounded-xl bg-secondary p-4'>
								<div className='flex items-center justify-between'>
									<Badge variant='outline'>32/60 câu</Badge>
									<span className='text-xs text-muted-foreground'>53%</span>
								</div>
								<h3 className='mt-3 font-semibold'>Reading Focus Test</h3>
								<div className='mt-3 h-2 rounded-full bg-background'>
									<div className='h-2 w-[53%] rounded-full bg-primary' />
								</div>
								<Button
									variant='outline'
									className='mt-4 w-full'
									asChild>
									<Link href='/test/toeic-reading-focus'>
										<RotateCcw data-icon='inline-start' /> Tiếp tục
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</section>
				<section>
					<div className='mb-3 flex items-end justify-between'>
						<div>
							<h2 className='text-xl font-bold'>Lịch sử làm bài</h2>
							<p className='mt-1 text-sm text-muted-foreground'>
								Theo dõi điểm số và những lần bạn đã thử.
							</p>
						</div>
						<span className='text-sm text-muted-foreground'>3 lần gần nhất</span>
					</div>
					<div className='overflow-hidden rounded-xl border bg-card'>
						{attempts.map((attempt) => (
							<div
								key={attempt.title}
								className='flex flex-col gap-3 border-b p-4 last:border-b-0 md:flex-row md:items-center md:justify-between'>
								<div className='flex items-start gap-3'>
									<CheckCircle2 className='mt-0.5 size-5 text-primary' />
									<div>
										<p className='font-semibold'>{attempt.title}</p>
										<p className='mt-1 text-xs text-muted-foreground'>
											{attempt.date} · {attempt.duration} · {attempt.correct}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-4'>
									<Badge
										variant={
											attempt.status === 'Có thể tiếp tục'
												? 'secondary'
												: 'outline'
										}>
										{attempt.status}
									</Badge>
									<span className='min-w-14 text-right font-bold text-primary'>
										{attempt.score}
									</span>
									<ArrowRight className='size-4 text-muted-foreground' />
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
