'use client';

import { Button } from '@/components/ui/button';
import { AnswerModeType } from '@/lib/types';
import { CheckCircle2, MicVocalIcon, RotateCcw, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

type Props = { mode: AnswerModeType };

export default function AnswerUi({ mode }: Props) {
	const [submitted, setSubmitted] = useState(false);

	if (submitted)
		return (
			<div className='flex flex-col gap-4 rounded-2xl bg-brand-mint/40 p-5'>
				<div className='flex items-start gap-3'>
					<CheckCircle2 className='mt-0.5 size-5 text-brand-mint-foreground' aria-hidden='true' />
					<div>
						<p className='font-semibold'>Great match</p>
						<p className='mt-1 text-sm text-muted-foreground'>Your answer communicates the same meaning as the model answer.</p>
					</div>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline' size='sm' onClick={() => setSubmitted(false)}>
						<RotateCcw data-icon='inline-start' /> Try again
					</Button>
					<Button size='sm'>Next question <Send data-icon='inline-end' /></Button>
				</div>
			</div>
		);

	if (mode === 'write')
		return (
			<div className='flex flex-col gap-4'>
				<textarea
					aria-label='Write your answer'
					placeholder='Write your answer here...'
					className='min-h-40 w-full resize-none rounded-2xl border border-input bg-background p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30 md:min-h-48'
					rows={6}
				/>
				<Button className='self-end' onClick={() => setSubmitted(true)}>
					Submit answer <Send data-icon='inline-end' />
				</Button>
			</div>
		);

	return (
		<div className='flex flex-col items-center gap-5'>
			<button
				type='button'
				aria-label='Start speaking answer'
				onClick={() => setSubmitted(true)}
				className='group flex size-24 items-center justify-center rounded-full bg-secondary text-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4'>
				<span className='flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105'>
					<MicVocalIcon aria-hidden='true' />
				</span>
			</button>
			<div className='flex items-center gap-2 text-sm text-muted-foreground'>
				<Sparkles className='size-4' aria-hidden='true' />
				<span>Tap to speak your answer</span>
			</div>
		</div>
	);
}
