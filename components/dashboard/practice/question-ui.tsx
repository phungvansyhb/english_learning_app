'use client';

import ListeningPlayer from './listening-player';
import { QuestionModeType } from '@/lib/types';
import { usePracticeStore } from '@/utils/zustand/practice-store';
import { Activity } from 'react';

type Props = { mode: QuestionModeType };

export default function QuestionUi({ mode }: Props) {
	const { questions, index, isLoading } = usePracticeStore();
	const question = questions[index];

	if (mode === 'listen') return <ListeningPlayer text={question?.sentence_en ?? ''} />;

	return (
		<div className='rounded-2xl bg-secondary/70  text-lg font-medium leading-relaxed p-4 md:p-5 min-h-40 transition-all duration-200'>
			<Activity mode={isLoading ? 'visible' : 'hidden'}>
				<div className='space-y-3'>
					<div className='w-full h-6 break-inside-avoid bg-gray-200 rounded animate-pulse' />
					<div className='w-full h-6 break-inside-avoid bg-gray-200 rounded animate-pulse' />
					<div className='w-full h-6 break-inside-avoid bg-gray-200 rounded animate-pulse' />
				</div>
			</Activity>
			<Activity mode={!isLoading ? 'visible' : 'hidden'}>
				<p>
					{question?.transcript ?? (
						<span className='text-muted-foreground text-sm'>
							This topic has no practice questions available.
						</span>
					)}
				</p>
			</Activity>
		</div>
	);
}
