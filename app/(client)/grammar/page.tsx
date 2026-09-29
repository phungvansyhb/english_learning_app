import type { Metadata } from 'next';
import { GrammarLibrary } from '@/components/dashboard/grammar/grammar-library';
import { listGrammarPoints } from '@/services/grammar';

type GrammarPageProps = {
	searchParams: Promise<{ search?: string; difficulty?: string; page?: string }>;
};

export const metadata: Metadata = {
	title: 'Bài học ngữ pháp tiếng Anh',
	description: 'Luyện ngữ pháp tiếng Anh qua các bài học rõ ràng, thực tế và dễ áp dụng.',
};

export default async function GrammarPage({ searchParams }: GrammarPageProps) {
	const params = await searchParams;
	const page = Math.max(1, Number(params.page) || 1);
	const result = await listGrammarPoints({
		page,
		perPage: 12,
		search: params.search?.trim() || undefined,
		difficulty_code: params.difficulty || undefined,
	});

	return (
		<GrammarLibrary
			result={result}
			search={params.search}
			difficulty={params.difficulty}
		/>
	);
}
