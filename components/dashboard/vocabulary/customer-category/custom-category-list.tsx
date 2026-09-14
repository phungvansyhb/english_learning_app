'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { FolderPlus, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ModalCreateCusCate, {
	type CustomerCategoryFormValues,
} from '@/components/dashboard/vocabulary/customer-category/modal-create-cus-cate';
import {
	createUserVocabCategory,
	deleteUserVocabCategory,
	listUserVocabCategories,
	updateUserVocabCategory,
	type UserVocabCategoryRow,
} from '@/services/user-vocab-category';

export default function CustomCategoryList() {
	const [categories, setCategories] = useState<UserVocabCategoryRow[]>([]);
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<UserVocabCategoryRow | null>(null);
	const [pendingCategoryId, setPendingCategoryId] = useState<number | null>(null);
	const [isMutating, setIsMutating] = useState(false);
	const [isPending, startTransition] = useTransition();
	const isBusy = isPending || isMutating;

	const loadCategories = useCallback(async (query: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await listUserVocabCategories({ search: query.trim() || undefined });
			setCategories(data);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh mục');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadCategories('');
	}, [loadCategories]);

	function openCreateModal() {
		setEditingCategory(null);
		setError(null);
		setIsModalOpen(true);
	}

	function openEditModal(category: UserVocabCategoryRow) {
		setEditingCategory(category);
		setError(null);
		setIsModalOpen(true);
	}

	function handleSubmit(formValues: CustomerCategoryFormValues) {
		setError(null);
		setIsMutating(true);
		startTransition(async () => {
			try {
				const name = formValues.name.trim();
				const savedCategory = editingCategory
					? await updateUserVocabCategory(editingCategory.id, {
							name,
							description: formValues.description.trim() || null,
						})
					: await createUserVocabCategory({
							name,
							description: formValues.description.trim() || null,
						});
				if (!savedCategory) throw new Error('Không tìm thấy danh mục để cập nhật');
				setCategories((current) =>
					editingCategory
						? current.map((category) =>
								category.id === savedCategory.id ? savedCategory : category,
							)
						: [savedCategory, ...current],
				);
				setIsModalOpen(false);
			} catch (saveError) {
				setError(saveError instanceof Error ? saveError.message : 'Không thể lưu danh mục');
			} finally {
				setIsMutating(false);
			}
		});
	}

	async function handleDelete(category: UserVocabCategoryRow) {
		if (!window.confirm(`Xoá danh mục “${category.name}”?`)) return;

		setPendingCategoryId(category.id);
		setIsMutating(true);
		setError(null);
		startTransition(async () => {
			try {
				const deletedCategory = await deleteUserVocabCategory(category.id);
				if (!deletedCategory) throw new Error('Không tìm thấy danh mục để xoá');
				setCategories((current) => current.filter((item) => item.id !== category.id));
			} catch (deleteError) {
				setError(
					deleteError instanceof Error ? deleteError.message : 'Không thể xoá danh mục',
				);
			} finally {
				setPendingCategoryId(null);
				setIsMutating(false);
			}
		});
	}

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<p className='text-sm text-muted-foreground'>
						Tạo bộ từ riêng để học theo mục tiêu của bạn.
					</p>
				</div>
				<Button
					type='button'
					size='sm'
					disabled={isBusy}
					onClick={openCreateModal}>
					<Plus className='size-4' />
					Tạo danh mục
				</Button>
			</div>

			<label className='relative block'>
				<span className='sr-only'>Tìm danh mục của tôi</span>
				<Search className='top-1/2 right-3 absolute size-4 text-muted-foreground -translate-y-1/2' />
				<input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') void loadCategories(search);
					}}
					placeholder='Tìm danh mục...'
					className='input-wrapper'
				/>
			</label>

			{error && (
				<div
					role='alert'
					className='flex items-center justify-between gap-3 bg-destructive/10 p-3 rounded-lg text-destructive text-sm'>
					<span>{error}</span>
					<Button
						type='button'
						variant='ghost'
						size='xs'
						onClick={() => void loadCategories(search)}>
						Thử lại
					</Button>
				</div>
			)}

			{isLoading ? (
				<div className='flex justify-center items-center py-14 text-muted-foreground'>
					<Loader2 className='mr-2 size-5 animate-spin' /> Đang tải danh mục...
				</div>
			) : categories.length === 0 ? (
				<div className='flex flex-col justify-center items-center border border-border border-dashed rounded-xl min-h-52 text-center'>
					<div className='flex justify-center items-center bg-brand-purple-soft mb-3 rounded-full size-11 text-brand-purple'>
						<FolderPlus className='size-5' />
					</div>
					<h3 className='font-semibold text-foreground'>Chưa có danh mục riêng</h3>
					<p className='mt-1 max-w-xs text-muted-foreground text-sm'>
						Lưu những từ bạn muốn ôn lại thành một bộ học tập riêng.
					</p>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='mt-4'
						onClick={openCreateModal}>
						<Plus className='size-4' /> Tạo danh mục đầu tiên
					</Button>
				</div>
			) : (
				<div className='gap-3 grid grid-cols-1 sm:grid-cols-2 max-h-screen overflow-y-auto'>
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/vocabulary/my/${category.id}`}
							className='group bg-secondary p-3 border border-border rounded-xl transition-colors flex flex-col justify-between'>
							<div className='relative'>
								<div className='min-w-0'>
									<div className='flex items-center gap-1'>
										<div className='flex justify-center items-center bg-brand-purple-soft rounded-lg size-8 text-brand-purple shrink-0'>
											<FolderPlus className='size-4' />
										</div>
										<h3 className='font-semibold text-sm text-foreground line-clamp-2'>
											{category.name}
										</h3>
									</div>
									<p className='mt-3 text-muted-foreground text-sm line-clamp-2 min-h-10'>
										{category.description || 'Chưa có mô tả'}
									</p>
								</div>
								<div className='absolute -top-2 -right-2 hidden group-hover:flex  shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-secondary rounded blur-in'>
									<Button
										type='button'
										variant='ghost'
										size='icon-sm'
										disabled={isBusy}
										onClick={(e) => {
											e.preventDefault();
											openEditModal(category);
										}}
										aria-label={`Sửa ${category.name}`}>
										<Pencil className='size-3' />
									</Button>
									<Button
										type='button'
										variant='ghost'
										size='icon-sm'
										onClick={(e) => {
											e.preventDefault();
											void handleDelete(category);
										}}
										disabled={isBusy}
										aria-label={`Xoá ${category.name}`}>
										{pendingCategoryId === category.id ? (
											<Loader2 className='size-3 animate-spin' />
										) : (
											<Trash2 className='size-3' />
										)}
									</Button>
								</div>
							</div>
							<p className='mt-4 text-muted-foreground text-xs'>
								Tạo ngày {new Date(category.created_at).toLocaleDateString('vi-VN')}
							</p>
						</Link>
					))}
				</div>
			)}

			<ModalCreateCusCate
				open={isModalOpen}
				onClose={() => !isBusy && setIsModalOpen(false)}
				onSubmit={handleSubmit}
				editingCategory={editingCategory}
				isBusy={isBusy}
				error={error}
			/>
		</div>
	);
}
