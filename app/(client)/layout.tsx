import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='p-4 md:p-6 lg:p-8 h-screen'>
			<div className='flex bg-card mx-auto md:border rounded md:rounded-[2rem] max-w-7xl h-full overflow-hidden'>
				<DashboardSidebar />
				<div className='flex-1 bg-secondary/40 md:p-6 lg:p-8 pb-24 md:pb-6 overflow-auto'>
					<DashboardHeader />
					{children}
				</div>
			</div>
		</main>
	);
}
