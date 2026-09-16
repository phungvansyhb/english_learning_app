'use client';
import { useAuthStore } from '@/utils/zustand/auth-store';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';

type Props = {};

export default function Avatar({}: Props) {
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
			width={44}
			height={44}
			className='size-11 object-cover'
		/>
	);
}
