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
	const [typedAnswer, setTypedAnswer] = useState('');
	const [submittedAnswer, setSubmittedAnswer] = useState('');
	const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
	const { transcript, isRecording, error, isSupported, startListening, resetTranscript } =
		useSpeech({ lang: 'en-US', continuous: false });
	const { questions, index, next } = usePracticeStore();
	const expectedAnswer = questions[index]?.sentence_en;

	const reactionOptions = [
		{ key: 'like', emoji: '👍' },
		{ key: 'celebrate', emoji: '🎉' },
		{ key: 'fire', emoji: '🔥' },
	] as const;

	const peerAnswers = [
		{ name: 'Ava', text: 'I think the answer is about focusing on your goals every day.' },
		{
			name: 'Liam',
			text: 'This sentence is about staying consistent and practicing regularly.',
		},
		{ name: 'Noah', text: 'The idea is to keep improving little by little.' },
	];

	const [peerReactions, setPeerReactions] = useState<Record<string, Record<string, number>>>(
		() => ({
			Ava: { like: 12, celebrate: 6, fire: 3 },
			Liam: { like: 9, celebrate: 4, fire: 2 },
			Noah: { like: 14, celebrate: 5, fire: 7 },
		}),
	);

	useEffect(() => {
		if (!transcript || !expectedAnswer) return;
		setMatchPercentage(getMatchPercentage(transcript, expectedAnswer));
		setSubmittedAnswer(transcript);
		setSubmitted(true);
	}, [expectedAnswer, transcript]);

	const startRecognition = () => {
		if (!isSupported) return;
		resetTranscript();
		startListening();
	};

	const handleSubmitTextAnswer = () => {
		const answer = typedAnswer.trim();
		if (!answer || !expectedAnswer) return;
		setSubmittedAnswer(answer);
		setMatchPercentage(getMatchPercentage(answer, expectedAnswer));
		setSubmitted(true);
	};

	const handleTryAgain = () => {
		setSubmitted(false);
		setSubmittedAnswer('');
		setTypedAnswer('');
		setMatchPercentage(null);
		if (mode === 'speak') resetTranscript();
	};

	const handleNextQuestion = () => {
		handleTryAgain();
		next();
	};

	const handleReact = (name: string, reactionKey: string) => {
		setPeerReactions((current) => ({
			...current,
			[name]: {
				...(current[name] ?? { like: 0, celebrate: 0, fire: 0 }),
				[reactionKey]: (current[name]?.[reactionKey] ?? 0) + 1,
			},
		}));
	};

	if (submitted)
		return (
			<div className='flex min-h-40 flex-col gap-4 rounded-2xl bg-secondary p-4 md:p-5'>
				<div className='flex items-start gap-3'>
					<CheckCircle2
						className='mt-0.5 size-5 text-brand-mint-foreground'
						aria-hidden='true'
					/>
					<div className='w-full'>
						<p className='font-semibold'>Match: {matchPercentage ?? 0}%</p>
						<p className='mt-1 text-sm text-muted-foreground'>
							Your answer: {submittedAnswer || 'No answer detected.'}
						</p>
					</div>
				</div>

				<div className='rounded-2xl border border-border/60 bg-background/60 p-3'>
					<p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
						System answer
					</p>
					<p className='mt-2 text-sm leading-6 text-foreground'>
						{expectedAnswer ?? 'No system answer available yet.'}
					</p>
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
							Other learners
						</p>
						<span className='text-xs text-muted-foreground'>Mockup</span>
					</div>
					<ul className='space-y-2'>
						{peerAnswers.map((item) => (
							<li
								key={item.name}
								className='rounded-xl border border-border/60 bg-white/70 p-2.5'>
								<div className='mb-1 flex items-center gap-2'>
									<span className='inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary'>
										{item.name.slice(0, 1)}
									</span>
									<span className='text-sm font-medium'>{item.name}</span>
								</div>
								<p className='text-sm text-muted-foreground'>“{item.text}”</p>
								<div className='mt-3 flex flex-wrap gap-2'>
									{reactionOptions.map(({ key, emoji }) => (
										<button
											type='button'
											key={key}
											aria-label={`React ${emoji} to ${item.name}'s answer`}
											onClick={() => handleReact(item.name, key)}
											className='inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground'>
											<span aria-hidden='true'>{emoji}</span>
											<span>{peerReactions[item.name]?.[key] ?? 0}</span>
										</button>
									))}
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className='flex justify-end gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={handleTryAgain}>
						<RotateCcw data-icon='inline-start' /> Try again
					</Button>
					<Button
						size='sm'
						onClick={handleNextQuestion}>
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
					value={typedAnswer}
					onChange={(event) => setTypedAnswer(event.target.value)}
					className='min-h-40 w-full resize-none rounded-2xl bg-secondary/70 p-4 text-sm outline-none focus:ring-2 focus:ring-ring/30'
					rows={5}
				/>
				<Button
					className='self-end'
					onClick={handleSubmitTextAnswer}>
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
