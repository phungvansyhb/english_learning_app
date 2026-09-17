import React from 'react';
import ListeningPlayer from './listening-player';
import { QuestionModeType } from '@/lib/types';

type Props = { mode: QuestionModeType };

export default function QuestionUi({ mode }: Props) {
	if (mode === 'listen') return <ListeningPlayer />;
	return (
		<div className='rounded-2xl bg-secondary/70 p-5 text-lg font-medium leading-relaxed md:p-6'>
			<p>I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?</p>
		</div>
	);
}
