import LearnMode from '@/components/dashboard/vocabulary/learn-modes/learn-mode';
import PlayMode from '@/components/dashboard/vocabulary/learn-modes/play-mode';
import { ServerPageProps } from '@/lib/types';
import { getCategoryById, getWordsByTopicId } from '@/services/vocab-word';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Activity } from 'react';

export async function generateMetadata({ params }: ServerPageProps) {
	const { category } = await params;
	return { title: category ? `${category.toUpperCase()} | Vocabulary` : 'Vocabulary' };
}

export default async function VocabularyCategoryPage({ searchParams, params }: ServerPageProps) {
	const { id } = await searchParams;
	const { category } = await params;
	const data = await getCategoryById(id as string);
	if (!data) notFound();
	const words = await getWordsByTopicId(id as string);
	const learningWords = words.filter((item) => item.status === 'learning');
	return (
		<main className='min-h-screen bg-muted-background text-foreground p-4 md:p-6 lg:p-8'>
			<header className='sticky top-0 mb-4 z-10 border-b bg-muted-background/95 backdrop-blur'>
				<div className='mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3'>
					<Link
						href='/vocabulary'
						aria-label='Quay lại danh sách chủ đề'
						className='rounded-md p-2 hover:bg-muted'>
						<ArrowLeft />
					</Link>
					<div className='flex items-center gap-1 rounded-xl bg-muted p-3 text-sm mx-auto'>
						<h2 className='ml-auto text-xl font-bold capitalize'>{category}</h2>
					</div>
				</div>
			</header>
			<Activity mode={learningWords.length > 0 ? 'visible' : 'hidden'}>
				<LearnMode words={learningWords} />
			</Activity>
			<Activity mode={learningWords.length === 0 ? 'visible' : 'hidden'}>
				<PlayMode words={words} />
			</Activity>
		</main>
	);
}
