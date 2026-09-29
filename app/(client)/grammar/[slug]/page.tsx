import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GrammarDetail } from '@/components/dashboard/grammar/grammar-detail';
import { createGrammarSlug, getGrammarIdFromSlug } from '@/lib/grammar-utils';
import { getGrammarNeighbors, getGrammarPointForPage } from '@/services/grammar';

type GrammarLessonPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: GrammarLessonPageProps): Promise<Metadata> {
	const { slug } = await params;
	const id = getGrammarIdFromSlug(slug);
	const grammar = id ? await getGrammarPointForPage(id) : null;
	if (!grammar) return { title: 'Không tìm thấy bài học ngữ pháp' };

	return {
		title: grammar.name,
		description: grammar.description || `Học điểm ngữ pháp tiếng Anh: ${grammar.name}.`,
		alternates: { canonical: `/grammar/${createGrammarSlug(grammar.id, grammar.name)}` },
	};
}

export default async function GrammarLessonPage({ params }: GrammarLessonPageProps) {
	const { slug } = await params;
	const id = getGrammarIdFromSlug(slug);
	const grammar = id ? await getGrammarPointForPage(id) : null;
	if (!grammar) notFound();

	const neighbors = await getGrammarNeighbors(grammar.id);
	return (
		<GrammarDetail
			grammar={grammar}
			neighbors={neighbors}
		/>
	);
}
