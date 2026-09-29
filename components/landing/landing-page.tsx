'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
	ArrowDown,
	ArrowUpRight,
	BookOpen,
	Brain,
	Flame,
	Mail,
	Sparkles,
	Trophy,
	Volume2,
} from 'lucide-react';

const features = [
	{
		number: '01',
		title: 'Học vừa đủ',
		text: 'Bài học ngắn, rõ ràng để bạn duy trì nhịp học mỗi ngày.',
		color: 'bg-brand-pink',
		icon: BookOpen,
	},
	{
		number: '02',
		title: 'Luyện đúng điểm yếu',
		text: 'Tập trung vào từ vựng, ngữ pháp và kỹ năng bạn cần nhất.',
		color: 'bg-brand-orange',
		icon: Brain,
	},
	{
		number: '03',
		title: 'Thấy mình tiến bộ',
		text: 'Theo dõi hành trình và biến mỗi phiên học thành động lực mới.',
		color: 'bg-brand-mint',
		icon: Trophy,
	},
];

const screens = [
	{
		image: '/images/landing-hero-image-1.png',
		label: '01 / Grammar library',
		title: 'Nắm chắc nền tảng',
		text: 'Khám phá danh sách chủ đề ngữ pháp được sắp xếp rõ ràng, dễ tìm và vừa sức với trình độ của bạn.',
	},
	{
		image: '/images/landing-hero-image-2.png',
		label: '02 / Vocabulary',
		title: 'Từ mới ở lại lâu hơn',
		text: 'Mở rộng vốn từ theo chủ đề, nghe phát âm và ôn tập đúng lúc để nhớ tự nhiên hơn mỗi ngày.',
	},
	{
		image: '/images/landing-hero-image-3.png',
		label: '03 / Leaderboard',
		title: 'Học cùng một cộng đồng',
		text: 'Theo dõi bảng xếp hạng, giữ streak và biến từng bước tiến nhỏ thành động lực lớn.',
	},
];

const reveal = { hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0 } };
const spring = { type: 'spring' as const, stiffness: 90, damping: 20 };

export function LandingPage() {
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll();
	const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);

	return (
		<main className='min-h-screen overflow-hidden bg-background text-foreground'>
			<section className='relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16'>
				<div
					aria-hidden='true'
					className='pointer-events-none absolute -left-24 top-44 h-72 w-72 rounded-full bg-brand-pink/20 blur-3xl animate-landing-drift'
				/>
				<div
					aria-hidden='true'
					className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl animate-landing-drift [animation-delay:1.4s]'
				/>
				<header className='relative z-10 flex items-center justify-between'>
					<Link
						href='/'
						className='text-xl font-extrabold tracking-[-0.06em]'>
						Lingua<span className='text-brand-pink'>.</span>
					</Link>
					<nav className='hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex'>
						<a
							href='#story'
							className='transition-colors hover:text-foreground'>
							Hành trình
						</a>
						<a
							href='#features'
							className='transition-colors hover:text-foreground'>
							Tính năng
						</a>
						<a
							href='#contact'
							className='transition-colors hover:text-foreground'>
							Liên hệ
						</a>
					</nav>
					<Link
						href='/login'
						className='rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5'>
						Đăng nhập
					</Link>
				</header>

				<div className='relative grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1fr_0.85fr] lg:py-16'>
					<motion.div
						initial='hidden'
						animate='visible'
						variants={reveal}
						transition={{ ...spring, delay: 0.12 }}>
						<p className='mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-sm'>
							<Sparkles className='h-3.5 w-3.5 text-brand-orange' /> English, but make
							it yours
						</p>
						<h1 className='max-w-3xl text-6xl font-extrabold  tracking-[-0.08em] sm:text-8xl'>
							Mỗi ngày một bước <span className='text-brand-pink'>gần hơn</span> với
							tiếng Anh.
						</h1>
						<p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>
							Một không gian học tập nhẹ nhàng, thông minh và đủ thú vị để bạn muốn
							quay lại mỗi ngày.
						</p>
						<div className='mt-10 flex flex-wrap items-center gap-4'>
							<Link
								href='/signup'
								className='rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-1'>
								Bắt đầu miễn phí <ArrowUpRight className='ml-1 inline h-4 w-4' />
							</Link>
							<a
								href='#story'
								className='rounded-full border border-foreground/15 px-7 py-4 text-sm font-bold transition-colors hover:bg-card'>
								Khám phá thêm
							</a>
						</div>
					</motion.div>
					{/* carousel here */}

				</div>
			</section>

			<footer className='mx-auto flex max-w-7xl flex-col gap-4 border-t border-foreground/10 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16'>
				<span className='font-extrabold text-foreground'>
					Lingua<span className='text-brand-pink'>.</span>
				</span>
				<span>Học một chút. Tốt hơn mỗi ngày.</span>
			</footer>
		</main>
	);
}

export default LandingPage;
