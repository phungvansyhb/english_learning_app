'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useSpeech } from '@/hooks/use-speech';
import { WordCard } from '@/lib/types';
import { useMessageStore } from '@/utils/zustand/message-store';
import { OTPField, Radio, RadioGroup } from '@base-ui/react';
import clsx from 'clsx';
import { AudioLinesIcon, DoorClosedIcon, MicIcon, SettingsIcon, Volume2Icon } from 'lucide-react';
import Image from 'next/image';
import { Activity, Suspense, useEffect, useMemo, useState, useTransition } from 'react';
import TryMode from './try-mode';

type Props = {
	words: WordCard[];
};

export default function PlayMode({ words }: Props) {
	const [isPending, startTransition] = useTransition();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [isWrong, setIsWrong] = useState(false);
	const [isStickmanWalking, setIsStickmanWalking] = useState(true);

	const [isFinish, setIsFinish] = useState(false);

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

	const [streak, setStreak] = useState<boolean[]>([]);

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
			setIndex((value) => value + 1);
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
				setIsWrong(false);
				setIsStickmanWalking(true);
				setProgress(progress + 1);
				setStreak([...streak, true]);
				if (index + 1 < words.length) {
					next();
				} else {
					setIsFinish(true);
				}
			} else {
				setIsWrong(true);
				setIsStickmanWalking(false);
				setProgress(progress - 1);
				setStreak([...streak, false]);
				window.setTimeout(() => setIsWrong(false), 420);
			}
		});
	};
	const { setMessage, open } = useMessageStore();
	useEffect(() => {
		const cnt = streak.length;

		if (cnt > 3 && streak.slice(cnt - 3, cnt).every((item) => item)) {
			setMessage('Khá lắm nhóc !!!');
			open();
		}
		if (cnt > 5 && streak.slice(cnt - 5, cnt).every((item) => item)) {
			setMessage('Ái chà làm đúng liên tục 5 câu cơ đấy !!!');
			open();
		}
		if (progress <= -3) {
			setMessage('Ôi mày làm tao buồn quá, sao bảo thông minh lắm mà');
			open();
		}
		if (progress >= words.length / 2) {
			setMessage('Cố lên, cố lên !!!');
			open();
		}
		if (progress >= (2 * words.length) / 3) {
			setMessage('Sắp tới rồi, sắp tới rồi !!!');
			open();
		}
		if (isFinish) {
			if (progress < words.length) {
				setMessage('Chưa tày đâu nha mày, Hãy xem kỹ lại một lượt !!!');
			}
			setMessage(
				'Xin chúc mừng, cùng nhìn lại các từ vựng thuộc chủ đề này 1 lần nữa nhé !!!',
			);
			open();
		}
	}, [progress, streak, index, isFinish]);

	return (
		<div>
			<Activity mode={isFinish ? 'visible' : 'hidden'}>
				<div>
					<TryMode words={words} />
				</div>
			</Activity>
			<Activity mode={isFinish ? 'hidden' : 'visible'}>
				<div
					data-name='setting'
					className='flex justify-between items-center w-full'>
					<span>
						<b>{index + 1}</b>/{words.length}
					</span>
					<Button
						size='icon-lg'
						variant='ghost'
						onClick={() => setIsModalOpen(true)}>
						<SettingsIcon className='size-6' />
					</Button>
				</div>
				<div
					style={
						isWrong
							? { animation: 'shake 0.4s ease-in-out 2', transformOrigin: 'center' }
							: undefined
					}>
					{/* Question Area */}
					<Activity mode={practiceMode === 'meaning' ? 'visible' : 'hidden'}>
						<div className='text-center text-2xl font-semibold'>
							<span className='text-sm text-foreground font-normal'>
								Từ có nghĩa là:
							</span>{' '}
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
								<span className='text-lg font-semibold font-mono'>
									{current.collocations[
										Math.floor(Math.random() * current.collocations.length)
									].phrase.replace(new RegExp(current.word, 'gi'), '___________')}
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
							{error && (
								<p className='text-red-500 text-sm text-center'>Lỗi mic: {error}</p>
							)}
							{transcript && (
								<div className='text-center'>
									<p className='text-gray-600'>
										Bạn đọc:{' '}
										<span className='font-semibold text-black'>
											{transcript}
										</span>
									</p>
								</div>
							)}
						</Suspense>
					</Activity>
					<Activity mode={answerMode === 'choice' ? 'visible' : 'hidden'}>
						<div className='flex justify-center'>
							<RadioGroup
								key={current.id}
								aria-labelledby={`question-${index}`}
								className='flex flex-col items-start gap-3 text-neutral-950'
								onValueChange={(value: string) => checkAnswer(value)}>
								<span>Lựa chọn đáp án đúng:</span>

								{questionChoiceList.map((choice, cIndex) => (
									<label
										className='flex items-center gap-2 text-sm font-normal text-neutral-950 dark:text-white'
										key={`choice-${cIndex}`}>
										<Radio.Root
											value={choice}
											key={`choice-${cIndex}`}
											className='flex size-4 shrink-0 items-center justify-center border rounded-full p-0 border-neutral-950 bg-white text-white data-checked:bg-neutral-950 data-checked:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 '>
											<Radio.Indicator className='flex items-center justify-center data-unchecked:hidden before:size-2 before:rounded-full before:bg-current' />
										</Radio.Root>
										{choice}
									</label>
								))}
							</RadioGroup>
						</div>
					</Activity>
				</div>
				{/* =============================================================== */}
				{/* Animation */}
				<div className='flex mt-30 items-end w-1/2  mx-auto'>
					<div className='border-b h-1 w-full relative'>
						<Image
							src={'/illustrations/sticky-man-2.gif'}
							alt='Animation'
							width='100'
							height='100'
							className={clsx(
								isStickmanWalking ? 'rotate-y-180' : 'rotate-y-0',
								'animate-all duration-500 ease-out object-fill absolute bottom-0',
							)}
							style={{
								left: `${Math.round((progress / words.length) * 100)}%`,
							}}
						/>
					</div>
					<DoorClosedIcon
						className='size-14 text-muted-foreground'
						strokeWidth='0.75'
					/>
				</div>
			</Activity>

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
