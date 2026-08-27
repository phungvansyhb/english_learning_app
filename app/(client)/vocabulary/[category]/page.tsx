import { notFound } from 'next/navigation';
import { vocabCategories } from '@/lib/data';
import VocabularyDetail from '@/components/dashboard/vocabulary/vocab-list-player';
import { ServerPageProps } from '@/lib/types';
import { getCategoryById, getWordsByTopicId } from '@/services/vocab-word';
import Link from 'next/link';
import {
	ArrowLeft,
	BookOpen,
	Gamepad2,
	Headphones,
	Menu,
	Settings2,
	Shuffle,
	Star,
} from 'lucide-react';
import VocabListPlayer from '@/components/dashboard/vocabulary/vocab-list-player';

export async function generateMetadata({ params }: ServerPageProps) {
	const { category } = await params;
	return { title: category ? `${category} | Vocabulary` : 'Vocabulary' };
}

export default async function VocabularyCategoryPage({  searchParams }: ServerPageProps) {
	const { id } = await searchParams;
	const data = await getCategoryById(id as string);
	if (!data) notFound();
	const words = await getWordsByTopicId(id as string);
	return (
		<main className='min-h-screen bg-muted-background text-foreground p-4 md:p-6 lg:p-8'>
			<header className='sticky top-0 z-10 border-b bg-muted-background/95 backdrop-blur'>
				<div className='mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3'>
					<Link
						href='/vocabulary'
						aria-label='Quay lại danh sách chủ đề'
						className='rounded-md p-2 hover:bg-muted'>
						<ArrowLeft />
					</Link>
					<div className='flex items-center gap-1 rounded-xl bg-muted p-1 text-sm'>
						<button className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-sm'>
							<Headphones /> Xem thử
						</button>
						<button className='flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-background'>
							<BookOpen /> Học
						</button>
						<button className='flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-background'>
							<Gamepad2 /> Chơi
						</button>
					</div>
					<button
						className='rounded-md p-2 hover:bg-muted md:hidden'
						aria-label='Mở menu'>
						<Menu />
					</button>
					<div className='hidden items-center gap-4 md:flex'>
						<Star />
						<Shuffle />
						<Settings2 />
					</div>
				</div>
			</header>
			<VocabListPlayer
				words={words}
				categoryName={data.name}
			/>
		</main>
	);
}
