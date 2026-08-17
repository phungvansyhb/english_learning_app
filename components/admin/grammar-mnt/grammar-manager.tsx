'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { GrammarPointRow } from '@/lib/types';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import DifficultySelect from '@/components/ui/components/difficulty-select';
import GrammarForm from './grammar-form';
import { deleteGrammarPoint, listGrammarPoints } from '@/services/grammar';

type GrammarPointWithDifficulty = GrammarPointRow & {
	difficulty_label: string;
};

export function GrammarManager() {
	const [items, setItems] = useState<GrammarPointWithDifficulty[]>([]);
	const [selected, setSelected] = useState<GrammarPointWithDifficulty | null>(null);
	const [query, setQuery] = useState('');
	const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const loadGrammarPoints = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		setItems([]);
		try {
			const rs = await listGrammarPoints({
				page: 1,
				perPage: 10,
				search: query,
				difficulty_id: selectedDifficulty || undefined,
			});
			setItems(rs.data);
		} catch (nextError) {
			setError(String(nextError));
		} finally {
			setIsLoading(false);
		}
	}, [selectedDifficulty, query]);

	useEffect(() => {
		loadGrammarPoints();
	}, [selectedDifficulty, query]);

	const onCreateSuccess = async () => {
		setIsCreating(false);
		setSelected(null);
		await loadGrammarPoints();
	};

	const onEdit = (item: GrammarPointWithDifficulty) => {
		setSelected(item);
		setIsCreating(true);
	};

	const onDelete = (id: number) => {
		const confirmed = window.confirm('Delete this grammar point?');
		if (!confirmed) {
			return;
		}

		startTransition(async () => {
			try {
				await deleteGrammarPoint(id);
				await loadGrammarPoints();
			} catch (nextError) {
				setError(String(nextError));
			}
		});
	};

	return (
		<section className='flex flex-col gap-6'>
			<div className='flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4'>
				<div>
					<p className='font-semibold text-brand-pink text-xs uppercase tracking-[0.18em]'>
						Content library
					</p>
					<h1 className='mt-2 font-bold text-foreground text-3xl tracking-tight'>
						Grammar points
					</h1>
					<p className='mt-2 max-w-xl text-muted-foreground text-sm leading-6'>
						Create clear, structured lessons that help learners understand grammar in
						context.
					</p>
				</div>
				<button
					type='button'
					onClick={() => {
						setSelected(null);
						setIsCreating(true);
					}}
					className='inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 px-4 rounded-xl h-11 font-semibold text-primary-foreground text-sm transition-colors'>
					<Plus className='size-4' />
					New grammar point
				</button>
			</div>

			<div className='flex sm:flex-row flex-col gap-3'>
				<label className='relative flex-1'>
					<Search className='top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2' />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder='Search grammar points...'
						className='input-wrapper pl-10'
					/>
				</label>
				<DifficultySelect
					type='grammar'
					label=''
					placeholder='Select difficulty'
					value={selectedDifficulty}
					onValueChange={(value) =>
						setSelectedDifficulty(Array.isArray(value) ? (value[0] ?? null) : value)
					}
				/>
			</div>

			{error && <p className='error-text'>{error}</p>}

			<div className='bg-card border border-border rounded-2xl overflow-hidden'>
				<div className='flex justify-between items-center px-5 py-4 border-border border-b'>
					<div>
						<h2 className='font-bold text-foreground'>All grammar points</h2>
						<p className='mt-1 text-muted-foreground text-xs'>
							{items.length} lessons in your library
						</p>
					</div>
					<span className='bg-secondary px-3 py-1 rounded-full font-semibold text-muted-foreground text-xs'>
						{isLoading || isPending ? 'Syncing...' : 'Live data'}
					</span>
				</div>
				<div className='divide-y divide-border'>
					{items.map((item) => (
						<div
							key={item.id}
							className='flex md:flex-row flex-col md:items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors'>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-3'>
									<h3 className='font-semibold text-foreground truncate'>
										{item.name}
									</h3>
									<span className='px-2.5 py-1 rounded-full font-semibold text-[11px] bg-secondary'>
										{item.difficulty_label}
									</span>
								</div>
								<p className='mt-1 text-muted-foreground text-sm truncate'>
									{item.description}
								</p>
							</div>
							<div className='flex items-center gap-6 text-muted-foreground text-xs'>
								<button
									type='button'
									aria-label={`Edit ${item.name}`}
									onClick={() => onEdit(item)}
									className='hover:text-foreground'>
									<Pencil className='size-4' />
								</button>
								<button
									type='button'
									aria-label={`Delete ${item.name}`}
									onClick={() => onDelete(item.id)}
									className='hover:text-destructive'>
									<Trash2 className='size-4' />
								</button>
							</div>
						</div>
					))}
					{!items.length && !isLoading && (
						<div className='px-5 py-14 text-center text-muted-foreground text-sm'>
							No grammar points match your filters.
						</div>
					)}
					{isLoading && (
						<div className='px-5 py-14 text-center text-muted-foreground text-sm'>
							Loading grammar points...
						</div>
					)}
				</div>
			</div>

			{isCreating && (
				<div className='z-50 fixed inset-0 flex justify-center items-center bg-foreground/40 p-4'>
					<div
						role='dialog'
						aria-modal='true'
						aria-label='Grammar point editor'
						className='flex flex-col bg-card shadow-2xl rounded-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden'>
						<div className='flex justify-between items-start px-6 py-5 border-border border-b'>
							<div>
								<p className='font-semibold text-brand-pink text-xs uppercase tracking-[0.16em]'>
									Lesson editor
								</p>
								<h2 className='mt-1 font-bold text-foreground text-xl'>
									{selected ? 'Edit grammar point' : 'New grammar point'}
								</h2>
							</div>
							<button
								type='button'
								onClick={() => setIsCreating(false)}
								aria-label='Close editor'
								className='text-muted-foreground hover:text-foreground text-2xl'>
								×
							</button>
						</div>
						<GrammarForm
							onCancel={() => setIsCreating(false)}
							onSuccess={onCreateSuccess}
							initialData={
								selected
									? {
											id: selected.id,
											name: selected.name,
											description: selected.description,
											difficulty_id: selected.difficulty_id,
											difficulty_label: selected.difficulty_label,
											content: selected.content,
										}
									: undefined
							}
						/>
					</div>
				</div>
			)}
		</section>
	);
}
