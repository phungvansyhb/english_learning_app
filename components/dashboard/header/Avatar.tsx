'use client';
import { useAuthStore } from '@/utils/zustand/auth-store';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';

type Props = {
	isBig?: boolean;
};

export default function Avatar({ isBig }: Props) {
	const { user, isLoading } = useAuthStore();
	if (isLoading)
		return (
			<div className='w-[44px] h-[44px] flex justify-center items-center'>
				<Loader2Icon className='size-4 animate-spin' />
			</div>
		);
	return (
		<Image
			src={user?.avatar_url || '/avatars/user.png'}
			alt='Your profile'
			width={isBig ? 120 : 44}
			height={isBig ? 120 : 44}
			className='object-cover'
		/>
	);
}
