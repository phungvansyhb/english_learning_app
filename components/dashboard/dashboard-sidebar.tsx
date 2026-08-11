'use client';

import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import {
	BookMarkedIcon,
	BookOpen,
	ChevronLeft,
	FileHeadphoneIcon,
	LayoutGrid,
	LogOut,
	MedalIcon,
	MicVocalIcon,
	PenToolIcon,
	Settings,
	WholeWordIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';
import { signOut } from '@/services/auth';

interface NavItem {
	id: string;
	label: string;
	icon: typeof LayoutGrid;
	hasDot?: boolean;
	link: string;
}

const navItems: NavItem[] = [
	{ id: 'vocabulary', label: 'Vocabulary', icon: WholeWordIcon, link: '/vocabulary' },
	{ id: 'listening', label: 'Listening', icon: FileHeadphoneIcon, link: '#' },
	{ id: 'speaking', label: 'Speaking', icon: MicVocalIcon, link: '#' },
	{ id: 'reading', label: 'Reading', icon: BookOpen, link: '#' },
	{ id: 'writing', label: 'Writing', icon: PenToolIcon, link: '#' },
	{ id: 'test', label: 'Test', icon: BookMarkedIcon, link: '#' },
	{ id: 'leaderboard', label: 'LeaderBoard', icon: MedalIcon, hasDot: true, link: '/leaderboard' },
	{ id: 'settings', label: 'Settings', icon: Settings, link: '#' },
];

function BrandMark({ onClick }: { onClick: (item: string) => void }) {
	return (
		<Link
			href='/'
			onClick={() => onClick('')}>
			<div className='flex justify-center items-center bg-primary rounded-xl size-10 shrink-0'>
				<div className='gap-0.5 grid grid-cols-2 size-5'>
					<span className='bg-brand-pink rounded-[2px]' />
					<span className='bg-primary-foreground rounded-[2px]' />
					<span className='bg-primary-foreground rounded-[2px]' />
					<span className='bg-brand-pink rounded-[2px]' />
				</div>
			</div>
		</Link>
	);
}

export function DashboardSidebar() {
	const [active, setActive] = useState('');
	const [expanded, setExpanded] = useState(true);
	const [isPending, startTransition] = useTransition();
	const handleSignOut = () => {
		startTransition(async () => {
			signOut();
		});
	};
	return (
		<>
			{/* Desktop sidebar: collapsible */}
			<aside
				className={cn(
					'hidden relative md:flex flex-col gap-8 py-6 border-border border-r transition-[width] duration-300 ease-in-out shrink-0 ',
					expanded ? 'w-45 px-4' : 'w-20 items-center px-0',
				)}>
				<div
					className={cn('flex items-center', expanded ? 'gap-3 px-1' : 'justify-center')}>
					<BrandMark onClick={(item: string) => setActive(item)} />
					{expanded && (
						<span className='font-bold text-foreground text-lg tracking-tight'>
							Lingua
						</span>
					)}
				</div>

				{/* Collapse / expand toggle */}
				<button
					onClick={() => setExpanded((v) => !v)}
					aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
					aria-expanded={expanded}
					className='z-100 top-9 -right-3 absolute flex justify-center items-center bg-card shadow-sm border border-border rounded-full size-6 text-muted-foreground hover:text-foreground transition-colors'>
					<ChevronLeft
						className={cn(
							'size-4 transition-transform duration-300',
							!expanded && 'rotate-180',
						)}
					/>
				</button>

				<nav className='flex flex-col flex-1 gap-2'>
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = active === item.id;
						return (
							<Link
								href={item.link || ''}
								key={item.id}>
								<button
									type='button'
									onClick={() => setActive(item.id)}
									aria-label={item.label}
									aria-current={isActive ? 'page' : undefined}
									className={cn(
										'relative flex items-center hover:bg-secondary rounded-xl h-11 text-muted-foreground hover:text-foreground transition-colors cursor-pointer',
										expanded
											? 'w-full gap-3 px-3'
											: 'w-11 justify-center self-center',
										isActive &&
											'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
									)}>
									<span className='relative flex justify-center items-center size-5 shrink-0'>
										<Icon
											className='size-5'
											strokeWidth={2}
										/>
										{item.hasDot && (
											<span className='-top-1 -right-1 absolute bg-brand-pink rounded-full size-1.5' />
										)}
									</span>
									{expanded && (
										<span className='font-medium text-sm'>{item.label}</span>
									)}
								</button>
							</Link>
						);
					})}
				</nav>

				<button
					type='button'
					aria-label='Log out'
					onClick={() => handleSignOut()}
					className={cn(
						'cursor-pointer flex items-center hover:bg-secondary rounded-xl h-11 text-muted-foreground hover:text-foreground transition-colors',
						expanded ? 'w-full gap-3 px-3' : 'w-11 justify-center self-center',
					)}>
					<LogOut className='size-5 shrink-0' />
					{expanded && <span className='font-medium text-sm'>Log out</span>}
				</button>
			</aside>

			{/* Mobile bottom bar */}
			<nav
				aria-label='Primary'
				className='md:hidden bottom-0 z-50 fixed inset-x-0 flex justify-around items-center bg-card px-2 py-2 border-border border-t'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = active === item.id;
					return (
						<button
							key={item.id}
							type='button'
							onClick={() => setActive(item.id)}
							aria-label={item.label}
							aria-current={isActive ? 'page' : undefined}
							className={cn(
								'relative flex justify-center items-center rounded-xl size-11 text-muted-foreground transition-colors',
								isActive && 'bg-primary text-primary-foreground',
							)}>
							<Icon
								className='size-5'
								strokeWidth={2}
							/>
							{item.hasDot && (
								<span className='top-2.5 right-2.5 absolute bg-brand-pink rounded-full size-1.5' />
							)}
						</button>
					);
				})}
			</nav>
		</>
	);
}
