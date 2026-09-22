import { clsx, type ClassValue } from 'clsx'
import { Dayjs } from 'dayjs';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCalendarDays(month: Dayjs, today: Dayjs) {
  const referenceDay = month.isSame(today, 'month')
    ? today
    : month.date(Math.min(today.date(), month.daysInMonth()));

  return Array.from({ length: 7 }, (_, index) => {
    const day = referenceDay.startOf('isoWeek').add(index, 'day');

    return {
      label: day.format('ddd'),
      date: day.date(),
      dateKey: day.format('YYYY-MM-DD'),
      active: day.isSame(today, 'day'),
    };
  });
}

