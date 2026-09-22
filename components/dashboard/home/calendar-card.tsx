'use client';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ChevronLeft, ChevronRight, FlameIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn, getCalendarDays } from '@/lib/utils';
import { DATETIME_FORMAT } from '@/lib/types';
import { getUserActivities } from '@/services/auth';
import { useAuthStore } from '@/utils/zustand/auth-store';

dayjs.extend(isoWeek);

export function CalendarCard() {
	const today = dayjs();
	const [selectedMonth, setSelectedMonth] = useState(today.startOf('month'));
	const calendarDays = getCalendarDays(selectedMonth, today);
	const [activityDates, setActivityDates] = useState<Set<string>>(new Set());
	const { user, isLoading } = useAuthStore();

	useEffect(() => {
		if (!user || isLoading) return;

		let isCurrent = true;
		void getUserActivities().then((activities) => {
			if (!isCurrent) return;
			setActivityDates(
				new Set(
					activities.map(({ activity_date }) =>
						dayjs(activity_date).format(DATETIME_FORMAT.YYYY_MM_DD),
					),
				),
			);
		});

		return () => {
			isCurrent = false;
		};
	}, [isLoading, user]);

	return (
		<section className='bg-card p-5 border border-border rounded-3xl min-h-44'>
			<div className='flex justify-between items-center'>
				<button
					type='button'
					aria-label='Previous month'
					onClick={() => setSelectedMonth((month) => month.subtract(1, 'month'))}
					className='flex justify-center items-center hover:bg-secondary border border-border rounded-full size-9 text-foreground transition-colors'>
					<ChevronLeft className='size-4' />
				</button>
				<h2 className='font-bold text-foreground text-lg'>
					{selectedMonth.format(DATETIME_FORMAT.MMMM_YYYY)}
				</h2>
				<button
					type='button'
					aria-label='Next month'
					onClick={() => setSelectedMonth((month) => month.add(1, 'month'))}
					className='flex justify-center items-center hover:bg-secondary border border-border rounded-full size-9 text-foreground transition-colors'>
					<ChevronRight className='size-4' />
				</button>
			</div>

			<div className='gap-1 grid grid-cols-7 mt-5'>
				{calendarDays.map((day) => {
					const studied = activityDates.has(day.dateKey);

					return (
					<button
						key={day.dateKey}
						type='button'
						aria-label={`${day.label} ${day.date}`}
						aria-pressed={studied}
						className={cn(
							'flex flex-col items-center gap-2 hover:bg-secondary py-2 rounded-2xl transition-colors',
							studied && 'bg-accent hover:bg-accent',
							day.active && !studied && 'ring-1 ring-accent',
						)}>
						<span className='font-medium text-muted-foreground text-xs'>
							{day.label}
						</span>
						<span
							className={cn(
								'font-semibold text-foreground text-sm',
								studied && 'text-accent-foreground',
							)}>
							{day.date}
							{studied && <FlameIcon size={12} color='oklch(0.78 0.13 55)' />}
						</span>
					</button>
					);
				})}
			</div>
		</section>
	);
}

