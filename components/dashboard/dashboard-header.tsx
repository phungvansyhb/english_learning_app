import { Bell } from 'lucide-react';
import Link from 'next/link';
import Avatar from './header/Avatar';
import Streak from './header/Streak';
import NoticeThumb from './notice-thumb';

export function DashboardHeader() {
	return (
		<header className='flex items-center gap-2 md:gap-4'>
			<NoticeThumb />

			<div className='ml-auto flex items-center gap-2 md:gap-4'>
				<Streak />
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
					<Avatar />
				</Link>
			</div>
		</header>
	);
}
