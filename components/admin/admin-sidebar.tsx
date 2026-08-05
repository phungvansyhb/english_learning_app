'use client';

import { useState } from 'react';
import { BookA, ChevronLeft, LayoutGrid, Layers, LogOut, Settings, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuthStore } from '@/utils/zustand/auth-store';

interface NavItem {
	id: string;
	label: string;
	icon: typeof LayoutGrid;
}

const navItems: NavItem[] = [
	{ id: 'overview', label: 'Overview', icon: LayoutGrid },
	{ id: 'words', label: 'Words', icon: BookA },
	{ id: 'parts', label: 'Parts', icon: Layers },
	{ id: 'students', label: 'Students', icon: Users },
	{ id: 'settings', label: 'Settings', icon: Settings },
];

function BrandMark() {
	return (
		<Link href='/'>
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

export function AdminSidebar() {
	const [active, setActive] = useState('words');
	const [expanded, setExpanded] = useState(false);
	const user = useAuthStore((state) => state.user);
	console.log(user);
	return (
		<>
			{/* Desktop sidebar: collapsible */}
			<aside
				className={cn(
					'hidden relative md:flex flex-col gap-8 py-6 border-border border-r transition-[width] duration-300 ease-in-out shrink-0',
					expanded ? 'w-60 px-4' : 'w-20 items-center px-0',
				)}>
				<div
					className={cn('flex items-center', expanded ? 'gap-3 px-1' : 'justify-center')}>
					<BrandMark />
					{expanded && (
						<div className='leading-tight'>
							<span className='block font-bold text-foreground text-lg tracking-tight'>
								Lingua
							</span>
							<span className='block font-medium text-muted-foreground text-xs'>
								{user?.role}
							</span>
						</div>
					)}
				</div>

				<button
					type='button'
					onClick={() => setExpanded((v) => !v)}
					aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
					aria-expanded={expanded}
					className='top-9 -right-3 absolute flex justify-center items-center bg-card shadow-sm border border-border rounded-full size-6 text-muted-foreground hover:text-foreground transition-colors'>
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
							<button
								key={item.id}
								type='button'
								onClick={() => setActive(item.id)}
								aria-label={item.label}
								aria-current={isActive ? 'page' : undefined}
								className={cn(
									'relative flex items-center hover:bg-secondary rounded-xl h-11 text-muted-foreground hover:text-foreground transition-colors',
									expanded
										? 'w-full gap-3 px-3'
										: 'w-11 justify-center self-center',
									isActive &&
										'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
								)}>
								<Icon
									className='size-5 shrink-0'
									strokeWidth={2}
								/>
								{expanded && (
									<span className='font-medium text-sm'>{item.label}</span>
								)}
							</button>
						);
					})}
				</nav>

				<button
					type='button'
					aria-label='Log out'
					className={cn(
						'flex items-center hover:bg-secondary rounded-xl h-11 text-muted-foreground hover:text-foreground transition-colors',
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
						</button>
					);
				})}
			</nav>
		</>
	);
}
