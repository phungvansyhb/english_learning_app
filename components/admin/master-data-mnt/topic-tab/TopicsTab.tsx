'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { Plus, Search, Pencil, Trash2, LoaderIcon } from 'lucide-react';

import type { CreateTopicInput, TopicRow } from '@/lib/types';
import { cn } from '@/lib/utils';
import { createTopic, deleteTopic, listTopics, updateTopic } from '@/services/master-data';
import { Modal } from '../../modal';
import { fieldClass, labelClass, StatusError } from '../shared';

export default function TopicsTab() {
	const [items, setItems] = useState<TopicRow[]>([]);
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [perPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<TopicRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<TopicRow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setError(null);
		startTransition(async () => {
			try {
				const response = await listTopics({
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

	async function handleSave(item: Partial<TopicRow> & { id?: number }) {
		setError(null);
		startTransition(async () => {
			try {
				if (item.id) {
					await updateTopic(item.id, item);
				} else {
					await createTopic(item as CreateTopicInput);
				}
				setFormOpen(false);
				setEditing(null);
				const response = await listTopics({
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
				await deleteTopic(deleteTarget.id);
				setDeleteTarget(null);
				const response = await listTopics({
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
								setPage(1);
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

			<div className='overflow-hidden rounded-2xl border border-border'>
				<table className='w-full border-collapse text-left text-sm'>
					<thead>
						<tr className='bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground'>
							<th className='px-4 py-3 font-semibold'>Name</th>
							<th className='px-4 py-3 text-right font-semibold'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr
								key={item.id}
								className='border-t border-border align-baseline'>
								<td className='px-4 py-2 text-foreground inline-flex items-center'>
									{item.name}
								</td>
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
						No topics found.
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
	const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTopicInput>({ defaultValues: { name: '' } });
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

	const submit = (values: CreateTopicInput) => onSave({ ...(topic ? { id: topic.id } : {}), ...values, name: values.name.trim() });

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
					<div>
						<label
							className={labelClass}
							htmlFor='topic-name'>
							Name
						</label>
<Field label='Name' placeholder='Grammar' error={errors.name} {...register('name', { required: 'Name is required.' })} />
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
						{topic ? 'Save topic' : 'Create topic'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
