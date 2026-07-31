import { ChevronLeft, ChevronRight, FlameIcon } from 'lucide-react';

import { calendarDays } from '@/lib/data';
import { cn } from '@/lib/utils';

export function CalendarCard() {
	return (
		<section className='bg-card p-5 border border-border rounded-3xl'>
			<div className='flex justify-between items-center'>
				<button
					type='button'
					aria-label='Previous month'
					className='flex justify-center items-center hover:bg-secondary border border-border rounded-full size-9 text-foreground transition-colors'>
					<ChevronLeft className='size-4' />
				</button>
				<h2 className='font-bold text-foreground text-lg'>March 2024</h2>
				<button
					type='button'
					aria-label='Next month'
					className='flex justify-center items-center hover:bg-secondary border border-border rounded-full size-9 text-foreground transition-colors'>
					<ChevronRight className='size-4' />
				</button>
			</div>

			<div className='gap-1 grid grid-cols-7 mt-5'>
				{calendarDays.map((day) => (
					<button
						key={day.label}
						type='button'
						aria-label={`${day.label} ${day.date}`}
						aria-pressed={day.active}
						className={cn(
							'flex flex-col items-center gap-2 hover:bg-secondary py-2 rounded-2xl transition-colors',
							day.active && 'bg-accent hover:bg-accent',
						)}>
						<span className='font-medium text-muted-foreground text-xs'>
							{day.label}
						</span>
						<span
							className={cn(
								'font-semibold text-foreground text-sm',
								day.active && 'text-accent-foreground',
							)}>
							{day.date}
							<FlameIcon
								size={12}
								color='oklch(0.78 0.13 55)'
							/>
						</span>
					</button>
				))}
			</div>
		</section>
	);
}
