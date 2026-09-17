import Avatar from '@/components/dashboard/header/Avatar';
import AnswerMode from '@/components/dashboard/practice/answer-mode';
import AnswerUi from '@/components/dashboard/practice/answer-ui';
import QuestionMode from '@/components/dashboard/practice/question-mode';
import QuestionUi from '@/components/dashboard/practice/question-ui';
import { AnswerModeType, QuestionModeType, ServerPageProps } from '@/lib/types';
import Image from 'next/image';

type Props = {};

export default async function PracticeScreen({ searchParams }: ServerPageProps) {
	const { ask = 'listen', answer = 'speak' } = await searchParams;
	return (
		<section className='p-p-4 md:p-6 lg:p-8'>
			<div className='flex gap-10 items-center'>
				<div className='shrink-0 grow-0 min-w-50 flex flex-col items-center gap-2 justify-center'>
					<QuestionMode
						questionMode={ask as QuestionModeType}
						answerMode={answer as AnswerModeType}
					/>
					<Image
						src='/illustrations/sticky-man-head.gif'
						alt='Animation'
						width='120'
						height='120'
						className=''
					/>
				</div>
				<QuestionUi mode={ask as QuestionModeType} />
			</div>
			<br />
			<br />
			<br />
			<div className='flex gap-10 items-center'>
				<div className='shrink-0 grow-0 min-w-50 flex flex-col items-center gap-2 justify-center'>
					<AnswerMode
						questionMode={ask as QuestionModeType}
						answerMode={answer as AnswerModeType}
					/>
					<div className='rounded-full overflow-hidden'>
						<Avatar isBig />
					</div>
				</div>
				<AnswerUi mode={answer as AnswerModeType} />
			</div>
		</section>
	);
}
