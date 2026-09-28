import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { GrammarPointWithDifficultyLabel } from '@/services/grammar';
import { createGrammarSlug, getDifficultyTone } from '@/lib/grammar-utils';

export function GrammarCard({ grammar }: { grammar: GrammarPointWithDifficultyLabel }) {
	const href = `/grammar/${createGrammarSlug(grammar.id, grammar.name)}`;

	return (
		<Link
			href={href}
			className='group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:shadow-sm'>
			<div className='flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary'>
				<BookOpen
					className='size-5 text-primary'
					aria-hidden='true'
				/>
			</div>
			<div className='min-w-0 flex-1'>
				<div className='flex flex-wrap items-center gap-2'>
					<h2 className='text-lg font-bold text-foreground transition-colors group-hover:text-primary'>
						{grammar.name}
					</h2>
					<span
						className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getDifficultyTone(grammar.difficulty_label)}`}>
						{grammar.difficulty_label || 'All levels'}
					</span>
				</div>
				<p className='mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground'>
					{grammar.description || 'Explore this English grammar point.'}
				</p>
			</div>
			<ChevronRight
				className='mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary'
				aria-hidden='true'
			/>
		</Link>
	);
}
