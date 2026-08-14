'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const activity = [
	{ day: 'Mon', learners: 420, lessons: 280 },
	{ day: 'Tue', learners: 510, lessons: 350 },
	{ day: 'Wed', learners: 465, lessons: 315 },
	{ day: 'Thu', learners: 620, lessons: 440 },
	{ day: 'Fri', learners: 590, lessons: 390 },
	{ day: 'Sat', learners: 730, lessons: 520 },
	{ day: 'Sun', learners: 680, lessons: 470 },
];

export function LearningActivityChart() {
	const [range, setRange] = useState('7d');

	return (
		<Card className='min-w-0'>
			<CardHeader className='gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<CardTitle>Learning activity</CardTitle>
					<CardDescription className='mt-1'>Weekly learner engagement across the app</CardDescription>
				</div>
				<div className='flex items-center gap-1 rounded-lg bg-secondary p-1'>
					{['7d', '30d', '90d'].map((item) => <Button key={item} variant={range === item ? 'outline' : 'ghost'} size='sm' onClick={() => setRange(item)}>{item.toUpperCase()}</Button>)}
				</div>
			</CardHeader>
			<CardContent className='px-2 pb-4 sm:px-6'>
				<div className='h-64 w-full'>
					<ResponsiveContainer width='100%' height='100%'>
						<AreaChart data={activity} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
							<defs>
								<linearGradient id='learnerFill' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='0%' stopColor='var(--brand-purple)' stopOpacity={0.45} />
									<stop offset='100%' stopColor='var(--brand-purple)' stopOpacity={0.03} />
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} stroke='var(--border)' strokeDasharray='4 4' />
							<XAxis dataKey='day' axisLine={false} tickLine={false} tickMargin={10} />
							<YAxis axisLine={false} tickLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
							<Tooltip cursor={{ stroke: 'var(--brand-purple)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
							<Area type='monotone' dataKey='learners' name='Learners' stroke='var(--primary)' strokeWidth={2.5} fill='url(#learnerFill)' />
							<Area type='monotone' dataKey='lessons' name='Lessons' stroke='var(--brand-pink)' strokeWidth={2} fill='none' />
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
