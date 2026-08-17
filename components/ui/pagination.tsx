'use client';

import { cn } from '@/lib/utils';

type PaginationProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	pending?: boolean;
	className?: string;
};

export function Pagination({
	page,
	totalPages,
	onPageChange,
	pending = false,
	className,
}: PaginationProps) {
	const isFirstPage = page <= 1;
	const isLastPage = page >= totalPages;

	return (
		<div
			className={cn(
				'mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
				className,
			)}>
			<p className='text-sm text-muted-foreground'>
				Page {page} of {totalPages}
			</p>
			<div className='flex items-center gap-2'>
				<button
					type='button'
					onClick={() => onPageChange(Math.max(1, page - 1))}
					disabled={isFirstPage || pending}
					className={cn(
						'h-11 rounded-full border border-border px-4 text-sm transition-colors',
						isFirstPage || pending
							? 'cursor-not-allowed text-muted-foreground bg-secondary'
							: 'text-foreground bg-card hover:bg-secondary',
					)}>
					Previous
				</button>
				<button
					type='button'
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
					disabled={isLastPage || pending}
					className={cn(
						'h-11 rounded-full border border-border px-4 text-sm transition-colors',
						isLastPage || pending
							? 'cursor-not-allowed text-muted-foreground bg-secondary'
							: 'text-foreground bg-card hover:bg-secondary',
					)}>
					Next
				</button>
			</div>
		</div>
	);
}
