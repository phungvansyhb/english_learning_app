import React from 'react';
import ListeningPlayer from './listening-player';
import { QuestionModeType } from '@/lib/types';

type Props = { mode: QuestionModeType };

export default function QuestionUi({ mode }: Props) {
	if (mode === 'listen') return <ListeningPlayer />;
	return (
		<p className='h-50 bg-white rounded-xl p-4 md:p-6 lg:p-8 border'>
			I have cities, but no houses. I have mountains, but no trees. I have water, but no fish.
			What am I?
		</p>
	);
}
