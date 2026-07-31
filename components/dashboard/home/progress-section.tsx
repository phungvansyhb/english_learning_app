import {
	GraduationCap,
	MoreHorizontal,
	Droplet,
	BookMarkedIcon,
	WholeWordIcon,
	FileHeadphoneIcon,
} from 'lucide-react';

import { progresses } from '@/lib/data';
import type { ProgressItem, ProgressTone } from '@/lib/types';
import { cn } from '@/lib/utils';

const toneStyles: Record<
	ProgressTone,
	{ card: string; bar: string; track: string; icon: typeof Droplet }
> = {
	purple: {
		card: 'bg-brand-purple text-accent-foreground',
		bar: 'bg-primary',
		track: 'bg-primary/15',
		icon: BookMarkedIcon,
	},
	orange: {
		card: 'bg-brand-orange text-primary',
		bar: 'bg-primary',
		track: 'bg-primary/15',
		icon: GraduationCap,
	},
	pink: {
		card: 'bg-brand-pink text-primary',
		bar: 'bg-primary',
		track: 'bg-primary/15',
		icon: FileHeadphoneIcon,
	},
	mint: {
		card: 'bg-brand-mint text-primary',
		bar: 'bg-primary',
		track: 'bg-primary/15',
		icon: WholeWordIcon,
	},
};

function ProgressCard({ progress }: { progress: ProgressItem }) {
	const style = toneStyles[progress.tone];
	const Icon = style.icon;

	return (
		<article
			className={cn('flex flex-col justify-between p-4 rounded-2xl min-h-40', style.card)}>
			<div className='flex justify-between items-start'>
				<span className='flex justify-center items-center bg-card rounded-full size-10 text-foreground'>
					<Icon className='size-5' />
				</span>
				<button
					type='button'
					aria-label='progress options'
					className='text-current/60 hover:text-current transition-opacity'>
					<MoreHorizontal className='size-5' />
				</button>
			</div>

			<h3 className='mt-4 font-semibold text-base text-pretty leading-snug'>
				{progress.title}
			</h3>

			<div className='mt-4'>
				<div className='flex justify-between items-center mb-1.5 font-medium text-xs'>
					<span>Progress</span>
					<span>
						{progress.learned}/{progress.target}
					</span>
				</div>
				<div className={cn('rounded-full w-full h-1.5', style.track)}>
					<div
						className={cn('rounded-full h-full', style.bar)}
						style={{
							width: `${Math.round((progress.learned * 100) / progress.target)}%`,
						}}
					/>
				</div>
			</div>
		</article>
	);
}

export function ProgressSection() {
	return (
		<section>
			<h2 className='font-bold text-foreground text-lg'>Your progress today</h2>
			<div className='gap-4 grid grid-cols-1 sm:grid-cols-4 mt-4'>
				{progresses.map((progress) => (
					<ProgressCard
						key={progress.id}
						progress={progress}
					/>
				))}
			</div>
		</section>
	);
}
