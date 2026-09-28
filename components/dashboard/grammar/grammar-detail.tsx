'use client';

import { createGrammarSlug, getDifficultyTone } from '@/lib/grammar-utils';
import type { GrammarPointWithDifficultyLabel } from '@/services/grammar';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type GrammarNeighbor = { id: number; name: string } | null;

type GrammarDetailProps = {
	grammar: GrammarPointWithDifficultyLabel;
	neighbors: { previous: GrammarNeighbor; next: GrammarNeighbor };
};

export function GrammarDetail({ grammar, neighbors }: GrammarDetailProps) {
	const previousHref = neighbors.previous
		? `/grammar/${createGrammarSlug(neighbors.previous.id, neighbors.previous.name)}`
		: null;
	const nextHref = neighbors.next
		? `/grammar/${createGrammarSlug(neighbors.next.id, neighbors.next.name)}`
		: null;

	return (
		<main className='mx-auto max-w-6xl'>
			<nav
				aria-label='Breadcrumb'
				className='mb-8 flex items-center gap-2 text-sm text-muted-foreground'>
				<Link
					href='/grammar'
					className='hover:text-foreground'>
					Grammar
				</Link>
				<ChevronRight
					className='size-4'
					aria-hidden='true'
				/>
				<span className='text-foreground'>{grammar.name}</span>
			</nav>

			<article className='max-w-4xl'>
				<header className='border-b border-border pb-8'>
					<span
						className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getDifficultyTone(grammar.difficulty_label)}`}>
						{grammar.difficulty_label || 'All levels'}
					</span>
					<h1 className='mt-4 text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
						{grammar.name}
					</h1>
					{grammar.description && (
						<p className='mt-4 max-w-2xl leading-8 text-muted-foreground'>
							{grammar.description}
						</p>
					)}
				</header>

				<div
					className='content-reading pt-8'
					dangerouslySetInnerHTML={{
						__html:
							grammar.content ||
							'<p>Content for this lesson has not been added yet.</p>',
					}}
				/>

				<div className='mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row'>
					{previousHref ? (
						<Link
							href={previousHref}
							className='flex flex-1 items-center gap-3 rounded-xl border border-border p-4 hover:bg-card'>
							<ArrowLeft className='size-4' />
							<span>
								<small className='block text-xs text-muted-foreground'>
									Previous
								</small>
								<strong>{neighbors.previous?.name}</strong>
							</span>
						</Link>
					) : (
						<span />
					)}
					{nextHref ? (
						<Link
							href={nextHref}
							className='flex flex-1 items-center justify-end gap-3 rounded-xl border border-border p-4 text-right hover:bg-card'>
							<span>
								<small className='block text-xs text-muted-foreground'>Next</small>
								<strong>{neighbors.next?.name}</strong>
							</span>
							<ArrowRight className='size-4' />
						</Link>
					) : (
						<span />
					)}
				</div>
			</article>
		</main>
	);
}
