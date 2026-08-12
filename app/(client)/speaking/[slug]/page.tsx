import { notFound } from 'next/navigation';
import SpeakingPractice from '@/components/dashboard/speaking/speaking-practice';
import { getSpeakingLesson } from '@/lib/speaking-data';
export default async function SpeakingDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const lesson = getSpeakingLesson(slug); if (!lesson) notFound(); return <SpeakingPractice lesson={lesson} />; }
