'use client';

import { CalendarDays, Download, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/admin/dashboard/dashboard-stats';
import { LearningActivityChart } from '@/components/admin/dashboard/learning-activity-chart';
import { ContentOverview, QuickActions } from '@/components/admin/dashboard/content-overview';
import { RecentUsers } from '@/components/admin/dashboard/recent-users';

export function AdminDashboard() {
	return <div className='flex flex-col gap-6'>
		<section className='flex flex-col justify-between gap-4 lg:flex-row lg:items-end'>
			<div className='flex flex-col gap-2'><div className='flex items-center gap-2 text-sm font-semibold text-brand-pink'><Sparkles className='size-4' /> Good morning, admin</div><h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>Here&apos;s your learning pulse.</h1><p className='max-w-xl text-sm leading-6 text-muted-foreground'>A calm overview of what&apos;s happening across your English learning community.</p></div>
			<div className='flex flex-wrap items-center gap-2'><Button variant='outline' size='sm'><CalendarDays data-icon='inline-start' /> Last 7 days</Button><Button size='sm'><Download data-icon='inline-start' /> Export report</Button></div>
		</section>
		<DashboardStats />
		<section className='grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]'><LearningActivityChart /><ContentOverview /></section>
		<section className='grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]'><RecentUsers /><QuickActions /></section>
	</div>;
}
