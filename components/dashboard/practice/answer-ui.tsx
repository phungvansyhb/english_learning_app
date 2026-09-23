'use client';

import { Button } from '@/components/ui/button';
import { AnswerModeType } from '@/lib/types';
import { useSpeech } from '@/hooks/use-speech';
import { CheckCircle2, MicVocalIcon, RotateCcw, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePracticeStore } from '@/utils/zustand/practice-store';

type Props = { mode: AnswerModeType };

const normalize = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

const getMatchPercentage = (actual: string, expected: string) => {
	const actualWords = new Set(normalize(actual).split(' ').filter(Boolean));
	const expectedWords = new Set(normalize(expected).split(' ').filter(Boolean));
	if (expectedWords.size === 0) return 0;
	const matchedWords = [...actualWords].filter((word) => expectedWords.has(word)).length;
	return Math.min(100, Math.round((matchedWords / expectedWords.size) * 100));
};

export default function AnswerUi({ mode }: Props) {
	const [submitted, setSubmitted] = useState(false);
	const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
	const { transcript, isRecording, error, isSupported, startListening, resetTranscript } =
		useSpeech({ lang: 'en-US', continuous: false });
	const { questions, index } = usePracticeStore();
	const expectedAnswer = questions[index]?.sentence_en;
	useEffect(() => {
		if (!transcript || !expectedAnswer) return;
		setMatchPercentage(getMatchPercentage(transcript, expectedAnswer));
		setSubmitted(true);
	}, [expectedAnswer, transcript]);

	const startRecognition = () => {
		if (!isSupported) return;
		resetTranscript();
		startListening();
	};

	if (submitted)
		return (
			<div className='flex min-h-40 flex-col gap-4 rounded-2xl bg-secondary p-4 md:p-5'>
				<div className='flex items-start gap-3'>
					<CheckCircle2
						className='mt-0.5 size-5 text-brand-mint-foreground'
						aria-hidden='true'
					/>
					<div>
						<p className='font-semibold'>Match: {matchPercentage ?? 0}%</p>
						<p className='mt-1 text-sm text-muted-foreground'>
							Heard: {transcript || 'No answer detected.'}
						</p>
					</div>
				</div>
				<div className='flex justify-end gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setSubmitted(false)}>
						<RotateCcw data-icon='inline-start' /> Try again
					</Button>
					<Button size='sm'>
						Next question <Send data-icon='inline-end' />
					</Button>
				</div>
			</div>
		);

	if (mode === 'write')
		return (
			<div className='flex flex-col gap-4'>
				<textarea
					aria-label='Write your answer'
					placeholder='Write your answer here...'
					className='min-h-40 w-full resize-none rounded-2xl bg-secondary/70 p-4 text-sm outline-none focus:ring-2 focus:ring-ring/30'
					rows={5}
				/>
				<Button
					className='self-end'
					onClick={() => setSubmitted(true)}>
					Submit answer <Send data-icon='inline-end' />
				</Button>
			</div>
		);

	return (
		<div className='flex flex-col items-center gap-5'>
			<button
				type='button'
				aria-label='Start speaking answer'
				disabled={isRecording}
				onClick={startRecognition}
				className='group flex size-24 items-center justify-center rounded-full bg-secondary text-foreground transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4'>
				<span className='flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm'>
					<MicVocalIcon aria-hidden='true' />
				</span>
			</button>
			<div className='flex items-center gap-2 text-sm text-muted-foreground'>
				<Sparkles
					className='size-4'
					aria-hidden='true'
				/>
				<span>{isRecording ? 'Đang nghe...' : 'Tap to speak your answer'}</span>
			</div>
			{error && (
				<p className='text-center text-sm text-destructive'>
					{error === 'Browser_not_supported'
						? 'Trình duyệt này không hỗ trợ nhận diện giọng nói.'
						: 'Không thể nhận diện câu trả lời. Hãy thử lại.'}
				</p>
			)}
		</div>
	);
}
