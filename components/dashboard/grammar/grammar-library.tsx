import { BookOpen, CheckCircle2 } from 'lucide-react';
import type { GrammarPointWithDifficultyLabel } from '@/services/grammar';
import { GrammarCard } from './grammar-card';
import { GrammarFilters } from './grammar-filters';
import { Pagination } from '@/components/ui/pagination';

type GrammarLibraryResult = {
	data: GrammarPointWithDifficultyLabel[];
	total: number;
	page: number;
	totalPages: number;
};

export function GrammarLibrary({
	result,
	search = '',
	difficulty = '',
}: {
	result: GrammarLibraryResult;
	search?: string;
	difficulty?: string;
}) {
	return (
		<main className='mx-auto flex max-w-6xl flex-col gap-6'>
			<GrammarFilters
				search={search}
				difficulty={difficulty}
			/>
			<section
				className='flex flex-col gap-3'
				aria-label='Grammar lessons'>
				{result.data.map((grammar) => (
					<GrammarCard
						key={grammar.id}
						grammar={grammar}
					/>
				))}
				{result.data.length === 0 && (
					<div className='rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground'>
						No grammar lessons match your search.
					</div>
				)}
			</section>
			<Pagination
				page={result.page}
				totalPages={Math.max(result.totalPages, 1)}
				isPushToUrl
			/>
		</main>
	);
}
