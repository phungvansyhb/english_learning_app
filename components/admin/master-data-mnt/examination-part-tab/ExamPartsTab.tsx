'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { Plus, Search, Pencil, Trash2, RotateCwFadingClockIcon, LoaderIcon } from 'lucide-react';

import type { CreateExamPartInput, ExamPartRow, SkillRow } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
	createExamPart,
	deleteExamPart,
	listExamParts,
	listSkills,
	updateExamPart,
} from '@/services/master-data';
import { Modal } from '../../modal';
import { fieldClass, labelClass, StatusError } from '../shared';

export default function ExamPartsTab() {
	const [items, setItems] = useState<ExamPartRow[]>([]);
	const [skills, setSkills] = useState<SkillRow[]>([]);
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [perPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<ExamPartRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<ExamPartRow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setError(null);
		startTransition(async () => {
			try {
				const response = await listExamParts({
					page,
					perPage,
					search: query || undefined,
				});
				setItems(response.data);
				setTotalPages(response.totalPages);
			} catch (err) {
				setError((err as Error).message);
			}
		});
	}, [query, page, perPage]);

	useEffect(() => {
		startTransition(async () => {
			try {
				const response = await listSkills({ page: 1, perPage: 100 });
				setSkills(response.data);
			} catch (err) {
				console.error('load skills for exam parts', err);
			}
		});
	}, []);

	const skillMap = useMemo(() => {
		return skills.reduce<Record<number, string>>((map, skill) => {
			map[skill.id] = skill.name;
			return map;
		}, {});
	}, [skills]);

	async function handleSave(item: Partial<ExamPartRow> & { id?: number }) {
		setError(null);
		startTransition(async () => {
			try {
				if (item.id) {
					await updateExamPart(item.id, item);
				} else {
					await createExamPart(item as CreateExamPartInput);
				}
				setFormOpen(false);
				setEditing(null);
				const response = await listExamParts({
					page,
					perPage,
					search: query || undefined,
				});
				setItems(response.data);
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
				await deleteExamPart(deleteTarget.id);
				setDeleteTarget(null);
				const response = await listExamParts({
					page,
					perPage,
					search: query || undefined,
				});
				setItems(response.data);
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
					<h2 className='text-lg font-bold text-foreground'>Exam parts</h2>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Manage TOEIC part definitions by skill.
					</p>
				</div>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<div className='relative flex-1 sm:w-72'>
						<Search className='pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<input
							type='search'
							value={query}
							onChange={(e) => {
								setPage(1);
								setQuery(e.target.value);
							}}
							placeholder='Search exam parts'
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
						Add part
					</button>
				</div>
			</div>

			<div className='overflow-hidden rounded-2xl border border-border'>
				<table className='w-full border-collapse text-left text-sm'>
					<thead>
						<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
							<th className='px-4 py-3 font-semibold'>Skill</th>
							<th className='px-4 py-3 font-semibold'>Part #</th>
							<th className='px-4 py-3 font-semibold'>Name</th>
							<th className='px-4 py-3 text-right font-semibold'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr
								key={item.id}
								className='border-t border-border align-baseline'>
								<td className='px-4 py-3 text-foreground'>
									{skillMap[item.skill_id] ?? `#${item.skill_id}`}
								</td>
								<td className='px-4 py-2 text-foreground'>{item.part_number}</td>
								<td className='px-4 py-2 text-foreground'>{item.name}</td>
								<td className='px-4 py-2'>
									<div className='flex justify-end gap-1'>
										<button
											type='button'
											onClick={() => {
												setEditing(item);
												setFormOpen(true);
											}}
											className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'>
											<Pencil className='size-4' />
										</button>
										<button
											type='button'
											onClick={() => setDeleteTarget(item)}
											className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'>
											<Trash2 className='size-4' />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{items.length === 0 && !pending && (
					<div className='p-6 text-center text-sm text-muted-foreground'>
						No exam parts found.
					</div>
				)}
				{pending && (
					<div className='p-6 flex justify-center text-sm text-muted-foreground'>
						<LoaderIcon className='animate animate-spin' />{' '}
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

			<ExamPartFormModal
				open={formOpen}
				examPart={editing}
				skills={skills}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSave={handleSave}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete exam part'
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

function ExamPartFormModal({
	open,
	examPart,
	skills,
	onClose,
	onSave,
}: {
	open: boolean;
	examPart: ExamPartRow | null;
	skills: SkillRow[];
	onClose: () => void;
	onSave: (input: Partial<ExamPartRow> & { id?: number }) => void;
}) {
	const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateExamPartInput>({ defaultValues: { skill_id: skills[0]?.id ?? 0, part_number: 1, name: '' } });
	const [draft, setDraft] = useState<CreateExamPartInput>({ skill_id: skills[0]?.id ?? 0, part_number: 1, name: '' });
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		if (examPart) {
			setDraft({
				id: examPart.id,
				skill_id: examPart.skill_id,
				part_number: examPart.part_number,
				name: examPart.name,
			});
			setError(null);
		} else {
			setDraft({ skill_id: skills[0]?.id ?? 0, part_number: 1, name: '' });
			setError(null);
		}
	}, [open, examPart, skills]);

	function handleChange<K extends keyof CreateExamPartInput>(
		key: K,
		value: CreateExamPartInput[K],
	) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!draft.skill_id) {
			setError('Skill is required.');
			return;
		}
		if (!draft.part_number) {
			setError('Part number is required.');
			return;
		}
		if (!draft.name.trim()) {
			setError('Name is required.');
			return;
		}
		onSave({ ...(examPart ? { id: examPart.id } : {}), ...draft, name: draft.name.trim() });
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={examPart ? 'Edit exam part' : 'Create exam part'}
			description={examPart ? `Update part ${examPart.name}.` : 'Add a new exam part.'}>
			<form
				onSubmit={handleSubmit}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<div>
						<label
							className={labelClass}
							htmlFor='exam-skill'>
							Skill
						</label>
						<select
							id='exam-skill'
							className={fieldClass}
							value={draft.skill_id}
							onChange={(e) => handleChange('skill_id', Number(e.target.value))}>
							{skills.map((skill) => (
								<option
									key={skill.id}
									value={skill.id}>
									{skill.name}
								</option>
							))}
						</select>
					</div>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div>
							<label
								className={labelClass}
								htmlFor='exam-part-number'>
								Part number
							</label>
							<input
								id='exam-part-number'
								type='number'
								className={fieldClass}
								value={draft.part_number ?? ''}
								onChange={(e) =>
									handleChange('part_number', Number(e.target.value))
								}
								min={1}
							/>
						</div>
						<div>
							<label
								className={labelClass}
								htmlFor='exam-name'>
								Name
							</label>
							<input
								id='exam-name'
								className={fieldClass}
								value={draft.name}
								onChange={(e) => handleChange('name', e.target.value)}
								placeholder='Part 1'
							/>
						</div>
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
						{examPart ? 'Save part' : 'Create part'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
