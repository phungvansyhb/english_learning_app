import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

type Props = {
	imageUrl: string;
	description: string;
	wordCount: number;
	learnedword: number;
	categoryName: string;
	vocabGroup: string;
	cardClassName: string;
};

export default function CategoryVocab({
	vocabGroup,
	description,
	imageUrl,
	wordCount,
	learnedword,
	categoryName,
	cardClassName,
}: Props) {
	return (
		<article
			className={cn(
				'flex flex-col justify-between bg-white shadow rounded-xl min-h-40 overflow-hidden',
				cardClassName,
			)}>
			<div className='relative w-full h-30'>
				<Image
					src={imageUrl || '/placeholder.svg'}
					alt={categoryName}
					fill
					className='object-cover group-hover:scale-[1.03] transition-transform duration-300'
				/>
				<button
					type='button'
					aria-label='progress options'
					className='top-2 right-2 absolute text-current/60 hover:text-current transition-opacity'>
					<MoreHorizontal className='size-5' />
				</button>
			</div>
			<div className='p-2 md:p-4'>
				<h3 className='font-semibold text-base text-pretty leading-snug'>{categoryName}</h3>

				<div className='mt-4'>
					<div className='flex justify-between items-center mb-1.5 font-medium text-xs'>
						<span>Progress</span>
						<span>
							{learnedword}/{wordCount}
						</span>
					</div>
					<div className={cn('bg-primary/15 rounded-full w-full h-1.5')}>
						<div
							className={cn('bg-primary rounded-full h-full')}
							style={{
								width: `${Math.round((learnedword * 100) / wordCount)}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</article>
	);
}
