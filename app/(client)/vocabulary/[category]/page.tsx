import LearnMode from '@/components/dashboard/vocabulary/learn-modes/learn-mode';
import PlayMode from '@/components/dashboard/vocabulary/learn-modes/play-mode';
import TryMode from '@/components/dashboard/vocabulary/learn-modes/try-mode';
import { Button } from '@/components/ui/button';
import { ServerPageProps, VOCAB_MODE } from '@/lib/types';
import { getCategoryById, getWordsByTopicId } from '@/services/vocab-word';
import { ArrowLeft, BookOpen, Gamepad2, Headphones } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: ServerPageProps) {
	const { category } = await params;
	return { title: category ? `${category.toUpperCase()} | Vocabulary` : 'Vocabulary' };
}

export default async function VocabularyCategoryPage({ searchParams }: ServerPageProps) {
	const { id, mode } = await searchParams;
	const data = await getCategoryById(id as string);
	if (!data) notFound();
	const words = await getWordsByTopicId(id as string);

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
					<div className='flex items-center gap-1 rounded-xl bg-muted p-1 text-sm mx-auto'>
						<Link
							href={`/vocabulary/${encodeURIComponent(data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}?id=${data.id}&mode=${VOCAB_MODE.TRY}`}>
							<Button variant={mode === VOCAB_MODE.TRY ? 'default' : 'ghost'}>
								<Headphones /> Xem thử
							</Button>
						</Link>

						<Link
							href={`/vocabulary/${encodeURIComponent(data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}?id=${data.id}&mode=${VOCAB_MODE.LEARN}`}>
							<Button variant={mode === VOCAB_MODE.LEARN ? 'default' : 'ghost'}>
								<BookOpen /> Học
							</Button>
						</Link>
						<Link
							href={`/vocabulary/${encodeURIComponent(data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}?id=${data.id}&mode=${VOCAB_MODE.PLAY}`}>
							<Button variant={mode === VOCAB_MODE.PLAY ? 'default' : 'ghost'}>
								<Gamepad2 /> Chơi
							</Button>
						</Link>
					</div>
				</div>
			</header>
			{mode === VOCAB_MODE.TRY && <TryMode words={words} />}
			{mode === VOCAB_MODE.LEARN && <LearnMode words={words} />}
			{mode === VOCAB_MODE.PLAY && <PlayMode words={words} />}
		</main>
	);
}
