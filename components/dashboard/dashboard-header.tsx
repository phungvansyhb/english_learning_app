import Image from 'next/image';
import { AlarmClockIcon, Bell, FlameIcon, Search, ShoppingBag } from 'lucide-react';
import Ttip from '../ui/ttip';

const Noties = [
	{
		userName: 'PhungSy266',
		userId: 1,
		description: 'vừa hoàn thành bài test TOEIC part 5',
	},
	{
		userName: 'MaiTrang08_01',
		userId: 2,
		description: 'vừa hoàn thành bài test TOEIC part 1',
	},
];

export function DashboardHeader() {
	return (
		<header className='flex items-center gap-4'>
			<div className='relative flex-1'>
				{Noties.map((noti) => (
					<div
						className='slide-in-from-top-8 animate-in fade-in repeat-infitie'
						key={noti.userId}>
						<span className='text-muted-foreground text-sm'>
							<b>{noti.userName} </b> {noti.description} 🎉
						</span>
					</div>
				))}
			</div>
			<Ttip
				triggerComponent={
					<div className='flex justify-center items-center gap-2 bg-secondary hover:bg-accent p-3 rounded-xl text-foreground transition-colors'>
						<AlarmClockIcon className='size-5 shrink-0' />
						<span className='font-bold'>3h20m</span>
					</div>
				}>
				Online time
			</Ttip>
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
			<button
				type='button'
				aria-label='Open profile'
				className='rounded-full ring-2 ring-brand-orange overflow-hidden'>
				<Image
					src='/avatars/user.png'
					alt='Your profile'
					width={44}
					height={44}
					className='size-11 object-cover'
				/>
			</button>
		</header>
	);
}
