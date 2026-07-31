import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Volume1Icon } from 'lucide-react';

export function DailyWordBanner() {
	return (
		<section className='relative bg-accent px-6 sm:px-8 py-6 rounded-3xl overflow-hidden'>
			<div className='z-10 relative max-w-sm'>
				<h2 className='font-bold text-xl sm:text-2xl text-pretty leading-snug text-accent-foreground'>
					Accommodate (verb)
				</h2>
				<div
					className='flex gap-2 text-muted-foreground text-sm'
					aria-label='synonym'>
					/əˈkɑːmədeɪt/
					<Volume1Icon className='cursor-pointer' />
				</div>
				<div
					className='mt-2 text-foreground text-sm'
					aria-label='synonym'>
					Def: To provide enough space for someone/something.
				</div>
				<div
					className='text-foreground text-sm'
					aria-label='synonym'>
					Eg: "The new conference room can accommodate 50."
				</div>

				<Button className='mt-5 px-6 rounded-full h-11 text-sm'>Học thôi</Button>
			</div>

			<Image
				src='/illustrations/banner-reading.png'
				alt='Illustration of a person reading on a stack of books'
				width={360}
				height={260}
				priority
				className='hidden sm:block -right-2 bottom-0 absolute w-auto h-full object-contain pointer-events-none'
			/>
		</section>
	);
}
