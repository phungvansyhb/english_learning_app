'use client';
import useIsMobile from '@/hooks/use-is-mobile';
import { Activity } from 'react';

type Props = {};
const Noties = [
	{
		userName: 'PhungSy266',
		userId: 1,
		description: 'vừa hoàn thành bài test TOEIC part 5',
	},
];
export default function NoticeThumb({}: Props) {
	const isMobile = useIsMobile();
	return (
		<Activity mode={isMobile ? 'hidden' : 'visible'}>
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
		</Activity>
	);
}
