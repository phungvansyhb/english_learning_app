'use client';

import Image from 'next/image';
import React from 'react';
import { Button } from './button';
import { useMessageStore } from '@/utils/zustand/message-store';

export default function StickmanTalk() {
	const [mounted, setMounted] = React.useState(false);
	const { isOpen, message, close } = useMessageStore();
	React.useEffect(() => {
		if (!isOpen) {
			setMounted(false);
			return;
		}

		const frame = requestAnimationFrame(() => setMounted(true));
		return () => cancelAnimationFrame(frame);
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className='absolute z-0 h-30 w-30'
			style={{
				bottom: 60,
				right: -60,
			}}>
			<div className='relative'>
				<Image
					src='/illustrations/sticky-man-2.gif'
					alt='Animation'
					width='120'
					height='120'
					className='-rotate-45 transition-all duration-400 ease-out'
				/>
				<div
					className={[
						'absolute flex items-center justify-center border bg-white p-8 rounded-full text-pretty transition-all duration-400 ease-out',
						mounted
							? 'translate-x-0 scale-100 opacity-100'
							: 'translate-x-10 scale-75 opacity-0',
					].join(' ')}
					style={{
						bottom: 15,
						right: 110,
						width: 200,
						height: 160,
					}}>
					<Button
						type='button'
						size='icon-xs'
						variant='secondary'
						aria-label='Close message'
						onClick={close}
						className='absolute left-3 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-sm  transition hover:bg-slate-100 hover:text-slate-700'>
						×
					</Button>
					<span className='relative z-10 flex h-full w-full items-center justify-center pr-5 text-center text-sm leading-5 text-slate-700'>
						{message}
					</span>
					<div
						className='absolute h-5 w-5 rotate-45 border-r border-t bg-white z-0'
						style={{
							right: -10,
							bottom: 65,
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export function DemoBtn() {
	const { open } = useMessageStore();
	return <Button onClick={open}> open</Button>;
}
