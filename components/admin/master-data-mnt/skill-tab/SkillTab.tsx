import { useEffect, useState } from 'react';
import { Field } from '@/components/ui/field';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { CreateSkillInput, SkillRow } from '@/lib/types';
import { createSkill, deleteSkill, listSkills, updateSkill } from '@/services/master-data';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/modal';
import { fieldClass, labelClass, StatusError } from '../shared';
type Props = {};

export default function SkillsTab() {
	const [query, setQuery] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<SkillRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<SkillRow | null>(null);
	const [mutationError, setMutationError] = useState<string | null>(null);
	const {
		data: skills,
		page,
		totalPages,
		pending,
		error,
		setPage,
		reload,
	} = usePagination({
		apiFunction: listSkills,
		perPage: 10,
		params: { search: query || undefined },
	});

	async function handleSave(item: Partial<SkillRow> & { id?: number }) {
		setMutationError(null);
		try {
			if (item.id) {
				await updateSkill(item.id, item);
			} else {
				await createSkill(item as CreateSkillInput);
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
			await deleteSkill(deleteTarget.id);
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
					<h2 className='text-lg font-bold text-foreground'>Skills</h2>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Manage TOEIC skill groups.
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

			<DataTable
				data={skills}
				isLoading={pending}
				rowKey={(skill) => skill.id}
				emptyState='No skills found.'
				columns={[
					{ key: 'code', header: 'Code' },
					{ key: 'name', header: 'Name' },
					{
						key: 'actions',
						header: 'Actions',
						className: 'text-right',
						cellClassName: 'w-24',
						render: (skill) => (
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
						),
					},
				]}
				renderMobileCard={(skill) => (
					<div className='space-y-3'>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Code
							</p>
							<p className='mt-1 text-sm font-medium text-foreground'>{skill.code}</p>
						</div>
						<div>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Name
							</p>
							<p className='mt-1 text-sm text-foreground'>{skill.name}</p>
						</div>
						<div className='flex gap-2 pt-1'>
							<button
								type='button'
								onClick={() => {
									setEditing(skill);
									setFormOpen(true);
								}}
								className='flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
								<Pencil className='size-4' />
								Edit
							</button>
							<button
								type='button'
								onClick={() => setDeleteTarget(skill)}
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
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateSkillInput>({ defaultValues: { code: '', name: '' } });
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
		reset(
			skill ? { id: skill.id, code: skill.code, name: skill.name } : { code: '', name: '' },
		);
	}, [open, skill, reset]);

	function handleChange<K extends keyof CreateSkillInput>(key: K, value: CreateSkillInput[K]) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	const submit = (values: CreateSkillInput) =>
		onSave({
			...(skill ? { id: skill.id } : {}),
			...values,
			code: values.code.trim(),
			name: values.name.trim(),
		});

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={skill ? 'Edit skill' : 'Create skill'}
			description={skill ? `Update skill ${skill.name}.` : 'Add a new skill.'}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
					<div>
						<label
							className={labelClass}
							htmlFor='skill-code'>
							Code
						</label>
						<Field
							label='Code'
							placeholder='TOEIC'
							error={errors.code}
							{...register('code', { required: 'Code is required.' })}
						/>
					</div>
					<div>
						<label
							className={labelClass}
							htmlFor='skill-name'>
							Name
						</label>
						<Field
							label='Name'
							placeholder='Listening'
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
						{skill ? 'Save skill' : 'Create skill'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
