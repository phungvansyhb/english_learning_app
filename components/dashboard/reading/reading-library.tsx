'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Clock3, Filter, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Difficulty, partLabels, ReadingPart, readingLessons } from '@/lib/reading-data';

const parts: Array<ReadingPart | 'all'> = ['all', 'part-5', 'part-6', 'part-7'];
const difficulties: Array<Difficulty | 'all'> = ['all', 'Dễ', 'Trung bình', 'Khó'];

export default function ReadingLibrary() {
  const [part, setPart] = useState<ReadingPart | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const filtered = useMemo(() => readingLessons.filter((lesson) => (part === 'all' || lesson.part === part) && (difficulty === 'all' || lesson.difficulty === difficulty)), [part, difficulty]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const selectPart = (value: ReadingPart | 'all') => { setPart(value); setPage(1); };
  const selectDifficulty = (value: Difficulty | 'all') => { setDifficulty(value); setPage(1); };

  return <main className='min-h-full bg-muted-background p-4 text-foreground md:p-8'>
    <div className='mx-auto flex max-w-6xl flex-col gap-7'>
      <section className='overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:p-9'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div className='flex max-w-2xl flex-col gap-3'><span className='flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary'><BookOpen className='size-3.5' /> Reading practice</span><h1 className='text-balance text-3xl font-bold tracking-tight md:text-4xl'>Luyện đọc theo format TOEIC</h1><p className='text-pretty leading-6 text-muted-foreground'>Chọn một bài đọc vừa sức, luyện theo từng Part và theo dõi tiến bộ của bạn qua mỗi phiên học.</p></div>
          <div className='rounded-xl bg-secondary p-4 md:min-w-44'><p className='text-xs text-muted-foreground'>Bài đã hoàn thành</p><p className='mt-1 text-2xl font-bold text-primary'>12 <span className='text-sm font-medium text-muted-foreground'>/ 24 bài</span></p></div>
        </div>
      </section>
      <section className='flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-2 text-sm font-semibold'><SlidersHorizontal className='size-4 text-primary' /> Bộ lọc bài đọc</div>
        <div className='flex flex-col gap-3 md:flex-row md:items-center'>
          <div className='flex flex-wrap gap-2'>{parts.map((value) => <button key={value} onClick={() => selectPart(value)} className={cn('rounded-lg border px-3 py-2 text-sm transition-colors', part === value ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-secondary')}>{value === 'all' ? 'Tất cả Part' : partLabels[value]}</button>)}</div>
          <div className='flex items-center gap-2'><Filter className='size-4 text-muted-foreground' /><select value={difficulty} onChange={(event) => selectDifficulty(event.target.value as Difficulty | 'all')} className='rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30'><option value='all'>Mọi độ khó</option>{difficulties.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
        </div>
      </section>
      <div className='flex items-center justify-between'><div><h2 className='text-xl font-bold'>Bài đọc đề xuất</h2><p className='mt-1 text-sm text-muted-foreground'>{filtered.length} bài phù hợp với lựa chọn của bạn</p></div><span className='hidden rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground md:block'>TOEIC Reading</span></div>
      {paged.length > 0 ? <div className='grid gap-4 md:grid-cols-2'>{paged.map((lesson) => <Link key={lesson.slug} href={`/reading/${lesson.slug}`} className='group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'><div className='flex items-start justify-between gap-3'><span className='rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary'>{partLabels[lesson.part]}</span><span className='text-xs text-muted-foreground'>{lesson.difficulty}</span></div><h3 className='mt-5 text-lg font-bold group-hover:text-primary'>{lesson.title}</h3><p className='mt-2 min-h-12 text-sm leading-6 text-muted-foreground'>{lesson.subtitle}</p><div className='mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground'><span className='flex items-center gap-1.5'><Clock3 className='size-3.5' /> {lesson.duration} phút</span><span>{lesson.questions.length} câu <ArrowRight className='ml-1 inline size-3.5 transition-transform group-hover:translate-x-1' /></span></div></Link>)}</div> : <div className='rounded-xl border bg-card p-10 text-center text-muted-foreground'>Không tìm thấy bài đọc phù hợp.</div>}
      <div className='flex items-center justify-center gap-2 pt-2'>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => setPage(number)} className={cn('size-9 rounded-lg border text-sm', page === number ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary')}>{number}</button>)}</div>
    </div>
  </main>;
}
