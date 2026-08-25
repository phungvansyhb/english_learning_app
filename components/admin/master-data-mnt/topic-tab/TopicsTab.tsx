'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import type { CreateTopicInput, TopicRow } from '@/lib/types';
import { createTopic, deleteTopic, listTopics, updateTopic } from '@/services/master-data';
import { Modal } from '../../../ui/modal';
import { fieldClass, labelClass, StatusError } from '../shared';

export default function TopicsTab() {
	const [query, setQuery] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<TopicRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<TopicRow | null>(null);
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
		apiFunction: listTopics,
		perPage: 10,
		params: { search: query || undefined },
	});

	async function handleSave(item: Partial<TopicRow> & { id?: number }) {
		setMutationError(null);
		try {
			if (item.id) {
				await updateTopic(item.id, item);
			} else {
				await createTopic(item as CreateTopicInput);
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
			await deleteTopic(deleteTarget.id);
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
					<h2 className='text-lg font-bold text-foreground'>Topics</h2>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Create labels for vocabulary and lessons.
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
							placeholder='Search topics'
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
						Add topic
					</button>
				</div>
			</div>

			<DataTable
				data={items}
				isLoading={pending}
				rowKey={(item) => item.id}
				emptyState='No topics found.'
				columns={[
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

			<TopicFormModal
				open={formOpen}
				topic={editing}
				onClose={() => {
					setFormOpen(false);
					setEditing(null);
				}}
				onSave={handleSave}
			/>

			<Modal
				open={Boolean(deleteTarget)}
				onClose={() => setDeleteTarget(null)}
				title='Delete topic'
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

function TopicFormModal({
	open,
	topic,
	onClose,
	onSave,
}: {
	open: boolean;
	topic: TopicRow | null;
	onClose: () => void;
	onSave: (input: Partial<TopicRow> & { id?: number }) => void;
}) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateTopicInput>({ defaultValues: { name: '' } });
	const [draft, setDraft] = useState<CreateTopicInput>({ name: '' });
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		if (topic) {
			setDraft({ id: topic.id, name: topic.name });
			setError(null);
		} else {
			setDraft({ name: '' });
			setError(null);
		}
		reset(topic ? { id: topic.id, name: topic.name } : { name: '' });
	}, [open, topic, reset]);

	function handleChange<K extends keyof CreateTopicInput>(key: K, value: CreateTopicInput[K]) {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}

	const submit = (values: CreateTopicInput) =>
		onSave({ ...(topic ? { id: topic.id } : {}), ...values, name: values.name.trim() });

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={topic ? 'Edit topic' : 'Create topic'}
			description={topic ? `Update topic ${topic.name}.` : 'Add a new topic.'}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
						<Field
							label='Name'
							placeholder='Enter topic name'
							error={errors.name}
							{...register('name', { required: 'Name is required.' })}
						/>
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
						{topic ? 'Save topic' : 'Create topic'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
