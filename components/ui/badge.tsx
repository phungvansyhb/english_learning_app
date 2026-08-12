import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
	default: 'border-transparent bg-primary text-primary-foreground',
	secondary: 'border-transparent bg-secondary text-secondary-foreground',
	outline: 'text-foreground',
};

export function Badge({
	className,
	variant = 'default',
	...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof badgeVariants }) {
	return (
		<div
			className={cn(
				'inline-flex w-fit items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
				badgeVariants[variant],
				className,
			)}
			{...props}
		/>
	);
}
