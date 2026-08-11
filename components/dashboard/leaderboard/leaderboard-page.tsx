'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  Crown,
  MoreHorizontal,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, PropsWithChildren } from 'react';

function Surface({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('bg-card border rounded-xl', className)} {...props}>{children}</div>;
}

function SurfaceContent({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={className} {...props}>{children}</div>;
}

function SurfaceHeader({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={className} {...props}>{children}</div>;
}

function SurfaceTitle({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return <h3 className={cn('font-semibold', className)} {...props}>{children}</h3>;
}

const Card = Surface;
const CardContent = SurfaceContent;
const CardHeader = SurfaceHeader;
const CardTitle = SurfaceTitle;

type Metric = 'XP' | 'Time' | 'Streak';
type Period = 'Hôm nay' | 'Tuần này' | 'Tháng này' | 'Tất cả';

type Player = {
  rank: number;
  name: string;
  initials: string;
  level: number;
  xp: string;
  tone: string;
};

const players: Record<Metric, Player[]> = {
  XP: [
    { rank: 4, name: 'Học viên DCF7', initials: 'T', level: 7, xp: '2.435 XP', tone: 'bg-brand-mint' },
    { rank: 5, name: 'transition', initials: 'T', level: 7, xp: '2.280 XP', tone: 'bg-brand-orange' },
    { rank: 6, name: 'Lê Phương Thảo', initials: 'Lê', level: 7, xp: '2.270 XP', tone: 'bg-brand-pink' },
    { rank: 7, name: 'Thùy An', initials: 'TA', level: 7, xp: '2.090 XP', tone: 'bg-secondary' },
    { rank: 8, name: 'Châu Nguyễn', initials: 'C', level: 7, xp: '2.070 XP', tone: 'bg-brand-purple' },
    { rank: 9, name: 'Trúc Nguyen', initials: 'T', level: 7, xp: '2.060 XP', tone: 'bg-brand-orange' },
    { rank: 10, name: 'Luyen Tran kim', initials: 'L', level: 7, xp: '1.960 XP', tone: 'bg-muted' },
  ],
  Time: [
    { rank: 4, name: 'Minh Anh', initials: 'MA', level: 8, xp: '18 giờ', tone: 'bg-brand-purple' },
    { rank: 5, name: 'Học viên DCF7', initials: 'T', level: 7, xp: '16 giờ', tone: 'bg-brand-mint' },
    { rank: 6, name: 'Ngọc Lan', initials: 'NL', level: 6, xp: '14 giờ', tone: 'bg-brand-pink' },
    { rank: 7, name: 'Trúc Nguyen', initials: 'T', level: 7, xp: '13 giờ', tone: 'bg-brand-orange' },
    { rank: 8, name: 'Châu Nguyễn', initials: 'C', level: 7, xp: '12 giờ', tone: 'bg-brand-purple' },
  ],
  Streak: [
    { rank: 4, name: 'Ngọc Lan', initials: 'NL', level: 6, xp: '43 ngày', tone: 'bg-brand-pink' },
    { rank: 5, name: 'Học viên DCF7', initials: 'T', level: 7, xp: '39 ngày', tone: 'bg-brand-mint' },
    { rank: 6, name: 'Minh Anh', initials: 'MA', level: 8, xp: '36 ngày', tone: 'bg-brand-purple' },
    { rank: 7, name: 'Trúc Nguyen', initials: 'T', level: 7, xp: '31 ngày', tone: 'bg-brand-orange' },
    { rank: 8, name: 'Thùy An', initials: 'TA', level: 7, xp: '28 ngày', tone: 'bg-secondary' },
  ],
};

const topThree = [
  { rank: 2, name: 'hồng hoa', initials: 'HH', score: '2.740 XP', tone: 'bg-brand-pink' },
  { rank: 1, name: 'Ngọc Dung', initials: 'ND', score: '7.440 XP', tone: 'bg-brand-orange' },
  { rank: 3, name: 'Học viên C415', initials: 'C4', score: '2.460 XP', tone: 'bg-brand-purple' },
];

const activities = [
  ['Anh Q.', 'vừa lên Lv. 3', 'Cấp độ', Sparkles],
  ['Tùng T.', 'vừa hoàn thành 1 bộ thi thử', 'Thi thử', Trophy],
  ['Anh Q.', 'vừa kiếm thêm XP trong ít phút', '+12 XP', Zap],
  ['như vừa lên Lv. 4', '', 'Cấp độ', Sparkles],
  ['Trương M.', 'vừa mời thêm 1 bạn cùng học', 'Lan tỏa', Users],
  ['Đạt L.', 'vừa hoàn thành 1 bộ thi thử', 'Thi thử', Trophy],
];

function Podium() {
  return (
    <Card className='overflow-hidden'>
      <CardContent className='flex items-end justify-center gap-3 sm:gap-8 px-4 sm:px-10 pt-10 pb-8 min-h-72'>
        {topThree.map((player) => {
          const winner = player.rank === 1;
          return (
            <div key={player.rank} className={cn('flex flex-col items-center text-center', winner ? 'order-2' : player.rank === 2 ? 'order-1' : 'order-3')}>
              <div className={cn('relative flex items-center justify-center rounded-full border-4 border-card shadow-md size-16 sm:size-24 text-card-foreground font-bold', player.tone, winner && 'ring-4 ring-brand-orange/30')}>
                {winner && <span className='-top-5 absolute flex items-center justify-center bg-brand-orange rounded-full size-8 text-primary-foreground'><Crown className='size-4' /></span>}
                <span className='text-lg sm:text-2xl'>{player.initials}</span>
                <span className='-bottom-3 absolute flex items-center justify-center bg-card border rounded-full size-7 font-bold text-foreground text-xs'>{player.rank}</span>
              </div>
              <p className={cn('mt-5 font-semibold text-sm sm:text-base', winner && 'text-lg')}>{player.name}</p>
              <p className={cn('font-bold text-primary text-sm sm:text-base', winner && 'text-brand-orange text-lg')}>{player.score}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>('XP');
  const [period, setPeriod] = useState<Period>('Tuần này');
  const [showAll, setShowAll] = useState(false);
  const ranking = useMemo(() => players[metric].slice(0, showAll ? undefined : 7), [metric, showAll]);

  return (
    <section className='flex flex-col gap-6 mt-6 pb-8'>
      <div className='relative overflow-hidden bg-accent/50 p-6 sm:p-8 border border-brand-purple/30 rounded-3xl'>
        <div className='relative z-10 max-w-2xl'>
          <span className='inline-flex items-center gap-2 bg-brand-mint px-3 py-1 rounded-full font-semibold text-brand-mint-foreground text-xs'><Trophy className='size-3.5' /> Hall of fame</span>
          <h1 className='mt-4 font-bold text-3xl sm:text-4xl tracking-tight'>Bảng xếp hạng</h1>
          <p className='mt-2 text-muted-foreground'>Vinh danh học viên kiên trì, chăm chỉ và lan tỏa tri thức mỗi ngày.</p>
        </div>
        <div className='-right-16 -top-24 absolute bg-brand-mint/30 blur-3xl rounded-full size-64' aria-hidden='true' />
      </div>

      <div className='flex xl:flex-row flex-col gap-6'>
        <div className='flex flex-col gap-4 min-w-0 xl:w-[68%]'>
          <div className='flex sm:flex-row flex-col sm:justify-between gap-3'>
            <div className='flex items-center bg-card p-1 border rounded-xl w-fit'>
              {(['XP', 'Time', 'Streak'] as Metric[]).map((item) => <Button key={item} variant={metric === item ? 'default' : 'ghost'} size='sm' onClick={() => setMetric(item)}>{item}</Button>)}
            </div>
            <div className='flex items-center bg-card p-1 border rounded-xl w-fit'>
              {(['Hôm nay', 'Tuần này', 'Tháng này', 'Tất cả'] as Period[]).map((item) => <Button key={item} variant={period === item ? 'default' : 'ghost'} size='sm' className='px-2.5' onClick={() => setPeriod(item)}>{item}</Button>)}
            </div>
          </div>
          <Podium />
          <Card className='overflow-hidden'>
            <div className='hidden sm:grid grid-cols-[64px_1fr_90px_110px] bg-secondary/50 px-6 py-3 text-muted-foreground text-xs uppercase tracking-wide'><span>Hạng</span><span>Học viên</span><span>Cấp độ</span><span className='text-right'>{metric === 'XP' ? 'Tổng XP' : metric}</span></div>
            {ranking.map((player) => <div key={player.name} className='grid grid-cols-[42px_1fr_auto] sm:grid-cols-[64px_1fr_90px_110px] items-center gap-3 px-4 sm:px-6 py-3 border-t'><span className='font-semibold text-muted-foreground text-sm'>{player.rank}</span><div className='flex items-center gap-3 min-w-0'><span className={cn('flex items-center justify-center rounded-full size-9 shrink-0 font-semibold text-sm', player.tone)}>{player.initials}</span><span className='font-medium truncate'>{player.name}</span></div><span className='hidden sm:inline-flex bg-secondary px-2 py-1 rounded-full w-fit font-semibold text-muted-foreground text-xs'>Lv. {player.level}</span><span className='font-bold text-primary text-right'>{player.xp}</span></div>)}
            <button type='button' onClick={() => setShowAll(!showAll)} className='hover:bg-secondary w-full py-3 border-t text-primary text-sm transition-colors'>{showAll ? 'Thu gọn danh sách' : 'Xem thêm học viên'}</button>
          </Card>
          <Card className='bg-brand-mint/20 border-brand-mint'><CardContent className='flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 p-5'><div><p className='text-brand-mint-foreground text-xs uppercase tracking-wide'>Vị trí của bạn</p><p className='mt-1 font-semibold'>Ngoài top 50 · Sy Phungvan</p></div><div className='sm:text-right'><p className='font-bold text-primary text-lg'>2.095 XP</p><p className='text-muted-foreground text-xs'>Cần 355 XP để lên hạng</p></div></CardContent></Card>
        </div>

        <aside className='flex flex-col gap-4 xl:w-[32%]'>
          <div className='flex items-center gap-2'><Trophy className='size-5 text-brand-orange' /><h2 className='font-bold text-xl'>Đại sảnh danh vọng</h2></div>
          <Card className='bg-brand-orange/10 border-brand-orange/40'><CardContent className='p-5'><p className='font-semibold text-brand-orange text-xs uppercase'>Bậc thầy tri thức</p><div className='flex items-center gap-3 mt-4'><span className='flex items-center justify-center bg-brand-orange rounded-full size-11 font-bold text-primary-foreground'>TT</span><div><p className='font-bold'>Thuấn Trần Hữu</p><p className='font-bold text-primary'>128.068 XP</p></div></div></CardContent></Card>
          <Card className='bg-brand-pink/10 border-brand-pink/40'><CardContent className='p-5'><p className='font-semibold text-brand-pink text-xs uppercase'>Huyền thoại không nghỉ</p><div className='flex items-center gap-3 mt-4'><span className='flex items-center justify-center bg-brand-pink rounded-full size-11 font-bold text-primary-foreground'>N</span><div><p className='font-bold'>Ngọc Nguyễn</p><p className='font-bold text-primary'>149 ngày</p></div></div></CardContent></Card>
          <Card className='bg-brand-mint/20 border-brand-mint'><CardContent className='p-5'><p className='font-semibold text-brand-mint-foreground text-xs uppercase'>Đại sứ lan tỏa</p><div className='flex items-center gap-3 mt-4'><span className='flex items-center justify-center bg-brand-mint rounded-full size-11 font-bold text-brand-mint-foreground'>M</span><div><p className='font-bold'>Minh Trương</p><p className='font-bold text-primary'>2.254 bạn</p></div></div></CardContent></Card>
          <Card><CardHeader className='flex flex-row justify-between items-center pb-3'><CardTitle className='flex items-center gap-2 text-base'><Activity className='size-4 text-brand-mint-foreground' /> Hoạt động học tập</CardTitle><MoreHorizontal className='size-4 text-muted-foreground' /></CardHeader><CardContent className='flex flex-col gap-2'>{activities.map(([name, action, tag, Icon], index) => { const ActivityIcon = Icon as typeof Sparkles; return <div key={index} className='flex items-start gap-3 bg-secondary/50 p-3 rounded-xl text-sm'><ActivityIcon className='mt-0.5 size-4 text-brand-purple shrink-0' /><p><span className='font-semibold'>{name}</span>{action && ` ${action}`}<span className='block mt-0.5 text-muted-foreground text-xs'>{tag} · {index + 1} phút trước</span></p></div>; })}</CardContent></Card>
        </aside>
      </div>
    </section>
  );
}
