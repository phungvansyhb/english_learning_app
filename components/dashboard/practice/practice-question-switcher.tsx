'use client';

import { Button } from '@/components/ui/button';
import { usePracticeStore } from '@/utils/zustand/practice-store';
import { Repeat } from 'lucide-react';

export default function PracticeQuestionSwitcher() {
	const { next, questions } = usePracticeStore();
	const disabled = questions.length <= 1;

	return (
		<Button
			type='button'
			variant='secondary'
			size='icon'
			disabled={disabled}
			onClick={next}
			aria-label='Hiển thị câu hỏi khác'
			className='shrink-0'>
			<Repeat className='size-4' />
		</Button>
	);
}
