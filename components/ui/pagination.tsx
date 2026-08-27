'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './button';
import { useTransition } from 'react';

type PaginationProps = {
	page: number;
	totalPages: number;
	onPageChange?: (page: number) => void;
	pending?: boolean;
	className?: string;
	isPushToUrl?: boolean;
};

export function Pagination({
	page,
	totalPages,
	onPageChange,
	pending = false,
	className,
	isPushToUrl = false,
}: PaginationProps) {
	const searchParams = useSearchParams();
	const { push } = useRouter();
	const pathname = usePathname();

	const [isPending, startTransition] = useTransition();
	const isFirstPage = page <= 1;
	const isLastPage = page >= totalPages;

	function handleNextPage(newPage: number) {
		if (onPageChange) {
			onPageChange(newPage);
		}
		if (isPushToUrl) {
			const params = new URLSearchParams(searchParams.toString());
			params.set('page', newPage.toString());
			startTransition(async () => {
				push(`${pathname}?${params.toString()}`, { scroll: false });
			});
		}
	}

	function handlePrevPage(newPage: number) {
		if (onPageChange) {
			onPageChange(newPage);
		}
		if (isPushToUrl) {
			const params = new URLSearchParams(searchParams.toString());
			params.set('page', newPage.toString());
			startTransition(async () => {
				push(`${pathname}?${params.toString()}`, { scroll: false });
			});
		}
	}

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
				<Button
					onClick={() => handlePrevPage(Math.max(1, page - 1))}
					disabled={isFirstPage || pending || isPending}
					className={cn(
						isFirstPage || pending || isPending
							? 'cursor-not-allowed text-muted-foreground bg-secondary'
							: 'text-foreground bg-card hover:bg-secondary',
					)}>
					Previous
				</Button>
				<Button
					onClick={() => handleNextPage(Math.min(totalPages, page + 1))}
					disabled={isLastPage || pending || isPending}
					className={cn(
						isLastPage || pending || isPending
							? 'cursor-not-allowed text-muted-foreground bg-secondary'
							: 'text-foreground bg-card hover:bg-secondary',
					)}>
					Next
				</Button>
			</div>
		</div>
	);
}
