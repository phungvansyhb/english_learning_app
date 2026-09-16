import AuthVerify from '@/components/auth-verify';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { TextSelectionDictionary } from '@/components/dashboard/dictionary/text-selection-dictionary';
import StickmanTalk from '@/components/ui/stickman-talk';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='p-0 md:p-6 lg:p-8 h-screen'>
			<div className='flex bg-card mx-auto md:border rounded md:rounded-[2rem] max-w-7xl h-full overflow-hidden relative'>
				<DashboardSidebar />
				<div className='flex-1 bg-secondary/40 p-4 md:p-6 lg:p-8 pb-24 md:pb-6 overflow-auto '>
					<DashboardHeader />
					<br />
					<TextSelectionDictionary>{children}</TextSelectionDictionary>
				</div>
				<StickmanTalk />
				<AuthVerify />
			</div>
		</main>
	);
}
