'use client';

import { Button } from '@/components/ui/button';
import { AnswerModeType, QuestionModeType } from '@/lib/types';
import { MicVocalIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
	questionMode: QuestionModeType;
	answerMode: AnswerModeType;
};

export default function AnswerMode({ questionMode, answerMode }: Props) {
	return (
		<div className='bg-secondary rounded-2xl inline-block shrink-0'>
			<Link
				href={`/practice?ask=${questionMode}&answer=speak`}
				scroll={false}>
				<Button
					size='xs'
					aria-label='Speak answer'
					variant={answerMode === 'speak' ? 'default' : 'secondary'}>
					<MicVocalIcon />
				</Button>
			</Link>
			<Link
				href={`/practice?ask=${questionMode}&answer=write`}
				scroll={false}>
				<Button
					size='xs'
					variant={answerMode === 'write' ? 'default' : 'secondary'}>
					<PencilIcon />
				</Button>
			</Link>
		</div>
	);
}
