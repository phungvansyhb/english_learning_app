import { notFound } from 'next/navigation';
import ReadingExercise from '@/components/dashboard/reading/reading-exercise';
import { getReadingLesson } from '@/lib/reading-data';

type Props = { params: Promise<{ slug: string }> };

export default async function ReadingExercisePage({ params }: Props) {
  const { slug } = await params;
  const lesson = getReadingLesson(slug);
  if (!lesson) notFound();
  return <ReadingExercise lesson={lesson} />;
}
