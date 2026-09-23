'use client';

import ListeningPlayer from './listening-player';
import { QuestionModeType } from '@/lib/types';
import { usePracticeStore } from '@/utils/zustand/practice-store';

type Props = { mode: QuestionModeType };

export default function QuestionUi({ mode }: Props) {
	const { questions, index , isLoading } = usePracticeStore();
	const question = questions[index];

	if (mode === 'listen') return <ListeningPlayer text={question?.sentence_en ?? ''} />;

	return (
		<div className='rounded-2xl bg-secondary/70  text-lg font-medium leading-relaxed p-4 md:p-5 min-h-40'>
			<p>{question?.transcript ?? 'No practice questions available.'}</p>
		</div>
	);
}
