'use client';
import { useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuthStore } from '@/utils/zustand/auth-store';
import { useShallow } from 'zustand/shallow';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, getCurrentUser } = useAuthStore(
		useShallow((state) => ({
			user: state.user,
			getCurrentUser: state.getCurrentUser,
		})),
	);

	useEffect(() => {
		if (!user) {
			void getCurrentUser('/admin/login');
		}
	}, []);

	if (!user) return <></>;
	return (
		<main className='p-4 md:p-6 lg:p-8 h-screen'>
			<div className='flex bg-card mx-auto border rounded-[2rem] max-w-7xl h-full overflow-hidden'>
				<AdminSidebar />
				<div className='flex-1 bg-secondary/40 p-5 md:p-6 lg:p-8 pb-24 md:pb-6 overflow-y-auto'>
					<AdminHeader />
					<div className='mt-6 '>{children}</div>
				</div>
			</div>
		</main>
	);
}
