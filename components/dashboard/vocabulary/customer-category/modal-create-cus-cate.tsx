'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import type { UserVocabCategoryRow } from '@/services/user-vocab-category';

const customerCategorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Vui lòng nhập tên danh mục.')
		.max(100, 'Tên danh mục không được dài quá 100 ký tự.'),
	description: z.string().trim().max(500, 'Mô tả không được dài quá 500 ký tự.'),
});

export type CustomerCategoryFormValues = z.infer<typeof customerCategorySchema>;

interface ModalCreateCusCateProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: CustomerCategoryFormValues) => void;
	editingCategory: UserVocabCategoryRow | null;
	isBusy: boolean;
	error?: string | null;
}

export default function ModalCreateCusCate({
	open,
	onClose,
	onSubmit,
	editingCategory,
	isBusy,
	error,
}: ModalCreateCusCateProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CustomerCategoryFormValues>({
		resolver: zodResolver(customerCategorySchema),
		defaultValues: { name: '', description: '' },
	});

	useEffect(() => {
		if (!open) return;
		reset({
			name: editingCategory?.name ?? '',
			description: editingCategory?.description ?? '',
		});
	}, [editingCategory, open, reset]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
			description='Đặt tên dễ nhớ để tìm lại nhóm từ nhanh hơn.'
			className='w-xl'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-5 p-6'>
				<label className='flex flex-col gap-2 text-sm font-medium'>
					Tên danh mục
					<input
						{...register('name')}
						autoFocus
						maxLength={100}
						placeholder='Ví dụ: Từ vựng công việc'
						aria-invalid={Boolean(errors.name)}
						className='input-wrapper'
					/>
					{errors.name && (
						<span className='text-destructive text-sm'>{errors.name.message}</span>
					)}
				</label>
				<label className='flex flex-col gap-2 text-sm font-medium'>
					Mô tả{' '}
					<span className='font-normal text-muted-foreground'>(không bắt buộc)</span>
					<textarea
						{...register('description')}
						maxLength={500}
						rows={3}
						placeholder='Mục tiêu hoặc ngữ cảnh của bộ từ này'
						aria-invalid={Boolean(errors.description)}
						className='p-3 border border-input rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring w-full font-normal resize-none'
					/>
					{errors.description && (
						<span className='text-destructive text-sm'>
							{errors.description.message}
						</span>
					)}
				</label>
				{error && (
					<p
						role='alert'
						className='text-destructive text-sm'>
						{error}
					</p>
				)}
				<div className='flex justify-end gap-2'>
					<Button
						type='button'
						variant='secondary'
						onClick={onClose}
						disabled={isBusy}>
						Huỷ
					</Button>
					<Button
						type='submit'
						loading={isBusy}>
						{editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
