'use client';
import Link from 'next/link';
import {
	ArrowRight,
	BarChart3,
	FileText,
	Filter,
	Mail,
	MessageSquareText,
	PenLine,
	SlidersHorizontal,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
	writingDifficulties,
	writingLessons,
	writingTypeLabels,
	writingTypes,
	WritingDifficulty,
	WritingType,
} from '@/lib/writing-data';
const icons = {
	email: Mail,
	response: MessageSquareText,
	description: FileText,
	chart: BarChart3,
	opinion: PenLine
};
export default function WritingLibrary() {
	const [type, setType] = useState<WritingType | 'all'>('all');
	const [difficulty, setDifficulty] = useState<WritingDifficulty | 'all'>('all');
	const filtered = useMemo(
		() =>
			writingLessons.filter(
				(x) =>
					(type === 'all' || x.type === type) &&
					(difficulty === 'all' || x.difficulty === difficulty),
			),
		[type, difficulty],
	);
	return (
		<main className='min-h-full bg-muted-background p-4 text-foreground md:p-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-7'>
				<section className='rounded-2xl border bg-card p-6 shadow-sm md:p-9'>
					<div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
						<div className='max-w-2xl'>
							<span className='flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>
								<PenLine className='size-3.5' /> Writing studio
							</span>
							<h1 className='mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl'>
								Viết rõ ý, đúng ngữ cảnh
							</h1>
							<p className='mt-3 text-pretty leading-6 text-muted-foreground'>
								Luyện từng dạng bài với prompt cụ thể, từ khóa gợi ý và rubric giúp
								bạn biết nên cải thiện điều gì.
							</p>
						</div>
						<div className='rounded-xl bg-secondary p-4 md:min-w-44'>
							<p className='text-xs text-muted-foreground'>Tiến độ tuần này</p>
							<p className='mt-1 text-2xl font-bold text-primary'>
								4{' '}
								<span className='text-sm font-medium text-muted-foreground'>
									/ 8 bài
								</span>
							</p>
						</div>
					</div>
				</section>
				<section className='flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between'>
					<div className='flex items-center gap-2 text-sm font-semibold'>
						<SlidersHorizontal className='size-4 text-primary' /> Chọn dạng bài
					</div>
					<div className='flex flex-col gap-3 md:flex-row md:items-center'>
						<div className='flex flex-wrap gap-2'>
							{writingTypes.map((value) => (
								<button
									key={value}
									onClick={() => setType(value)}
									className={cn(
										'rounded-lg border px-3 py-2 text-sm transition-colors',
										type === value
											? 'border-primary bg-primary text-primary-foreground'
											: 'bg-background text-muted-foreground hover:bg-secondary',
									)}>
									{writingTypeLabels[value]}
								</button>
							))}
						</div>
						<div className='flex items-center gap-2'>
							<Filter className='size-4 text-muted-foreground' />
							<select
								aria-label='Lọc độ khó'
								value={difficulty}
								onChange={(e) =>
									setDifficulty(e.target.value as WritingDifficulty | 'all')
								}
								className='rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30'>
								<option value='all'>Mọi độ khó</option>
								{writingDifficulties.slice(1).map((x) => (
									<option key={x}>{x}</option>
								))}
							</select>
						</div>
					</div>
				</section>
				<div>
					<h2 className='text-xl font-bold'>Bài viết đề xuất</h2>
					<p className='mt-1 text-sm text-muted-foreground'>
						{filtered.length} bài phù hợp với lựa chọn của bạn
					</p>
				</div>
				<div className='grid gap-4 md:grid-cols-2'>
					{filtered.map((lesson) => {
						const Icon = icons[lesson.type];
						return (
							<Link
								key={lesson.slug}
								href={`/writing/${lesson.slug}`}
								className='group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'>
								<div className='flex items-start justify-between gap-3'>
									<span className='flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary'>
										<Icon className='size-3.5' />
										{writingTypeLabels[lesson.type]}
									</span>
									<span className='text-xs text-muted-foreground'>
										{lesson.difficulty}
									</span>
								</div>
								<h3 className='mt-5 text-lg font-bold group-hover:text-primary'>
									{lesson.title}
								</h3>
								<p className='mt-2 min-h-12 text-sm leading-6 text-muted-foreground'>
									{lesson.subtitle}
								</p>
								<div className='mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground'>
									<span>Mục tiêu {lesson.targetWords} từ</span>
									<span>
										Start{' '}
										<ArrowRight className='ml-1 inline size-3.5 transition-transform group-hover:translate-x-1' />
									</span>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</main>
	);
}
