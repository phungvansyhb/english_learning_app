import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
	id : number;
	imageUrl: string;
	description: string;
	wordCount: number;
	learnedword: number;
	name: string;
	vocabGroup?: string;
	cardClassName?: string;
};

export default function CategoryVocab({
	id,
	vocabGroup,
	description,
	imageUrl,
	wordCount,
	learnedword,
	name,
	cardClassName,
}: Props) {
	return (
		<article
			className={cn(
				'group flex flex-col justify-between bg-white shadow rounded-xl min-h-40 overflow-hidden',
				cardClassName,
			)}>
			<Link
				href={`/vocabulary/${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}?id=${id}`}
				className='flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'>
				<div className='relative w-full h-30'>
					<Image
						src={imageUrl || '/placeholder.svg'}
						alt={name}
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
				<h3 className='font-semibold text-base text-pretty leading-snug'>{name}</h3>

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
			</Link>
		</article>
	);
}
