import { CreateSkillInput, SkillRow } from '@/lib/types';
import { cn } from '@/lib/utils';
import { createSkill, deleteSkill, listSkills, updateSkill } from '@/services/master-data';
import { LoaderIcon, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useTransition } from 'react';
import { Modal } from '../../modal';
import { fieldClass, labelClass, StatusError } from '../shared';
type Props = {};

export default function SkillsTab() {
	const [skills, setSkills] = useState<SkillRow[]>([]);
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [perPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<SkillRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<SkillRow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setError(null);
		startTransition(async () => {
			try {
				const response = await listSkills({
					page,
					perPage,
					search: query || undefined,
				});
				setSkills(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}, [query, page, perPage]);

	async function handleSave(item: Partial<SkillRow> & { id?: number }) {
		setError(null);
		startTransition(async () => {
			try {
				if (item.id) {
					await updateSkill(item.id, item);
				} else {
					await createSkill(item as CreateSkillInput);
				}
				setFormOpen(false);
				setEditing(null);
				const response = await listSkills({
					page,
					perPage,
					search: query || undefined,
				});
				setSkills(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}

	async function handleDelete() {
		if (!deleteTarget) return;
		setError(null);
		startTransition(async () => {
			try {
				await deleteSkill(deleteTarget.id);
				setDeleteTarget(null);
				const response = await listSkills({
					page,
					perPage,
					search: query || undefined,
				});
				setSkills(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}

	const pending = isPending;

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h2 className='text-lg font-bold text-foreground'>Skills</h2>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Manage TOEIC skill groups.
					</p>
				</div>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<div className='relative flex-1 sm:w-72'>
						<Search className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<input
							type='search'
							value={query}
							onChange={(e) => {
								setPage(1);
								setQuery(e.target.value);
							}}
							placeholder='Search skills'
							className={fieldClass}
						/>
					</div>
					<button
						type='button'
						onClick={() => {
							setEditing(null);
							setFormOpen(true);
						}}
						className='inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
						<Plus className='size-4' />
						Add skill
					</button>
				</div>
			</div>

			<div className='overflow-hidden rounded-2xl border border-border'>
				<table className='w-full border-collapse text-left text-sm'>
					<thead>
						<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
							<th className='px-4 py-3 font-semibold'>Code</th>
							<th className='px-4 py-3 font-semibold'>Name</th>
							<th className='px-4 py-3 text-right font-semibold'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{skills.map((skill) => (
							<tr
								key={skill.id}
								className='border-t border-border align-baseline'>
								<td className='px-4 py-2 text-foreground'>{skill.code}</td>
								<td className='px-4 py-2 text-foreground'>{skill.name}</td>
								<td className='px-4 py-2'>
									<div className='flex justify-end gap-1'>
										<button
											type='button'
											onClick={() => {
												setEditing(skill);
												setFormOpen(true);
											}}
											className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'>
											<Pencil className='size-4' />
										</button>
										<button
											type='button'
											onClick={() => setDeleteTarget(skill)}
											className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
											<Trash2 className='size-4' />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{skills.length === 0 && !pending && (
					<div className='p-6 text-center text-sm text-muted-foreground'>
						No skills found.
					</div>
				)}
				{pending && (
					<div className='p-6 flex justify-center text-muted-foreground'>
						<LoaderIcon className='animate animate-spin' />
					</div>
				)}
			</div>

			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-sm text-muted-foreground'>
					Page {page} of {totalPages}
				</p>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setPage((prev) => Math.max(1, prev - 1))}
						disabled={page <= 1 || pending}
						className={cn(
							'h-11 rounded-full border border-border px-4 text-sm transition-colors',
							page <= 1 || pending
								? 'cursor-not-allowed text-muted-foreground bg-secondary'
								: 'text-foreground bg-card hover:bg-secondary',
						)}>
						Previous
					</button>
					<button
						type='button'
						onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
						disabled={page >= totalPages || pending}
						className={cn(
							'h-11 rounded-full border border-border px-4 text-sm transition-colors',
							page >= totalPages || pending
								? 'cursor-not-allowed text-muted-foreground bg-secondary'
								: 'text-foreground bg-card hover:bg-secondary',
						)}>
						Next
					</button>
				</div>
			</div>

			{error && <StatusError message={error} />}

			<SkillFormModal
				open={formOpen}
				skill={editing}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSave={handleSave}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete skill'
				description={`This will permanently remove ${deleteTarget?.name}.`}>
				<div className='flex justify-end gap-3 px-6 py-5'>
					<button
						type='button'
						onClick={() => setDeleteTarget(null)}
						className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
						Cancel
					</button>
					<button
						type='button'
						onClick={handleDelete}
						className='h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90'>
						Delete
					</button>
				</div>
			</Modal>
		</div>
	);
}

function SkillFormModal({
	open,
	skill,
	onClose,
	onSave,
}: {
	open: boolean;
	skill: SkillRow | null;
	onClose: () => void;
	onSave: (input: Partial<SkillRow> & { id?: number }) => void;
}) {
	const [draft, setDraft] = useState<CreateSkillInput>({ code: '', name: '' });
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		if (skill) {
			setDraft({ id: skill.id, code: skill.code, name: skill.name });
			setError(null);
		} else {
			setDraft({ code: '', name: '' });
			setError(null);
		}
	}, [open, skill]);

	function handleChange<K extends keyof CreateSkillInput>(key: K, value: CreateSkillInput[K]) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!draft.code.trim()) {
			setError('Code is required.');
			return;
		}
		if (!draft.name.trim()) {
			setError('Name is required.');
			return;
		}
		onSave({
			...(skill ? { id: skill.id } : {}),
			...draft,
			code: draft.code.trim(),
			name: draft.name.trim(),
		});
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={skill ? 'Edit skill' : 'Create skill'}
			description={skill ? `Update skill ${skill.name}.` : 'Add a new skill.'}>
			<form
				onSubmit={handleSubmit}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<div>
						<label
							className={labelClass}
							htmlFor='skill-code'>
							Code
						</label>
						<input
							id='skill-code'
							className={fieldClass}
							value={draft.code}
							onChange={(e) => handleChange('code', e.target.value)}
							placeholder='TOEIC'
						/>
					</div>
					<div>
						<label
							className={labelClass}
							htmlFor='skill-name'>
							Name
						</label>
						<input
							id='skill-name'
							className={fieldClass}
							value={draft.name}
							onChange={(e) => handleChange('name', e.target.value)}
							placeholder='Listening'
						/>
					</div>
				</div>

				{error && <StatusError message={error} />}

				<div className='flex items-center justify-end gap-3 border-t border-border px-6 py-5'>
					<button
						type='button'
						onClick={onClose}
						className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
						Cancel
					</button>
					<button
						type='submit'
						className='h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
						{skill ? 'Save skill' : 'Create skill'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
