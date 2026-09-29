import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: {
		default: 'Tài khoản',
		template: '%s | Lingua',
	},
	description: 'Đăng nhập hoặc tạo tài khoản Lingua để bắt đầu học tiếng Anh.',
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return children;
}
