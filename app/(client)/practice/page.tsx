import AnswerMode from '@/components/dashboard/practice/answer-mode';
import AnswerUi from '@/components/dashboard/practice/answer-ui';
import QuestionMode from '@/components/dashboard/practice/question-mode';
import QuestionUi from '@/components/dashboard/practice/question-ui';
import { AnswerModeType, QuestionModeType, ServerPageProps } from '@/lib/types';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import PracticeControls from '@/components/dashboard/practice/practice-controls';
import Image from 'next/image';

type Props = {};

export default async function PracticeScreen({ searchParams }: ServerPageProps) {
	const { ask = 'listen', answer = 'speak', topic = 'all' } = await searchParams;
	const questionMode = ask as QuestionModeType;
	const answerMode = answer as AnswerModeType;

	return (
		<main className='mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:gap-8 md:p-8'>
			<header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<div className='flex items-start gap-3'>
					<div className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground'>
						<Sparkles aria-hidden='true' />
					</div>
					<div>
						<p className='text-sm font-medium text-muted-foreground'>Daily practice</p>
						<h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Practice your way</h1>
					</div>
				</div>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<CheckCircle2 className='size-4 text-brand-mint-foreground' aria-hidden='true' />
					<span>Question 1 of 10</span>
				</div>
			</header>

			<PracticeControls selectedTopic={topic as string} />

			<div className='h-2 overflow-hidden rounded-full bg-white/60'>
				<div className='h-full w-[10%] rounded-full bg-primary' />
			</div>

			<section className='grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]'>
				<article className='flex min-h-100 flex-col rounded-3xl bg-white p-5 shadow-sm md:p-7'>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
								Question
							</p>
							<h2 className='mt-1 text-lg font-bold'>Understand the prompt</h2>
						</div>
						<QuestionMode questionMode={questionMode} answerMode={answerMode} />
					</div>
					<div className='flex flex-1 flex-col justify-center gap-5 py-8'>
						<div className='flex items-center gap-3'>
							<Image src='/illustrations/sticky-man-head.gif' alt='' width={72} height={72} />
							<p className='text-sm text-muted-foreground'>Take a moment, then respond naturally.</p>
						</div>
						<QuestionUi mode={questionMode} />
					</div>
				</article>

				<article className='flex min-h-100 flex-col rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm md:p-7'>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
								Your answer
							</p>
							<h2 className='mt-1 text-lg font-bold'>Choose how to respond</h2>
						</div>
						<AnswerMode questionMode={questionMode} answerMode={answerMode} />
					</div>
					<div className='flex flex-1 flex-col justify-center py-8'>
						<AnswerUi mode={answerMode} />
					</div>
				</article>
			</section>

			<div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
				<span>Submit when you&apos;re ready</span>
				<ChevronRight className='size-4' aria-hidden='true' />
			</div>
		</main>
	);
}
