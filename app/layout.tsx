import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PwaRegister from '@/components/pwa-register';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-jakarta',
});

export const metadata: Metadata = {
	metadataBase: process.env.NEXT_PUBLIC_SITE_URL
		? new URL(process.env.NEXT_PUBLIC_SITE_URL)
		: undefined,
	title: {
		default: 'Lingua - Học tiếng Anh mỗi ngày',
		template: '%s | Lingua',
	},
	description: 'Nền tảng học tiếng Anh giúp bạn luyện từ vựng, ngữ pháp và bốn kỹ năng mỗi ngày.',
	keywords: ['học tiếng Anh', 'luyện tiếng Anh', 'từ vựng tiếng Anh', 'ngữ pháp tiếng Anh'],
	applicationName: 'Lingua',
	creator: 'Lingua',
	manifest: '/manifest.webmanifest',
	icons: {
		icon: '/icon.png',
		apple: '/apple-icon.png',
	},
	openGraph: {
		type: 'website',
		locale: 'vi_VN',
		siteName: 'Lingua',
		title: 'Lingua - Học tiếng Anh mỗi ngày',
		description:
			'Nền tảng học tiếng Anh giúp bạn luyện từ vựng, ngữ pháp và bốn kỹ năng mỗi ngày.',
		images: [{ url: '/icon.png', width: 512, height: 512, alt: 'Lingua' }],
	},
	twitter: {
		card: 'summary',
		title: 'Lingua - Học tiếng Anh mỗi ngày',
		description:
			'Nền tảng học tiếng Anh giúp bạn luyện từ vựng, ngữ pháp và bốn kỹ năng mỗi ngày.',
		images: ['/icon.png'],
	},
};

export const viewport: Viewport = {
	colorScheme: 'light dark',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f7f5fb' },
		{ media: '(prefers-color-scheme: dark)', color: '#25202f' },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='vi'
			className={`${jakarta.variable}`}>
			<body className='font-sans antialiased'>
				{children}
					<PwaRegister />
				{process.env.NODE_ENV === 'production' && <Analytics />}
				{process.env.NODE_ENV === 'production' && <SpeedInsights />}
			</body>
		</html>
	);
}
