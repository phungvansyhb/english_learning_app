'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import Ttip from '@/components/ui/ttip';
import { useSpeech } from '@/hooks/use-speech';
import { WordCard } from '@/lib/types';
import { OTPField, PreviewCard, Radio, RadioGroup } from '@base-ui/react';
import clsx from 'clsx';
import {
	AudioLinesIcon,
	BrainIcon,
	DoorClosedIcon,
	MessageCircleDashedIcon,
	MicIcon,
	PodiumIcon,
	SettingsIcon,
	SpeakerIcon,
	Volume2,
	Volume2Icon,
} from 'lucide-react';
import Image from 'next/image';
import {
	Activity,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react';

type Props = {
	words: WordCard[];
};

export default function PlayMode({ words }: Props) {
	const [isPending, startTransition] = useTransition();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const current = words[index];
	const { transcript, isRecording, isSupported, error, startListening } = useSpeech({
		lang: 'en-US',
	});

	const [practiceMode, setPracticeMode] = useState<'meaning' | 'listen' | 'collocation' | 'mix'>(
		'collocation',
	);
	const [answerMode, setAnswerMode] = useState<
		'type_full' | 'type_partial' | 'speak' | 'choice' | 'mix'
	>('choice');

	const [answer, setAnswer] = useState<Map<string, string>>(() => {
		const init = new Map();
		words.forEach((w) => {
			init.set(w.word, '');
		});
		return init;
	});

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

	const getPrimaryMeaning = () => {
		if (current.meanings && current.meanings.length > 0) {
			return current.meanings.find((m) => m.is_primary_use) || null;
		}
		return null;
	};

	const questionChoiceList = useMemo(() => {
		const correctAnswer = current.word;
		const listWords = words.map((item) => item.word);
		const choices = [
			correctAnswer,
			...listWords.filter((word) => word !== correctAnswer).sort(() => Math.random() - 0.5),
		].slice(0, 4);
		return choices;
	}, [current]);

	const checkAnswer = (value: string) => {
		startTransition(() => {
			const newAnswer = new Map(answer).set(current.word, value);
			setAnswer(newAnswer);
			if (value === current.word) {
				setProgress(progress + 1);
				next();
			} else {
			}
		});
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
					variant='ghost'
					onClick={() => setIsModalOpen(true)}>
					<SettingsIcon className='size-6' />
				</Button>
			</div>
			{/* Question Area */}
			<Activity mode={practiceMode === 'meaning' ? 'visible' : 'hidden'}>
				<div className='text-center text-2xl font-semibold'>
					<span className='text-sm text-foreground font-normal'>Từ có nghĩa là:</span>{' '}
					{getPrimaryMeaning()?.meaning}
				</div>
			</Activity>
			<Activity mode={practiceMode === 'listen' ? 'visible' : 'hidden'}>
				<div className='flex justify-center items-center gap-4'>
					<Button
						size='icon-lg'
						variant='secondary'
						onClick={() => speak('en_US')}>
						<Volume2Icon className='size-7 text-foreground' />
					</Button>
				</div>
			</Activity>
			<Activity mode={practiceMode === 'collocation' ? 'visible' : 'hidden'}>
				<div className='flex justify-center items-center gap-4'>
					{current.collocations && current.collocations.length > 0 ? (
						<span className='text-lg font-semibold'>
							{current.collocations[0].phrase.replace(
								current.word,
								'_'.repeat(current.word.length),
							)}
						</span>
					) : null}
				</div>
			</Activity>
			<br />
			{/* ============================================== */}
			{/* Answer Area */}
			<Activity mode={answerMode === 'type_full' ? 'visible' : 'hidden'}>
				<OTPField.Root
					onValueComplete={(value: string) => {
						checkAnswer(value);
					}}
					length={current.word.replaceAll(' ', '').length}
					validationType='alphanumeric'
					aria-describedby={getPrimaryMeaning()?.meaning}
					className='flex w-full gap-2 justify-center mt-4'>
					{current.word.split(/(\s+)/).map((group, gIndex) => {
						if (group === ' ') {
							return (
								<div
									className='w-5'
									key={`space-${gIndex}-${index}`}
								/>
							);
						}
						return Array.from({ length: group.length }, (_, index) => (
							<OTPField.Input
								key={`${gIndex}-${index}`}
								className='w-10 rounded input-wrapper p-3'
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
			<Activity mode={answerMode === 'type_partial' ? 'visible' : 'hidden'}>
				<OTPField.Root
					onValueComplete={(value: string) => {
						checkAnswer(value);
					}}
					length={current.word.replaceAll(' ', '').length}
					validationType='alphanumeric'
					aria-describedby={getPrimaryMeaning()?.meaning}
					className='flex w-full gap-2 justify-center mt-4'>
					{current.word.split(/(\s+)/).map((group, gIndex) => {
						// Xử lý khoảng trắng
						if (group.trim() === '') {
							return (
								<div
									key={`space-${gIndex}`}
									className='w-5'
								/>
							);
						}
						// Xử lý từng chữ cái trong từ
						return Array.from({ length: group.length }, (_, index) => {
							const isHint = index === 0 || index === group.length - 1;
							if (isHint) {
								return (
									<span
										className='inline-flex items-center font-semibold'
										key={`${gIndex}-${index}`}>
										{group[index]}
									</span>
								);
							}
							return (
								<OTPField.Input
									key={`${gIndex}-${index}`}
									className='w-10 rounded input-wrapper p-3'
									aria-label={
										index === 0
											? undefined
											: `Character ${index + 1} of ${current.word.replaceAll(' ', '').length}`
									}
								/>
							);
						});
					})}
				</OTPField.Root>
			</Activity>
			<Activity mode={answerMode === 'speak' ? 'visible' : 'hidden'}>
				<Suspense fallback={<div>Loading speech recognition...</div>}>
					{isSupported ? (
						<div className='flex justify-center items-center gap-4'>
							<Button
								size='icon-lg'
								variant={isRecording ? 'destructive' : 'secondary'}
								disabled={isRecording}
								onClick={startListening}>
								{isRecording ? (
									<AudioLinesIcon className='animate-pulse size-7' />
								) : (
									<MicIcon className='size-7 text-foreground' />
								)}
							</Button>
						</div>
					) : (
						<div className='text-center text-muted-foreground'>
							Your browser does not support speech recognition.
						</div>
					)}
					<br />
					{error && <p className='text-red-500 text-sm text-center'>Lỗi mic: {error}</p>}
					{transcript && (
						<div className='text-center'>
							<p className='text-gray-600'>
								Bạn đọc:{' '}
								<span className='font-semibold text-black'>{transcript}</span>
							</p>
						</div>
					)}
				</Suspense>
			</Activity>
			<Activity mode={answerMode === 'choice' ? 'visible' : 'hidden'}>
				<div className='flex justify-center'>
					<RadioGroup
						aria-labelledby={`question-${index}`}
						className='flex flex-col items-start gap-1 text-neutral-950'
						onValueChange={(value: string) => checkAnswer(value)}>
						<span>Lựa chọn đáp án đúng:</span>

						{questionChoiceList.map((choice, cIndex) => (
							<label
								className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'
								key={`choice-${cIndex}`}>
								<Radio.Root
									value={choice}
									className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
									<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
								</Radio.Root>
								{choice}
							</label>
						))}
					</RadioGroup>
				</div>
			</Activity>
			{/* =============================================================== */}
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
						style={{ left: `${Math.round((progress / words.length) * 100)}%` }}
					/>
				</div>
				<DoorClosedIcon
					className='size-8 text-muted-foreground'
					strokeWidth='0.75'
				/>
			</div>
			{/* ======================================================================= */}
			{/* Modal Settings */}
			<Modal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Settings'
				description='Tùy chinh chế độ luyện tập'
				className='w-2xl'
				closeOnOutsideClick={false}>
				<div className='p-8'>
					<RadioGroup
						value={practiceMode}
						aria-labelledby={`question-${index}`}
						className='flex flex-col items-start gap-1 text-neutral-950'
						onValueChange={(v) => setPracticeMode(v)}>
						<span className='font-medium'>Cách ra câu hỏi</span>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'meaning'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Trả lời dựa trên nghĩa của từ
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'listen'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Nghe và trả lời
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'collocation'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Chọn cụm từ phù hợp
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'mix'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Tất cả các cách trên
						</label>
					</RadioGroup>
					<br />
					<RadioGroup
						aria-labelledby={`question-${index}`}
						value={answerMode}
						className='flex flex-col items-start gap-1 text-neutral-950'
						onValueChange={(v) => setAnswerMode(v)}>
						<span className='font-meidum'>Cách mà bạn sẽ trả lời</span>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'type_full'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Điền đẩy đủ từ
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'type_partial'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Điền từ có gợi ý
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'speak'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Thu âm
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'choice'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Chọn đáp án đúng
						</label>
						<label className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'>
							<Radio.Root
								value={'mix'}
								className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
								<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
							</Radio.Root>
							Tất cả các cách trên
						</label>
					</RadioGroup>
				</div>
			</Modal>
		</div>
	);
}
