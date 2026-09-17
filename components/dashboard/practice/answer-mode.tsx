'use client';

import { Button } from '@/components/ui/button';
import { AnswerModeType, QuestionModeType } from '@/lib/types';
import { MicVocalIcon, PencilSparklesIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
	questionMode: QuestionModeType;
	answerMode: AnswerModeType;
};

export default function AnswerMode({ questionMode, answerMode }: Props) {
	return (
		<div className='bg-secondary rounded-2xl inline-block'>
			<Link href={`/practice?ask=${questionMode}&answer=speak`}>
				<Button
					size='xs'
					variant={answerMode === 'speak' ? 'default' : 'secondary'}>
					<MicVocalIcon />
				</Button>
			</Link>
			<Link href={`/practice?ask=${questionMode}&answer=write`}>
				<Button
					size='xs'
					variant={answerMode === 'write' ? 'default' : 'secondary'}>
					<PencilSparklesIcon />
				</Button>
			</Link>
		</div>
	);
}
