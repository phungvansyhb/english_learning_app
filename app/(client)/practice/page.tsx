import AnswerMode from '@/components/dashboard/practice/answer-mode';
import AnswerUi from '@/components/dashboard/practice/answer-ui';
import QuestionMode from '@/components/dashboard/practice/question-mode';
import QuestionUi from '@/components/dashboard/practice/question-ui';
import { AnswerModeType, QuestionModeType, ServerPageProps } from '@/lib/types';
import { Repeat, Sparkles } from 'lucide-react';
import PracticeControls from '@/components/dashboard/practice/practice-controls';
import { Button } from '@/components/ui/button';

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
						<h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
							Practice your way
						</h1>
					</div>
				</div>
			</header>

			<PracticeControls />

			<section className='grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]'>
				<article className='flex lg:min-h-100 flex-col rounded-3xl bg-white p-5 md:p-7'>
					<div className='h-12 flex items-start justify-between gap-4'>
						<div className='grow-0 shrink-0 flex gap-2 items-center'>
							<p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
								Question
							</p>
							<Button
								variant='secondary'
								size='icon'>
								<Repeat className='size-4' />
							</Button>
						</div>
						<QuestionMode
							questionMode={questionMode}
							answerMode={answerMode}
						/>
					</div>
					<div className='mt-4 lg:mt-8'>
						<QuestionUi mode={questionMode} />
					</div>
				</article>

				<article className='flex lg:min-h-100 flex-col rounded-3xl bg-white/70 p-5 md:p-7'>
					<div className='flex items-start justify-between gap-4'>
						<div className='h-8 md:h-12'>
							<p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
								Your answer
							</p>
						</div>
						<AnswerMode
							questionMode={questionMode}
							answerMode={answerMode}
						/>
					</div>
					<div className='mt-4 lg:mt-8'>
						<AnswerUi mode={answerMode} />
					</div>
				</article>
			</section>
		</main>
	);
}
