import { AlarmClockIcon, Bell, FlameIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Ttip from '../ui/ttip';
import NoticeThumb from './notice-thumb';
import { DemoBtn } from '../ui/stickman-talk';

export function DashboardHeader() {
	return (
		<header className='flex items-center gap-2 md:gap-4 py-4 md:py-0 px-4 md:px-0'>
			<NoticeThumb />
			<DemoBtn />
			<Ttip
				triggerComponent={
					<div className='flex justify-center items-center gap-2 bg-secondary hover:bg-accent p-3 rounded-xl text-foreground transition-colors'>
						<AlarmClockIcon className='size-5 shrink-0' />
						<span className='font-bold'>3h20m</span>
					</div>
				}>
				Online time
			</Ttip>
			<div className='ml-auto flex items-center gap-2 md:gap-4'>
				<Ttip
					triggerComponent={
						<div className='flex justify-center items-center gap-2 bg-brand-orange/85 hover:bg-brand-orange p-3 rounded-xl text-foreground transition-colors'>
							<FlameIcon className='size-5 shrink-0' />
							<span className='font-bold'>7</span>
						</div>
					}>
					Streak
				</Ttip>
				<button
					type='button'
					aria-label='Notifications'
					className='flex justify-center items-center bg-secondary hover:bg-accent rounded-full size-11 text-foreground transition-colors'>
					<Bell className='size-5' />
				</button>
				<Link
					href='/profile'
					aria-label='Open profile'
					className='rounded-full ring-2 ring-brand-orange overflow-hidden transition-transform hover:scale-105'>
					<Image
						src='/avatars/user.png'
						alt='Your profile'
						width={44}
						height={44}
						className='size-11 object-cover'
					/>
				</Link>
			</div>
		</header>
	);
}
