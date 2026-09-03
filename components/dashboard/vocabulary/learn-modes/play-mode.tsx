'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Ttip from '@/components/ui/ttip';
import { WordCard } from '@/lib/types';
import { OTPField, PreviewCard } from '@base-ui/react';
import clsx from 'clsx';
import {
	BrainIcon,
	DoorClosedIcon,
	MessageCircleDashedIcon,
	PodiumIcon,
	SettingsIcon,
	Volume2,
} from 'lucide-react';
import Image from 'next/image';
import { Activity, useEffect, useState, useTransition } from 'react';

type Props = {
	words: WordCard[];
};

export default function PlayMode({ words }: Props) {
	const [isPending, startTransition] = useTransition();
	const [index, setIndex] = useState(0);
	const current = words[index];
	const [practiceMode, setPracticeMode] = useState<'meaning' | 'listen' | 'question' | 'mix'>(
		'meaning',
	);
	const [answerMode, setAnswerMode] = useState<
		'type_full' | 'type_partial' | 'speak' | 'choice' | 'mix'
	>('type_full');

	const [answer, setAnswer] = useState<string[]>(Array.from({ length: words.length }, () => ''));
	useState();

	const speak = (langCode: string) => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(current.word);
			utterance.lang = langCode;
			window.speechSynthesis.speak(utterance);
		}
	};
	const next = () => {
		startTransition(async () => {
			await new Promise((resolve) => setTimeout(resolve, 700));
			setIndex((value) => (value + 1) % words.length);
		});
	};

	const getPrimaryMeaning = (item: WordCard) => {
		if (item.meanings && item.meanings.length > 0) {
			return item.meanings.find((m) => m.is_primary_use) || null;
		}
		return null;
	};

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (['Space'].includes(e.code)) {
				e.preventDefault();
			}
			switch (e.code) {
				case 'Space':
					next();
					break;
				default:
					break;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [next, words.length]);

	return (
		<div>
			<div
				data-name='setting'
				className='flex justify-between items-center w-full'>
				<span>
					Progress {index + 1}/{words.length}
				</span>
				<Button
					size='icon-lg'
					variant='ghost'>
					<SettingsIcon className='size-6' />
				</Button>
			</div>
			{/* Question Area */}
			<Activity mode={practiceMode === 'meaning' ? 'visible' : 'hidden'}>
				<div className='text-center text-2xl font-semibold'>
					{getPrimaryMeaning(current)?.meaning}
				</div>
			</Activity>
			{/* Answer Area */}
			<Activity mode={answerMode === 'type_full' ? 'visible' : 'hidden'}>
				<OTPField.Root
					onValueComplete={(value: string) => {
						const newAnswer = [...answer];
						newAnswer[index] = value;
						setAnswer(newAnswer);
					}}
					length={current.word.replaceAll(' ', '').length}
					validationType='alphanumeric'
					aria-describedby={getPrimaryMeaning(current)?.meaning}
					className='flex w-full gap-2 justify-center mt-4'>
					{current.word.split(/()/).map((group, gIndex) => {
						if (group === ' ') {
							return <div className='w-5' />;
						}
						return Array.from({ length: group.length }, (_, index) => (
							<OTPField.Input
								key={`${gIndex}-${index}`}
								className='w-10 rounded input-wrapper'
								aria-label={
									index === 0
										? undefined
										: `Character ${index + 1} of ${current.word.replaceAll(' ', '').length}`
								}
							/>
						));
					})}
				</OTPField.Root>
			</Activity>
			{/* Animation */}
			<div className='flex mt-12 items-end w-1/2  mx-auto'>
				<div className='border-b h-1 w-full relative'>
					<Image
						src='/illustrations/sticky-man-2.gif'
						alt='Animation'
						width='56'
						height='56'
						className={clsx(
							'rotate-y-180 object-fill absolute bottom-0 animate-all duration-500 ease-out',
						)}
						style={{ left: `${Math.round((index / words.length) * 100)}%` }}
					/>
				</div>
				<DoorClosedIcon
					className='size-8 text-muted-foreground'
					strokeWidth='0.75'
				/>
			</div>
		</div>
	);
}
