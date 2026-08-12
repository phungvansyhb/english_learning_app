'use client';

import Link from 'next/link';
import { ArrowLeft, Clock3, Lightbulb, Mic, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { speakingTypeLabels, speakingWave, SpeakingLesson } from '@/lib/speaking-data';
import { Button } from '@/components/ui/button';

export default function SpeakingPractice({ lesson }: { lesson: SpeakingLesson }) {
  const [prep, setPrep] = useState(5);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [rating, setRating] = useState(0);
  const media = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => { if (prep <= 0) return; const id = window.setInterval(() => setPrep((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(id); }, [prep]);
  useEffect(() => { if (!recording) return; const id = window.setInterval(() => setElapsed((value) => value + 1), 1000); return () => window.clearInterval(id); }, [recording]);
  const start = async () => { if (!navigator.mediaDevices?.getUserMedia) { setRecording(true); return; } try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const recorder = new MediaRecorder(stream); chunks.current = []; recorder.ondataavailable = (event) => chunks.current.push(event.data); recorder.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(chunks.current, { type: 'audio/webm' }))); stream.getTracks().forEach((track) => track.stop()); setRecorded(true); }; recorder.start(); media.current = recorder; setElapsed(0); setRecording(true); } catch { setRecording(true); } };
  const stop = () => { media.current?.stop(); setRecording(false); setRecorded(true); };
  const format = (value: number) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  const typeLabel = speakingTypeLabels[lesson.type];
  return <main className='min-h-full bg-muted-background p-4 text-foreground md:p-8'><div className='mx-auto flex max-w-4xl flex-col gap-5'>
    <nav className='flex items-center justify-between'><Link href='/speaking' className='inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary'><ArrowLeft className='size-4' /> Quay lại danh sách Speaking</Link><span className='rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground'>{typeLabel}</span></nav>
    <header className='flex items-end justify-between gap-4'><div><p className='text-sm font-semibold text-primary'>{typeLabel.toUpperCase()}</p><h1 className='mt-1 text-2xl font-bold tracking-tight'>{lesson.title}</h1></div><span className='rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground'>{lesson.difficulty}</span></header>
    <div className='flex items-center gap-3 text-sm text-muted-foreground'><div className='h-2 flex-1 rounded-full bg-secondary'><div className='h-2 w-1/3 rounded-full bg-primary' /></div><span>1 / 3</span></div>
    <section className='rounded-2xl border bg-card p-6 shadow-sm md:p-8'><div className='flex items-center justify-between'><span className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary'><Mic className='size-4' /> Speaking prompt</span>{prep > 0 && <span className='flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold'><Clock3 className='size-3.5' /> Chuẩn bị {prep}s</span>}</div>
      {lesson.image && <img src={lesson.image} alt='Minh họa bài mô tả tranh' className='mt-6 aspect-[16/7] w-full rounded-xl object-cover' />}
      <p className='mt-7 text-balance text-2xl font-semibold leading-relaxed md:text-3xl'>{lesson.prompt}</p>
      <div className='mt-6 flex items-start gap-3 rounded-xl bg-secondary/70 p-4 text-sm leading-6 text-muted-foreground'><Lightbulb className='mt-0.5 size-4 shrink-0 text-primary' /><span>{lesson.hint}</span></div>
      <div className='mt-8 flex flex-col gap-4 rounded-xl border bg-background p-4'><div className='flex items-center justify-between text-sm'><span className='font-semibold'>{recording ? 'Đang ghi âm...' : recorded ? 'Bản ghi của bạn' : 'Sẵn sàng ghi âm'}</span><span className='font-mono text-muted-foreground'>{format(elapsed)}</span></div><div className='flex h-14 items-center justify-center gap-1 rounded-lg bg-secondary/60 px-4'>{speakingWave.map((height, index) => <span key={index} className={`w-1 rounded-full bg-primary/70 ${recording ? 'animate-pulse' : ''}`} style={{ height: `${height}%` }} />)}</div><div className='flex flex-wrap items-center justify-between gap-3'><div className='flex items-center gap-2'>{!recording ? <Button onClick={start}><Mic data-icon='inline-start' /> Bắt đầu ghi âm</Button> : <Button variant='destructive' onClick={stop}><Square data-icon='inline-start' /> Dừng ghi âm</Button>}{recorded && !recording && <Button variant='outline' onClick={start}><RotateCcw data-icon='inline-start' /> Ghi lại</Button>}</div>{audioUrl && <audio controls src={audioUrl} aria-label='Phát lại bản ghi của bạn' className='h-9 max-w-full' />}</div></div>
      <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5'><Button variant='ghost' onClick={() => setShowAnswer((value) => !value)}><Volume2 data-icon='inline-start' /> {showAnswer ? 'Ẩn câu mẫu' : 'Xem câu mẫu'}</Button>{showAnswer && <p className='w-full rounded-lg bg-primary/5 p-4 text-sm leading-6 text-muted-foreground'>{lesson.modelAnswer}</p>}</div>
    </section>
    <section className='flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between'><div><p className='font-semibold'>Tự đánh giá bài nói</p><p className='mt-1 text-sm text-muted-foreground'>Bạn nói rõ và tự nhiên đến mức nào?</p></div><div className='flex items-center gap-1' aria-label='Đánh giá từ 1 đến 5'>{[1,2,3,4,5].map((value) => <button key={value} onClick={() => setRating(value)} className={`rounded-md px-2 py-1 text-xl ${value <= rating ? 'text-primary' : 'text-muted-foreground/40'}`} aria-label={`${value} sao`}>★</button>)}</div></section>
    <div className='flex justify-end'><Button variant='outline' onClick={() => { setPrep(5); setElapsed(0); setRecorded(false); setAudioUrl(''); setShowAnswer(false); setRating(0); }}><Play data-icon='inline-start' /> Bài tiếp theo</Button></div>
  </div></main>;
}
