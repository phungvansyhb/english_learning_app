'use client';

import Ttip from '@/components/ui/ttip';
import { useAuthStore } from '@/utils/zustand/auth-store';
import { FlameIcon, Loader2Icon } from 'lucide-react';
import React from 'react';

type Props = {};

export default function Streak({}: Props) {
	const { user, isLoading } = useAuthStore();
	return (
		<Ttip
			triggerComponent={
				<div className='flex justify-center items-center gap-2 bg-brand-orange/85 hover:bg-brand-orange p-3 rounded-xl text-foreground transition-colors'>
					<FlameIcon className='size-5 shrink-0' />
					<span className='font-bold'>
						{isLoading ? (
							<Loader2Icon className='size-4 animate-spin' />
						) : (
							user?.user_progress_stats?.current_streak_days
						)}
					</span>
				</div>
			}>
			Streak
		</Ttip>
	);
}
