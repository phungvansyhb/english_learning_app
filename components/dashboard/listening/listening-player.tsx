'use client';

import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { audioSample } from '@/lib/listening-data';

const formatTime = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

export default function ListeningPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const audio = audioRef.current;
      if (!audio) return;
      if (event.code === 'Space') { event.preventDefault(); playing ? audio.pause() : void audio.play(); }
      if (event.key.toLowerCase() === 'r') { audio.currentTime = 0; void audio.play(); setPlaying(true); }
      if (event.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
      if (event.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration || duration, audio.currentTime + 5);
      if (event.key === 'ArrowUp') { event.preventDefault(); const next = Math.min(1, audio.volume + 0.1); audio.volume = next; setVolume(next); }
      if (event.key === 'ArrowDown') { event.preventDefault(); const next = Math.max(0, audio.volume - 0.1); audio.volume = next; setVolume(next); }
      if (event.key.toLowerCase() === 'm') { audio.muted = !audio.muted; }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [duration, playing]);

  const togglePlay = () => { const audio = audioRef.current; if (!audio) return; if (playing) audio.pause(); else void audio.play(); };
  const seek = (offset: number) => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + offset)); };
  const muted = audioRef.current?.muted ?? volume === 0;

  return <section className='rounded-2xl border bg-card p-5 shadow-sm md:p-6'><audio ref={audioRef} src={audioSample} preload='metadata' onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
    <div className='flex items-center justify-between gap-4'><div><p className='text-xs font-bold uppercase tracking-[0.16em] text-primary'>Audio player</p><p className='mt-1 text-sm font-semibold'>{playing ? 'Đang phát bài nghe' : 'Sẵn sàng nghe'}</p></div><span className='rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground'>Space để phát/dừng</span></div>
    <input aria-label='Tiến trình audio' type='range' min='0' max={duration || 100} step='0.1' value={current} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }} className='mt-6 w-full accent-primary' />
    <div className='flex items-center justify-between text-xs text-muted-foreground'><span>{formatTime(current)}</span><span>{formatTime(duration)}</span></div>
    <div className='mt-5 flex flex-wrap items-center justify-between gap-3'><div className='flex items-center gap-2'><button onClick={() => seek(-5)} aria-label='Tua lại 5 giây' className='rounded-lg border p-2.5 text-sm hover:bg-secondary'><RotateCcw className='size-4' /></button><button onClick={togglePlay} aria-label={playing ? 'Tạm dừng' : 'Phát audio'} className='flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90'>{playing ? <Pause className='size-5' /> : <Play className='ml-0.5 size-5' />}</button><button onClick={() => seek(5)} aria-label='Tua tới 5 giây' className='rounded-lg border px-3 py-2.5 text-sm font-semibold hover:bg-secondary'>+5s</button></div><div className='flex items-center gap-2 text-muted-foreground'><button onClick={() => { if (audioRef.current) audioRef.current.muted = !audioRef.current.muted; }} aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'} className='rounded-lg p-2 hover:bg-secondary'>{muted ? <VolumeX className='size-4' /> : <Volume2 className='size-4' />}</button><input aria-label='Âm lượng' type='range' min='0' max='1' step='0.05' value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); if (audioRef.current) { audioRef.current.volume = next; audioRef.current.muted = false; } }} className='w-20 accent-primary' /><span className='hidden text-xs md:inline'>R replay · ← → seek · ↑ ↓ volume · M mute</span></div></div>
  </section>;
}
