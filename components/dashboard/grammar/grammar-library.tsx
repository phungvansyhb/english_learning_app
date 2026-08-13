'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock3, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { difficultyClasses, grammarLessons, type GrammarDifficulty } from '@/lib/grammar-data';

export function GrammarLibrary() {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState<'All' | GrammarDifficulty>('All');
	const filtered = useMemo(
		() =>
			grammarLessons.filter(
				(lesson) =>
					lesson.name.toLowerCase().includes(query.toLowerCase()) &&
					(filter === 'All' || lesson.difficulty === filter),
			),
		[query, filter],
	);
	const completed = grammarLessons.filter((lesson) => lesson.progress === 100).length;

	return (
		<main className='flex flex-col gap-6 mx-auto max-w-6xl'>
			<section className='relative bg-primary p-6 md:p-8 rounded-[1.75rem] overflow-hidden text-primary-foreground'>
				<div className='z-10 relative max-w-2xl'>
					<p className='font-semibold text-brand-pink text-xs uppercase tracking-[0.2em]'>
						Grammar library
					</p>
					<h1 className='mt-3 font-bold text-3xl md:text-4xl tracking-tight text-balance'>
						Build the rules behind your English.
					</h1>
					<p className='opacity-85 mt-3 max-w-xl leading-6'>
						Short, practical lessons that turn confusing grammar into patterns you can
						actually use.
					</p>
					<div className='flex flex-wrap gap-3 mt-6'>
						<span className='bg-primary-foreground/10 px-3 py-2 rounded-xl text-sm'>
							<strong>{completed}</strong> completed
						</span>
						<span className='bg-primary-foreground/10 px-3 py-2 rounded-xl text-sm'>
							<strong>{grammarLessons.length}</strong> lessons
						</span>
					</div>
				</div>
				<Sparkles className='right-8 bottom-8 absolute opacity-20 size-28' />
			</section>
			<section className='flex sm:flex-row flex-col gap-3'>
				<label className='relative flex-1'>
					<Search className='top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2' />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder='Search grammar lessons...'
						className='input-wrapper pl-10'
					/>
				</label>
				<div className='flex gap-2 overflow-x-auto'>
					{(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((item) => (
						<button
							key={item}
							type='button'
							onClick={() => setFilter(item)}
							className={`px-4 rounded-xl h-11 font-medium text-sm whitespace-nowrap transition-colors ${filter === item ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
							{item}
						</button>
					))}
				</div>
			</section>
			<section className='gap-4 grid md:grid-cols-2'>
				<div className='flex items-center gap-4 bg-card p-5 border border-border rounded-2xl'>
					<div className='flex justify-center items-center bg-brand-mint rounded-2xl size-11'>
						<CheckCircle2 className='size-5 text-brand-mint-foreground' />
					</div>
					<div>
						<p className='text-muted-foreground text-xs'>Completed lessons</p>
						<p className='mt-1 font-bold text-foreground text-2xl'>
							{completed}
							<span className='font-normal text-muted-foreground text-sm'>
								{' '}
								/ {grammarLessons.length}
							</span>
						</p>
					</div>
				</div>
				<div className='flex items-center gap-4 bg-card p-5 border border-border rounded-2xl'>
					<div className='flex justify-center items-center bg-brand-purple-soft rounded-2xl size-11'>
						<BookOpen className='size-5 text-foreground' />
					</div>
					<div>
						<p className='text-muted-foreground text-xs'>Recommended next</p>
						<p className='mt-1 font-bold text-foreground text-lg'>Present Perfect</p>
					</div>
				</div>
			</section>
			<section className='flex flex-col gap-3'>
				{filtered.map((lesson) => (
					<Link
						href={`/grammar/${lesson.slug}`}
						key={lesson.slug}
						className='group flex sm:flex-row flex-col sm:items-center gap-4 bg-card hover:shadow-sm p-5 border border-border rounded-2xl transition-all'>
						<div className='flex flex-1 items-start gap-4'>
							<div className='flex justify-center items-center bg-secondary rounded-2xl size-12 shrink-0'>
								<BookOpen className='size-5 text-primary' />
							</div>
							<div className='min-w-0'>
								<div className='flex flex-wrap items-center gap-2'>
									<h2 className='font-bold text-foreground group-hover:text-primary text-lg transition-colors'>
										{lesson.name}
									</h2>
									<span
										className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${difficultyClasses[lesson.difficulty]}`}>
										{lesson.difficulty}
									</span>
								</div>
								<p className='mt-1 text-muted-foreground text-sm leading-6'>
									{lesson.description}
								</p>
								<div className='flex items-center gap-3 mt-3 text-muted-foreground text-xs'>
									<span className='flex items-center gap-1'>
										<Clock3 className='size-3.5' />
										{lesson.duration}
									</span>
									<span>{lesson.sections.length} sections</span>
								</div>
							</div>
						</div>
						<div className='sm:w-40'>
							<div className='flex justify-between mb-2 text-muted-foreground text-xs'>
								<span>Progress</span>
								<span>{lesson.progress}%</span>
							</div>
							<div className='bg-secondary rounded-full h-2 overflow-hidden'>
								<div
									className='bg-primary rounded-full h-full transition-all'
									style={{ width: `${lesson.progress}%` }}
								/>
							</div>
						</div>
					</Link>
				))}
				{filtered.length === 0 && (
					<div className='bg-card p-12 border border-border rounded-2xl text-center text-muted-foreground'>
						No lessons match your search.
					</div>
				)}
			</section>
		</main>
	);
}
