import { Badge } from '@/components/ui/badge';
import useIsMobile from '@/hooks/use-is-mobile';
import { KeyboardIcon } from 'lucide-react';
import React, { Activity } from 'react';

type Props = {};

export default function ShortcutBoard({}: Props) {
	const isMobile = useIsMobile();
	return (
		<section className='sticky bottom-0 flex flex-col items-center gap-4 text-muted-foreground'>
			<KeyboardIcon className='size-6' />
			<Activity mode={isMobile ? 'hidden' : 'visible'}>
				<div className='space-y-2 text-sm'>
					<div className='flex gap-2 items-center'>
						<Badge>Space</Badge> to toggle meaning
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Drag right</Badge> to mark as learned
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Drag left</Badge> to mark as new
					</div>
				</div>
			</Activity>
			<Activity mode={!isMobile ? 'hidden' : 'visible'}>
				<div className='space-y-2 text-sm'>
					<div className='flex gap-2 items-center'>
						<Badge>Double touch</Badge> to toggle meaning
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Swipe right</Badge> to mark as learned
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Swipe left</Badge> to mark as new
					</div>
				</div>
			</Activity>
		</section>
	);
}
