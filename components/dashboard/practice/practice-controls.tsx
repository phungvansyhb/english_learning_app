'use client';

import { Card } from '@/components/ui/card';
import { BookOpen, Clock3, Flame, ListChecks } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const practiceTopics = [
	{ value: 'all', label: 'All vocabulary' },
	{ value: 'daily-life', label: 'Daily life' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'work', label: 'Work & business' },
	{ value: 'food', label: 'Food & cooking' },
	{ value: 'health', label: 'Health & wellness' },
];

type Props = { selectedTopic: string };

export default function PracticeControls({ selectedTopic }: Props) {
	const router = useRouter();
	const [completed] = useState(12);
	const [seconds, setSeconds] = useState(8 * 60 + 42);

	useEffect(() => {
		const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
		return () => window.clearInterval(timer);
	}, []);

	const topic = practiceTopics.find((item) => item.value === selectedTopic) ?? practiceTopics[0];
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = String(seconds % 60).padStart(2, '0');

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-3 rounded-3xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-3'>
					<div className='flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
						<BookOpen aria-hidden='true' />
					</div>
					<div>
						<p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
							Practice topic
						</p>
						<p className='font-semibold'>{topic.label}</p>
					</div>
				</div>
				<select
					value={selectedTopic}
					onChange={(event) => router.push(`/practice?topic=${event.target.value}`)}
					aria-label='Choose vocabulary topic'
					className='h-10 w-full rounded-xl border px-3 text-sm font-medium outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring sm:w-56'>
					{practiceTopics.map((item) => (
						<option
							key={item.value}
							value={item.value}>
							{item.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
