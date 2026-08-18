'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import type { CreateExamPartInput, ExamPartRow, SkillRow } from '@/lib/types';
import {
	createExamPart,
	deleteExamPart,
	listExamParts,
	listSkills,
	updateExamPart,
} from '@/services/master-data';
import { Modal } from '../../../ui/modal';
import { fieldClass, labelClass, StatusError } from '../shared';

export default function ExamPartsTab() {
	const [skills, setSkills] = useState<SkillRow[]>([]);
	const [query, setQuery] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<ExamPartRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<ExamPartRow | null>(null);
	const [mutationError, setMutationError] = useState<string | null>(null);
	const {
		data: items,
		page,
		totalPages,
		pending,
		error,
		setPage,
		reload,
	} = usePagination({
		apiFunction: listExamParts,
		perPage: 10,
		params: { search: query || undefined },
	});

	useEffect(() => {
		void listSkills({ page: 1, perPage: 100 })
			.then((response) => setSkills(response.data))
			.catch((err) => {
				console.error('load skills for exam parts', err);
			});
	}, []);

	const skillMap = useMemo(() => {
		return skills.reduce<Record<number, string>>((map, skill) => {
			map[skill.id] = skill.name;
			return map;
		}, {});
	}, [skills]);

	async function handleSave(item: Partial<ExamPartRow> & { id?: number }) {
		setMutationError(null);
		try {
			if (item.id) {
				await updateExamPart(item.id, item);
			} else {
				await createExamPart(item as CreateExamPartInput);
			}
			setFormOpen(false);
			setEditing(null);
			reload();
		} catch (err) {
			setMutationError((err as Error).message);
		}
	}

	async function handleDelete() {
		if (!deleteTarget) return;
		setMutationError(null);
		try {
			await deleteExamPart(deleteTarget.id);
			setDeleteTarget(null);
			reload();
		} catch (err) {
			setMutationError((err as Error).message);
		}
	}

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

			<DataTable
				data={items}
				isLoading={pending}
				rowKey={(item) => item.id}
				emptyState='No exam parts found.'
				columns={[
					{
						key: 'skill',
						header: 'Skill',
						render: (item) => skillMap[item.skill_id] ?? `#${item.skill_id}`,
					},
					{ key: 'part_number', header: 'Part #' },
					{ key: 'name', header: 'Name' },
					{
						key: 'actions',
						header: 'Actions',
						className: 'text-right',
						cellClassName: 'w-24',
						render: (item) => (
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
						),
					},
				]}
				renderMobileCard={(item) => (
					<div className='space-y-3'>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Skill
							</p>
							<p className='mt-1 text-sm font-medium text-foreground'>
								{skillMap[item.skill_id] ?? `#${item.skill_id}`}
							</p>
						</div>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Part #
							</p>
							<p className='mt-1 text-sm text-foreground'>{item.part_number}</p>
						</div>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Name
							</p>
							<p className='mt-1 text-sm text-foreground'>{item.name}</p>
						</div>
						<div className='flex gap-2 pt-1'>
							<button
								type='button'
								onClick={() => {
									setEditing(item);
									setFormOpen(true);
								}}
								className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
								<Pencil className='size-4' />
								Edit
							</button>
							<button
								type='button'
								onClick={() => setDeleteTarget(item)}
								className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-destructive transition-colors hover:bg-destructive/10'>
								<Trash2 className='size-4' />
								Delete
							</button>
						</div>
					</div>
				)}
			/>

			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				pending={pending}
			/>

			{(mutationError || error) && <StatusError message={mutationError || error || ''} />}

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
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateExamPartInput>({
		defaultValues: { skill_id: skills[0]?.id ?? 0, part_number: 1, name: '' },
	});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open)
			reset(
				examPart
					? {
							id: examPart.id,
							skill_id: examPart.skill_id,
							part_number: examPart.part_number,
							name: examPart.name,
						}
					: { skill_id: skills[0]?.id ?? 0, part_number: 1, name: '' },
			);
	}, [open, examPart, skills, reset]);
	const submit = (values: CreateExamPartInput) =>
		onSave({ ...(examPart ? { id: examPart.id } : {}), ...values, name: values.name.trim() });

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={examPart ? 'Edit exam part' : 'Create exam part'}
			description={examPart ? `Update part ${examPart.name}.` : 'Add a new exam part.'}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<Field
						label='Skill'
						error={errors.skill_id}>
						<select
							className={fieldClass}
							{...register('skill_id', {
								valueAsNumber: true,
								required: 'Skill is required.',
							})}>
							{skills.map((skill) => (
								<option
									key={skill.id}
									value={skill.id}>
									{skill.name}
								</option>
							))}
						</select>
					</Field>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Field
							label='Part number'
							error={errors.part_number}>
							<input
								type='number'
								min={1}
								className={fieldClass}
								{...register('part_number', {
									valueAsNumber: true,
									min: { value: 1, message: 'Part number is required.' },
								})}
							/>
						</Field>
						<Field
							label='Name'
							placeholder='Part 1'
							error={errors.name}
							{...register('name', { required: 'Name is required.' })}
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
						{examPart ? 'Save part' : 'Create part'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
