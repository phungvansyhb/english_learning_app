import { notFound } from 'next/navigation';
import ListeningExercise from '@/components/dashboard/listening/listening-exercise';
import { getListeningLesson } from '@/lib/listening-data';

export default async function ListeningDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getListeningLesson(slug);
  if (!lesson) notFound();
  return <ListeningExercise lesson={lesson} />;
}
