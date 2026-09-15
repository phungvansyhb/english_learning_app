'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/lib/types';
import { getNumMasteredWordInCate } from '@/services/vocab-word';
import { CheckCircle2, Loader2Icon, LoaderIcon, PlayIcon, Star, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type Props = {
	words: WordCard[];
};

export default function TryMode({ words }: Props) {
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const [isPending, startTransition] = useTransition();
	const speak = (item: WordCard) => {
		if ('speechSynthesis' in window)
			window.speechSynthesis.speak(new SpeechSynthesisUtterance(item.word));
	};

	const getPrimaryMeaning = (item: WordCard) => {
		if (item.meanings && item.meanings.length > 0) {
			const primaryMeaning = item.meanings.find((m) => m.is_primary_use);
			return primaryMeaning ? primaryMeaning : null;
		}
		return null;
	};

	const [numberOfWordLearned, setNumberOfWordLearned] = useState(0);
	useEffect(() => {
		async function getNum() {
			const data = await getNumMasteredWordInCate(Number(id));
			setNumberOfWordLearned(data || 0);
		}
		startTransition(() => getNum());
	}, []);

	return (
		<div className='mx-auto max-w-5xl px-4 pb-12 '>
			<div className='flex flex-col gap-3 py-2 md:flex-row md:items-center md:justify-between'>
				<h2 className='font-semibold text-muted-foreground'>{words.length} thuật ngữ</h2>
				<Button
					variant='default'
					size='icon-lg'>
					<Link href={`${pathName}?id=${id}&mode=learn`}>
						<PlayIcon />
					</Link>
				</Button>
				<div className='flex flex-wrap items-center gap-2 text-sm'>
					<span className='text-muted-foreground inline-flex items-baseline'>
						✓ Đã thuộc (
						{isPending ? (
							<Loader2Icon className=' size-3 animate-spin' />
						) : (
							numberOfWordLearned
						)}
						)
					</span>
				</div>
			</div>
			<div className='flex flex-col gap-3 pt-2'>
				{words.map((item) => (
					<article
						key={item.word}
						className='rounded-xl border bg-card p-4 md:p-5'>
						<div className='flex justify-between'>
							<div className='flex gap-4 items-baseline'>
								<div className='flex gap-1 items-baseline'>
									<h2 className='font-bold capitalize'>{item.word}</h2>
									<span className='text-muted-foreground text-sm'>
										({getPrimaryMeaning(item)?.part_of_speech})
									</span>
								</div>

								<code className='text-muted-foreground text-sm'>
									<Badge variant='outline'>US</Badge> {item.ipa_us}
								</code>
								<code className='text-muted-foreground text-sm'>
									<Badge variant='outline'>UK</Badge> {item.ipa_uk}
								</code>
							</div>
							<div className='flex gap-1 text-muted-foreground'>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => speak(item)}
									aria-label={`Phát âm ${item.word}`}>
									<Volume2 className='size-4' />
								</Button>
							</div>
						</div>
						{item.collocations && item.collocations.length > 0 && (
							<section className='mt-2'>
								<h3>Example:</h3>
								<div className='text-sm leading-6 text-muted-foreground '>
									{item.collocations &&
										item.collocations.length > 0 &&
										item.collocations.map((c) => (
											<div
												key={c.id}
												className='flex flex-col gap-1'>
												<p>- {c.phrase}</p>
											</div>
										))}
								</div>
							</section>
						)}
						{item.relations && item.relations.length > 0 && (
							<section className='mt-2'>
								<h3>Related words:</h3>
								{item.relations.filter((r) => r.relation_type === 'SYNONYMS')
									.length > 0 && (
									<div className='flex gap-1.5 items-baseline mt-2'>
										<Badge className='lowercase '>SYNONYMS</Badge>
										<p className='text-sm text-muted-foreground'>
											{item.relations
												.filter((r) => r.relation_type === 'SYNONYMS')
												.map((r) => r.word)
												.join(', ')}
										</p>
									</div>
								)}
								{item.relations.filter((r) => r.relation_type === 'ANTONYMS')
									.length > 0 && (
									<div className='flex gap-1.5 items-baseline mt-2'>
										<Badge className='lowercase '>ANTONYMS</Badge>
										<p className='text-sm text-muted-foreground'>
											{item.relations
												.filter((r) => r.relation_type === 'ANTONYMS')
												.map((r) => r.word)
												.join(', ')}
										</p>
									</div>
								)}
							</section>
						)}
					</article>
				))}
			</div>
			<br />
			<div className='flex justify-center'>
				<Button
					variant='default'
					size='icon-lg'>
					<Link href={`${pathName}?id=${id}&mode=learn`}>
						<PlayIcon />
					</Link>
				</Button>
			</div>
		</div>
	);
}
