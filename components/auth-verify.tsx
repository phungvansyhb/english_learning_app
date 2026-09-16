'use client';
import { useAuthStore } from '@/utils/zustand/auth-store';
import React, { useEffect } from 'react';

type Props = {};

export default function AuthVerify({}: Props) {
	const { user, getCurrentUser } = useAuthStore();
	useEffect(() => {
		if (!user) {
			getCurrentUser();
		}
		console.log(user);
	}, [user]);

	return <></>;
}
