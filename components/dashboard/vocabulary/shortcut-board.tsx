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
						<Badge>Phím cách</Badge> để xem/ẩn nghĩa
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Kéo phải</Badge> để đánh dấu đã học
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Kéo trái</Badge> để đánh dấu chưa học
					</div>
				</div>
			</Activity>
			<Activity mode={!isMobile ? 'hidden' : 'visible'}>
				<div className='space-y-2 text-sm'>
					<div className='flex gap-2 items-center'>
						<Badge>Chạm hai lần</Badge> để xem/ẩn nghĩa
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Vuốt phải</Badge> để đánh dấu đã học
					</div>
					<div className='flex gap-2 items-center'>
						<Badge>Vuốt trái</Badge> để đánh dấu chưa học
					</div>
				</div>
			</Activity>
		</section>
	);
}
