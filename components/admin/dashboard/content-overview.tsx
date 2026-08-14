import { ArrowUpRight, BookA, FileText, GraduationCap, Headphones } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const content = [
	{ label: 'Vocabulary', count: '642 items', value: 82, icon: BookA, color: 'bg-brand-purple' },
	{
		label: 'Grammar',
		count: '284 lessons',
		value: 64,
		icon: GraduationCap,
		color: 'bg-brand-pink',
	},
	{
		label: 'Reading',
		count: '198 passages',
		value: 48,
		icon: FileText,
		color: 'bg-brand-orange',
	},
	{
		label: 'Listening',
		count: '160 exercises',
		value: 38,
		icon: Headphones,
		color: 'bg-brand-mint',
	},
];

export function ContentOverview() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-start justify-between gap-3'>
				<div>
					<CardTitle>Content overview</CardTitle>
					<CardDescription className='mt-1'>Library coverage by skill</CardDescription>
				</div>
				<Button
					variant='ghost'
					size='sm'>
					<a href='/admin/master-data'>
						View all <ArrowUpRight data-icon='inline-end' />
					</a>
				</Button>
			</CardHeader>
			<CardContent className='flex flex-col gap-5'>
				{content.map((item) => {
					const Icon = item.icon;
					return (
						<div
							key={item.label}
							className='flex flex-col gap-2'>
							<div className='flex items-center justify-between gap-3 text-sm'>
								<div className='flex min-w-0 items-center gap-2'>
									<Icon className='size-4 shrink-0 text-muted-foreground' />
									<span className='font-medium'>{item.label}</span>
								</div>
								<Badge variant='secondary'>{item.count}</Badge>
							</div>
							<div className='h-2 overflow-hidden rounded-full bg-secondary'>
								<div
									className={`h-full rounded-full ${item.color}`}
									style={{ width: `${item.value}%` }}
								/>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}

export function QuickActions() {
	return (
		<Card className='bg-primary text-primary-foreground'>
			<CardHeader>
				<CardTitle>Quick actions</CardTitle>
				<CardDescription className='text-primary-foreground/70'>
					Keep your learning space fresh.
				</CardDescription>
			</CardHeader>
			<CardContent className='grid grid-cols-2 gap-2'>
				{[
					['Add words', '/admin/word'],
					['New grammar', '/admin/grammar'],
					['Manage users', '/admin/user'],
					['Master data', '/admin/master-data'],
				].map(([label, href]) => (
					<Button
						key={href}
						variant='secondary'
						size='sm'
						className='justify-between'>
						<a href={href}>
							{label}
							<ArrowUpRight data-icon='inline-end' />
						</a>
					</Button>
				))}
			</CardContent>
		</Card>
	);
}
