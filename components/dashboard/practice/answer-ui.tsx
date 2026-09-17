import { Button } from '@/components/ui/button';
import { AnswerModeType, QuestionModeType } from '@/lib/types';
import { MicVocalIcon } from 'lucide-react';
import React from 'react';

type Props = { mode: AnswerModeType };

export default function AnswerUi({ mode }: Props) {
	if (mode === 'write')
		return (
			<textarea
				className='input-wrapper min-h-50 p-4 md:p-6 lg:p-8'
				rows={10}></textarea>
		);
	return (
		<div className='h-50 flex justify-center items-center w-full'>
			<Button
				variant='secondary'
				size='icon-lg'>
				<MicVocalIcon className='size-5' />
			</Button>
		</div>
	);
}
