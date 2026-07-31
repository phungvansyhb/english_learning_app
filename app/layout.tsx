import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-jakarta',
});

export const metadata: Metadata = {
	title: 'Lingua — English Learning Dashboard',
	description:
		'Track your progress, discover new courses and grow your English skills with Lingua.',
	generator: 'v0.app',
};

export const viewport: Viewport = {
	colorScheme: 'light dark',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className={`${jakarta.variable}`}>
			<body className='font-sans antialiased'>
				{children}
				{process.env.NODE_ENV === 'production' && <Analytics />}
			</body>
		</html>
	);
}
