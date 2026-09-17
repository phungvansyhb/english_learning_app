'use client';

import { Button } from '@/components/ui/button';
import { AnswerModeType, QuestionModeType } from '@/lib/types';
import { LanguagesIcon, SpeechIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
	questionMode: QuestionModeType;
	answerMode: AnswerModeType;
};

export default function QuestionMode({ questionMode, answerMode }: Props) {
	return (
		<div className='bg-secondary rounded-2xl inline-block'>
			<Link href={`/practice?ask=translate&answer=${answerMode}`}>
				<Button
					size='xs'
					aria-label='Translate prompt'
					variant={questionMode === 'translate' ? 'default' : 'secondary'}>
					<LanguagesIcon />
				</Button>
			</Link>
			<Link href={`/practice?ask=listen&answer=${answerMode}`}>
				<Button
					size='xs'
					variant={questionMode === 'listen' ? 'default' : 'secondary'}>
					<SpeechIcon />
				</Button>
			</Link>
		</div>
	);
}
