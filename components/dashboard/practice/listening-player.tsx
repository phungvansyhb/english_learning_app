'use client';

import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = { text?: string };

export default function ListeningPlayer({ text }: Props) {
	const [playing, setPlaying] = useState(false);

	useEffect(() => () => window.speechSynthesis.cancel(), []);

	const stopSpeaking = () => {
		window.speechSynthesis.cancel();
		setPlaying(false);
	};

	const togglePlay = () => {
		if (!text || !('speechSynthesis' in window)) return;
		if (playing) {
			stopSpeaking();
			return;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'en-US';
		utterance.onend = () => setPlaying(false);
		utterance.onerror = () => setPlaying(false);
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
		setPlaying(true);
	};

	return (
		<section className='w-full rounded-2xl bg-secondary/70 p-6'>
			<p className='text-sm font-semibold'>
				{playing ? 'Đang đọc câu hỏi' : 'Sẵn sàng nghe câu hỏi'}
			</p>
			<p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
				{text || 'No question available.'}
			</p>
			<div className='mt-5 flex items-center gap-2'>
				<button
					type='button'
					onClick={stopSpeaking}
					aria-label='Dừng đọc câu hỏi'
					className='rounded-lg border p-2.5 text-sm hover:bg-secondary'>
					<RotateCcw className='size-4' />
				</button>
				<button
					type='button'
					onClick={togglePlay}
					disabled={!text}
					aria-label={playing ? 'Tạm dừng đọc' : 'Đọc câu hỏi'}
					className='flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
					{playing ? <Pause className='size-5' /> : <Play className='ml-0.5 size-5' />}
				</button>
			</div>
		</section>
	);
}
