import { DictionaryMeaning } from '@/lib/dictionary-data';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

export default function MeaningCard({
	meaning,
	withExamples,
}: {
	meaning: DictionaryMeaning;
	withExamples: boolean;
}) {
	return (
		<div className='rounded-xl bg-secondary p-3'>
			<div className='flex items-start justify-between gap-2'>
				<div>
					<p className='font-semibold text-foreground'>{meaning.meaning}</p>
					<p className='mt-0.5 text-xs leading-5 text-muted-foreground'>
						{meaning.definition}
					</p>
				</div>
			</div>
			{withExamples &&
				meaning.examples.map((example, index) => (
					<div
						key={index}
						className='mt-2 border-l-2 border-primary/30 pl-2.5 text-xs'>
						<p className='leading-5 text-foreground'>
							<span className='font-semibold text-primary'>VD: </span>
							{example.en}
						</p>
						<p className='mt-0.5 italic leading-5 text-muted-foreground'>
							{example.vi}
						</p>
					</div>
				))}
		</div>
	);
}
