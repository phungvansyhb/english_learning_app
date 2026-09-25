'use client';

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = { text?: string };
const SEEK_SECONDS = 5;
const CHARACTERS_PER_SECOND = 14;
const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];

export default function ListeningPlayer({ text }: Props) {
	const [playing, setPlaying] = useState(false);
	const [rate, setRate] = useState(1);
	const positionRef = useRef(0);
	const runIdRef = useRef(0);
	const waveBars = [18, 30, 42, 24, 36, 50, 28, 40, 22, 34, 46, 26, 38, 20, 32];

	useEffect(() => {
		positionRef.current = 0;
		setPlaying(false);
		window.speechSynthesis.cancel();
	}, [text]);

	useEffect(() => () => window.speechSynthesis.cancel(), []);

	const stopSpeaking = () => {
		runIdRef.current += 1;
		window.speechSynthesis.cancel();
		setPlaying(false);
		positionRef.current = 0;
	};

	const speakFrom = (startIndex: number, playbackRate = rate) => {
		if (!text || !('speechSynthesis' in window)) return;

		const safeStartIndex = Math.max(0, startIndex);
		const runId = runIdRef.current + 1;
		runIdRef.current = runId;
		const utterance = new SpeechSynthesisUtterance(text.slice(safeStartIndex));
		utterance.lang = 'en-US';
		utterance.rate = playbackRate;
		utterance.volume = 1;
		utterance.onstart = () => {
			if (runId === runIdRef.current) positionRef.current = safeStartIndex;
		};
		utterance.onboundary = (event) => {
			if (runId === runIdRef.current) positionRef.current = safeStartIndex + event.charIndex;
		};
		utterance.onend = () => {
			if (runId !== runIdRef.current) return;
			positionRef.current = text.length;
			setPlaying(false);
		};
		utterance.onerror = () => {
			if (runId === runIdRef.current) setPlaying(false);
		};

		const startSpeaking = () => {
			if (runId !== runIdRef.current) return;
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(utterance);
			setPlaying(true);
		};

		if (safeStartIndex === 0) {
			window.setTimeout(() => startSpeaking(), 80);
			return;
		}

		startSpeaking();
	};

	const togglePlay = () => {
		if (playing) {
			stopSpeaking();
			return;
		}

		speakFrom(positionRef.current >= (text?.length ?? 0) ? 0 : positionRef.current);
	};

	const seek = (seconds: number) => {
		if (!text) return;
		const characterOffset = Math.round(seconds * CHARACTERS_PER_SECOND * rate);
		const nextPosition = Math.max(
			0,
			Math.min(text.length, positionRef.current + characterOffset),
		);
		positionRef.current = nextPosition;
		if (playing) speakFrom(nextPosition);
	};

	const changeRate = (nextRate: number) => {
		setRate(nextRate);
		if (playing) speakFrom(positionRef.current, nextRate);
	};

	return (
		<section className='w-full rounded-2xl bg-secondary/70 p-6'>
			<p
				className='text-sm font-semibold'
				aria-live='polite'>
				{playing ? 'Đang đọc câu hỏi' : 'Sẵn sàng nghe câu hỏi'}
			</p>
			<div
				className='mt-5 flex h-24 items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-5'
				role='img'
				aria-label={playing ? 'Đang phát âm thanh câu hỏi' : 'Sóng âm thanh câu hỏi'}>
				{waveBars.map((height, index) => (
					<span
						key={`${height}-${index}`}
						style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }}
						className={`w-1.5 rounded-full bg-primary/70 transition-all ${playing ? 'animate-listening-wave' : ''}`}
					/>
				))}
			</div>
			<div className='mt-5 flex items-center gap-2'>
				<button
					type='button'
					onClick={() => seek(-SEEK_SECONDS)}
					disabled={!text}
					aria-label='Tua lại 5 giây'
					className='rounded-lg border p-2.5 text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50'>
					<SkipBack className='size-4' />
				</button>
				<button
					type='button'
					onClick={togglePlay}
					disabled={!text}
					aria-label={playing ? 'Tạm dừng đọc' : 'Đọc câu hỏi'}
					className='flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
					{playing ? <Pause className='size-5' /> : <Play className='ml-0.5 size-5' />}
				</button>
				<button
					type='button'
					onClick={() => seek(SEEK_SECONDS)}
					disabled={!text}
					aria-label='Tua tới 5 giây'
					className='rounded-lg border p-2.5 text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50'>
					<SkipForward className='size-4' />
				</button>
				<label className='ml-auto flex items-center gap-2 text-sm text-muted-foreground'>
					<span>Tốc độ</span>
					<select
						value={rate}
						onChange={(event) => changeRate(Number(event.target.value))}
						aria-label='Tốc độ đọc'
						className='rounded-lg border bg-card px-2 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/40'>
						{PLAYBACK_RATES.map((option) => (
							<option
								key={option}
								value={option}>
								{option}x
							</option>
						))}
					</select>
				</label>
			</div>
		</section>
	);
}
