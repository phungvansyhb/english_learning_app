import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function PromoBanner() {
	return (
		<section className='relative bg-accent px-6 sm:px-8 py-6 rounded-3xl overflow-hidden'>
			<div className='z-10 relative max-w-sm'>
				<h2 className='font-bold text-xl sm:text-2xl text-pretty leading-snug text-accent-foreground'>
					"Rain like cat and dog"
				</h2>
				<div className='text-muted-foreground text-sm'>~ Mưa rơi rào rào</div>
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
