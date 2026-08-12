import { notFound } from 'next/navigation';
import WritingEditor from '@/components/dashboard/writing/writing-editor';
import { getWritingLesson, writingLessons } from '@/lib/writing-data';
export function generateStaticParams(){ return writingLessons.map(x=>({slug:x.slug})) }
export default async function WritingDetail({params}:{params:Promise<{slug:string}>}){ const {slug}=await params; const lesson=getWritingLesson(slug); if(!lesson) notFound(); const index=writingLessons.findIndex(x=>x.slug===slug); return <WritingEditor lesson={lesson} nextSlug={writingLessons[index+1]?.slug}/> }
