import { notFound } from 'next/navigation';
import { vocabCategories } from '@/lib/data';
import VocabularyDetail from '@/components/dashboard/vocabulary/vocabulary-detail';

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const topic = vocabCategories.find((item) => item.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category);
  return { title: topic ? `${topic.categoryName} | Vocabulary` : 'Vocabulary' };
}

export default async function VocabularyCategoryPage({ params }: Props) {
  const { category } = await params;
  const topic = vocabCategories.find((item) => item.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category);
  if (!topic) notFound();
  return <VocabularyDetail categoryName={topic.categoryName} slug={category} />;
}
