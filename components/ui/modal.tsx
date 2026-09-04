'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
	closeOnOutsideClick?: boolean;
}

export function Modal({
	open,
	onClose,
	title,
	description,
	children,
	className,
	closeOnOutsideClick = true,
}: ModalProps) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && closeOnOutsideClick) onClose();
		};
		document.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	}, [open, onClose, closeOnOutsideClick]);

	if (!open) return null;

	return (
		<div className='fixed inset-0 z-60 flex items-end justify-center p-0 sm:items-center sm:p-4'>
			<div
				aria-hidden
				onClick={closeOnOutsideClick ? onClose : undefined}
				className='absolute inset-0 bg-foreground/40 backdrop-blur-sm'
			/>
			<div
				role='dialog'
				aria-modal='true'
				aria-label={title}
				className={cn(
					'relative z-10 flex max-h-[92vh] flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl w-full lg:max-w-5xl xl:max-w-6xl sm:rounded-3xl',
					className,
				)}>
				<div className='flex items-start justify-between gap-4 border-b border-border px-6 py-5'>
					<div>
						<h2 className='text-lg font-bold text-foreground'>{title}</h2>
						{description && (
							<p className='mt-0.5 text-sm text-muted-foreground'>{description}</p>
						)}
					</div>
					<Button
						size='icon'
						variant='secondary'
						type='button'
						onClick={onClose}
						aria-label='Close dialog'
						className='flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground'>
						<X className='size-5' />
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
}
