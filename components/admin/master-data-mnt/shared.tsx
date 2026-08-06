export const fieldClass =
	'h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30';
export const labelClass = 'mb-1.5 block text-xs font-semibold text-foreground';

export function StatusError({ message }: { message: string }) {
	return (
		<div className='rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive'>
			{message}
		</div>
	);
}
