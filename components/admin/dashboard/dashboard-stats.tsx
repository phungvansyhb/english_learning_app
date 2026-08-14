import { ArrowDownRight, ArrowUpRight, BookOpen, CheckCircle2, Users, Zap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
	{ label: 'Total learners', value: '12,840', change: '+12.8%', detail: 'vs. last month', icon: Users, tone: 'purple' },
	{ label: 'Lessons completed', value: '48,392', change: '+8.4%', detail: 'vs. last month', icon: CheckCircle2, tone: 'mint' },
	{ label: 'Content library', value: '1,284', change: '+24', detail: 'new this month', icon: BookOpen, tone: 'orange' },
	{ label: 'Active rate', value: '68.4%', change: '-2.1%', detail: 'vs. last month', icon: Zap, tone: 'pink' },
] as const;

const toneClasses = {
	purple: 'bg-brand-purple-soft text-primary',
	mint: 'bg-brand-mint text-brand-mint-foreground',
	orange: 'bg-brand-orange text-primary',
	pink: 'bg-brand-pink text-primary-foreground',
};

export function DashboardStats() {
	return (
		<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
			{stats.map((stat) => {
				const Icon = stat.icon;
				const isNegative = stat.change.startsWith('-');
				return (
					<Card key={stat.label} className='gap-5'>
						<CardHeader className='flex flex-row items-center justify-between gap-3'>
							<CardTitle className='text-sm font-medium text-muted-foreground'>{stat.label}</CardTitle>
							<div className={`flex size-10 items-center justify-center rounded-xl ${toneClasses[stat.tone]}`}>
								<Icon className='size-5' />
							</div>
						</CardHeader>
						<CardContent>
							<div className='flex items-end justify-between gap-3'>
								<div>
									<p className='text-2xl font-bold tracking-tight'>{stat.value}</p>
									<p className='mt-1 text-xs text-muted-foreground'>{stat.detail}</p>
								</div>
								<span className={`inline-flex items-center gap-1 text-xs font-semibold ${isNegative ? 'text-muted-foreground' : 'text-brand-mint-foreground'}`}>
									{isNegative ? <ArrowDownRight className='size-3.5' /> : <ArrowUpRight className='size-3.5' />}
									{stat.change}
								</span>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

