import LearnMode from '@/components/dashboard/vocabulary/learn-modes/learn-mode';
import PlayMode from '@/components/dashboard/vocabulary/learn-modes/play-mode';
import TryMode from '@/components/dashboard/vocabulary/learn-modes/try-mode';
import { Button } from '@/components/ui/button';
import { ServerPageProps, VOCAB_MODE } from '@/lib/types';
import { getUserVocabCategory, listCategoryWords } from '@/services/user-vocab-category';
import { ArrowLeft, BookOpen, FolderUpIcon, Gamepad2, ListCheckIcon, Share2Icon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: ServerPageProps) {
	const { category } = await params;
	const data = await getUserVocabCategory(Number(category));
	return { title: data ? `${data.name} | Sổ tay từ vựng` : 'Sổ tay từ vựng' };
}

export default async function UserVocabularyCategoryPage({
	params,
	searchParams,
}: ServerPageProps) {
	const { category } = await params;
	const { mode } = await searchParams;
	const categoryId = Number(category);
	if (!Number.isInteger(categoryId)) notFound();

	const data = await getUserVocabCategory(categoryId);
	if (!data) notFound();
	const words = await listCategoryWords(categoryId);
	const basePath = `/vocabulary/my/${categoryId}`;
	const activeMode = typeof mode === 'string' ? mode : VOCAB_MODE.TRY;

	return (
		<main className='min-h-screen bg-muted-background text-foreground p-4 md:p-6 lg:p-8'>
			<header className='sticky top-0 mb-4 z-10 border-b bg-muted-background/95 backdrop-blur'>
				<div className='mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3'>
					<Link
						href='/vocabulary'
						aria-label='Quay lại sổ tay từ vựng'
						className='rounded-md p-2 hover:bg-muted'>
						<ArrowLeft />
					</Link>
					<div className='flex items-center gap-1 rounded-xl bg-muted p-1 text-sm mx-auto'>
						<Link href={`${basePath}?mode=${VOCAB_MODE.TRY}`}>
							<Button variant={mode === VOCAB_MODE.TRY ? 'default' : 'ghost'}>
								<ListCheckIcon /> Tổng quan
							</Button>
						</Link>
						<Link href={`${basePath}?mode=${VOCAB_MODE.LEARN}`}>
							<Button variant={mode === VOCAB_MODE.LEARN ? 'default' : 'ghost'}>
								<BookOpen /> Học
							</Button>
						</Link>
						<Link href={`${basePath}?mode=${VOCAB_MODE.PLAY}`}>
							<Button variant={mode === VOCAB_MODE.PLAY ? 'default' : 'ghost'}>
								<Gamepad2 /> Luyện tập
							</Button>
						</Link>
					</div>
				</div>
			</header>
			<div className='flex justify-between'>
				<section className=''>
					<h1 className='text font-bold'>{data.name}</h1>
					{data.description && (
						<p className='mt-1 text-xs text-muted-foreground'>{data.description}</p>
					)}
				</section>
				<div className='flex gap-2'>
					<Button
						variant='secondary'
						size='icon'>
						<Share2Icon className='size-4' />
					</Button>
					<Button
						variant='secondary'
						size='icon'>
						<FolderUpIcon className='size-4' />
					</Button>
				</div>
			</div>

			{words.length === 0 ? (
				<div className='mx-auto max-w-5xl px-4 py-12 text-center text-muted-foreground'>
					<p>Sổ tay này chưa có từ vựng.</p>
				</div>
			) : (
				<>
					{activeMode === VOCAB_MODE.TRY && <TryMode words={words} />}
					{activeMode === VOCAB_MODE.LEARN && <LearnMode words={words} />}
					{activeMode === VOCAB_MODE.PLAY && <PlayMode words={words} />}
				</>
			)}
		</main>
	);
}
