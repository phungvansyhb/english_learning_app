import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
	key: keyof T | string;
	header: ReactNode;
	className?: string;
	cellClassName?: string;
	render?: (row: T, index: number) => ReactNode;
};

type DataTableProps<T> = {
	columns: DataTableColumn<T>[];
	data: T[];
	isLoading?: boolean;
	rowKey: (row: T, index: number) => string | number;
	emptyState?: ReactNode;
	className?: string;
	renderMobileCard?: (row: T, index: number) => ReactNode;
};

const loadingRows = [1, 2, 3];

export function DataTable<T>({
	columns,
	data,
	rowKey,
	emptyState,
	isLoading = false,
	className,
	renderMobileCard,
}: DataTableProps<T>) {
	const hasData = data.length > 0;

	if (isLoading) {
		return (
			<div className={cn(className)}>
				<div className='hidden rounded-2xl border border-border md:block'>
					<div className='overflow-x-auto rounded-2xl'>
						<table className='min-w-[720px] w-full border-collapse text-left text-sm'>
							<thead>
								<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
									{columns.map((column) => (
										<th
											key={String(column.key)}
											className={cn(
												'px-4 py-3 font-semibold',
												column.className,
											)}>
											{column.header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{loadingRows.map((row) => (
									<tr
										key={`loading-row-${row}`}
										className='border-t border-border align-top'>
										{columns.map((column) => (
											<td
												key={`${row}-${String(column.key)}`}
												className={cn('px-4 py-3', column.cellClassName)}>
												<div className='h-4 animate-pulse rounded bg-secondary/80' />
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className='mt-6 space-y-3 md:hidden'>
					{loadingRows.map((row) => (
						<div
							key={`loading-mobile-${row}`}
							className='rounded-2xl border border-border p-4'>
							<div className='space-y-3'>
								<div className='h-4 w-32 animate-pulse rounded bg-secondary/80' />
								<div className='h-3 w-52 animate-pulse rounded bg-secondary/60' />
								<div className='flex gap-2'>
									<div className='h-9 flex-1 animate-pulse rounded-lg bg-secondary/80' />
									<div className='h-9 flex-1 animate-pulse rounded-lg bg-secondary/80' />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={cn(className)}>
			<div className='hidden rounded-2xl border border-border md:block'>
				<div className='overflow-x-auto rounded-2xl'>
					<table className='min-w-[720px] w-full border-collapse text-left text-sm'>
						<thead>
							<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
								{columns.map((column) => (
									<th
										key={String(column.key)}
										className={cn('px-4 py-3 font-semibold', column.className)}>
										{column.header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.map((row, index) => {
								const rowId = rowKey(row, index);
								return (
									<tr
										key={rowId}
										className='border-t border-border align-top'>
										{columns.map((column) => {
											const content = column.render
												? column.render(row, index)
												: ((row[column.key as keyof T] as ReactNode) ?? '');

											return (
												<td
													key={`${String(rowId)}-${String(column.key)}`}
													className={cn(
														'px-4 py-3',
														column.cellClassName,
													)}>
													{content}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{!hasData && (
					<div className='p-6 text-center text-sm text-muted-foreground'>
						{emptyState ?? 'No records found.'}
					</div>
				)}
			</div>

			<div className='mt-6 space-y-3 md:hidden'>
				{hasData ? (
					data.map((row, index) => (
						<div
							key={rowKey(row, index)}
							className='rounded-2xl border border-border p-4'>
							{renderMobileCard ? (
								renderMobileCard(row, index)
							) : (
								<div className='space-y-2'>
									{columns.slice(0, 3).map((column) => (
										<div
											key={`${String(rowKey(row, index))}-${String(column.key)}`}
											className='flex items-center justify-between gap-3 text-sm'>
											<span className='text-muted-foreground'>
												{column.header}
											</span>
											<span className='text-right text-foreground'>
												{column.render
													? column.render(row, index)
													: ((row[column.key as keyof T] as ReactNode) ??
														'')}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					))
				) : (
					<div className='rounded-2xl border border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground'>
						{emptyState ?? 'No records found.'}
					</div>
				)}
			</div>
		</div>
	);
}
