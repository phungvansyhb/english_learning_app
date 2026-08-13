import { notFound } from 'next/navigation'
import { GrammarDetail } from '@/components/dashboard/grammar/grammar-detail'
import { grammarLessons, getGrammarLesson } from '@/lib/grammar-data'

export function generateStaticParams() {
  return grammarLessons.map((lesson) => ({ slug: lesson.slug }))
}

export default async function GrammarLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = getGrammarLesson(slug)
  if (!lesson) notFound()
  return <GrammarDetail lesson={lesson} />
}
