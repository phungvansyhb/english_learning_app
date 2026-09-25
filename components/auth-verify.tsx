'use client';
import Loading from '@/app/loading';
import { saveActivity } from '@/services/auth';
import { useAuthStore } from '@/utils/zustand/auth-store';
import { useEffect } from 'react';

type Props = {};

export default function AuthVerify({}: Props) {
	const { user, getCurrentUser, isLoading } = useAuthStore();

	useEffect(() => {
		if (!user) {
			void getCurrentUser();
			return;
		}
		const isActiveToday = document.cookie
			.split('; ')
			.some((cookie) => cookie.startsWith('today_checkin='));

		if (!isActiveToday) {
			const now = new Date();
			const nextMidnight = new Date(now);
			nextMidnight.setHours(24, 0, 0, 0);
			const secondsUntilMidnight = Math.ceil((nextMidnight.getTime() - now.getTime()) / 1000);

			document.cookie = `today_checkin=true; max-age=${secondsUntilMidnight}; path=/; SameSite=Lax`;
			void saveActivity();
		}
	}, [user, getCurrentUser]);
	if (isLoading)
		return (
			<div className='top-0 left-0 w-screen h-screen fixed bg-white z-60 flex items-end justify-center '>
				<div
					role='dialog'
					aria-modal='true'
					className='relative z-100 overflow-hidden w-full h-full'>
					<Loading />
				</div>
			</div>
		);
	return <></>;
}
