'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useTransition } from 'react';

const filters = [
	{ label: 'Tất cả', value: '' },
	{ label: 'Cơ bản', value: 'basic' },
	{ label: 'Trung cấp', value: 'intermediate' },
	{ label: 'Nâng cao', value: 'advanced' },
];

export function GrammarFilters({
	search = '',
	difficulty = '',
}: {
	search?: string;
	difficulty?: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [searchValue, setSearchValue] = useState(search);

	function updateParams(next: { search?: string; difficulty?: string }) {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('page');
		if (next.search !== undefined) {
			if (next.search) params.set('search', next.search);
			else params.delete('search');
		}
		if (next.difficulty !== undefined) {
			if (next.difficulty) params.set('difficulty', next.difficulty);
			else params.delete('difficulty');
		}
		const query = params.toString();
		startTransition(() =>
			router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }),
		);
	}

	function handleSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		updateParams({ search: searchValue.trim() });
	}

	return (
		<section
			aria-label='Lọc bài học ngữ pháp'
			className='flex flex-col gap-3'>
			<form
				onSubmit={handleSearch}
				className='flex gap-2'>
				<label className='relative flex-1'>
					<span className='sr-only'>Tìm bài học ngữ pháp</span>
					<Search
						className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
						aria-hidden='true'
					/>
					<input
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
						placeholder='Tìm bài học ngữ pháp...'
						className='input-wrapper pl-10'
					/>
				</label>
				<button
					type='submit'
					disabled={isPending}
					className='inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer'>
					<Search
						className='size-4'
						aria-hidden='true'
					/>
					<span>Tìm kiếm</span>
				</button>
			</form>
			<div
				className='flex gap-2 overflow-x-auto'
				role='group'
				aria-label='Lọc theo độ khó'>
				{filters.map((filter) => {
					const active = difficulty === filter.value;
					return (
						<button
							key={filter.label}
							type='button'
							onClick={() => updateParams({ difficulty: filter.value })}
							aria-pressed={active}
							disabled={isPending}
							className={`h-11 shrink-0 rounded-xl px-4 text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:text-foreground'}`}>
							{filter.label}
						</button>
					);
				})}
			</div>
		</section>
	);
}
