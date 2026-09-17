'use client';
import { saveActivity } from '@/services/auth';
import { useAuthStore } from '@/utils/zustand/auth-store';
import React, { useEffect } from 'react';

type Props = {};

export default function AuthVerify({}: Props) {
	const { user, getCurrentUser } = useAuthStore();

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
			const secondsUntilMidnight = Math.ceil(
				(nextMidnight.getTime() - now.getTime()) / 1000,
			);

			document.cookie = `today_checkin=true; max-age=${secondsUntilMidnight}; path=/; SameSite=Lax`;
			void saveActivity();
		}
	}, [user, getCurrentUser]);

	return <></>;
}
