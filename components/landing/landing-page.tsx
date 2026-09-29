import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BookOpen, Brain, Flame, Sparkles } from 'lucide-react';

const features = [
  { number: '01', title: 'Học vừa đủ', text: 'Bài học ngắn, rõ ràng để bạn duy trì nhịp học mỗi ngày.', color: 'bg-brand-pink' },
  { number: '02', title: 'Luyện đúng điểm yếu', text: 'Tập trung vào từ vựng, ngữ pháp và kỹ năng bạn cần nhất.', color: 'bg-brand-orange' },
  { number: '03', title: 'Thấy mình tiến bộ', text: 'Theo dõi hành trình và biến mỗi phiên học thành động lực mới.', color: 'bg-brand-mint' },
];

const screens = [
  { image: '/images/landing-hero-image-1.png', label: '01 / Grammar library', title: 'Nắm chắc nền tảng', text: 'Tìm bài học phù hợp với trình độ và học theo tốc độ của riêng bạn.' },
  { image: '/images/landing-hero-image-2.png', label: '02 / Practice daily', title: 'Biến kiến thức thành phản xạ', text: 'Luyện nghe, nói và trả lời trong những phiên học tập trung, nhẹ nhàng.' },
  { image: '/images/landing-hero-image-4.png', label: '03 / Vocabulary', title: 'Từ mới ở lại lâu hơn', text: 'Xây dựng vốn từ theo chủ đề và ôn tập đúng lúc để nhớ tự nhiên.' },
];

export function LandingPage() {
  return (
    <main className='min-h-screen overflow-hidden bg-background text-foreground'>
      <section className='relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16'>
        <div aria-hidden='true' className='pointer-events-none absolute -left-24 top-44 h-72 w-72 rounded-full bg-brand-pink/20 blur-3xl animate-landing-drift' />
        <div aria-hidden='true' className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl animate-landing-drift [animation-delay:1.4s]' />
        <header className='relative z-10 flex items-center justify-between animate-landing-rise'>
          <Link href='/' className='text-xl font-extrabold tracking-[-0.06em]'>Lingua<span className='text-brand-pink'>.</span></Link>
          <nav className='hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex'>
            <a href='#story' className='transition-colors hover:text-foreground'>Hành trình</a>
            <a href='#features' className='transition-colors hover:text-foreground'>Tính năng</a>
          </nav>
          <Link href='/login' className='rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5'>Đăng nhập</Link>
        </header>

        <div className='relative grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1fr_0.85fr] lg:py-16'>
          <div className='relative z-10 animate-landing-rise [animation-delay:120ms]'>
            <p className='mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-sm'><Sparkles className='h-3.5 w-3.5 text-brand-orange' /> English, but make it yours</p>
            <h1 className='max-w-3xl text-6xl font-extrabold leading-[0.94] tracking-[-0.08em] sm:text-8xl'>Mỗi ngày một bước <span className='text-brand-pink'>gần hơn</span> với tiếng Anh.</h1>
            <p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>Một không gian học tập nhẹ nhàng, thông minh và đủ thú vị để bạn muốn quay lại mỗi ngày.</p>
            <div className='mt-10 flex flex-wrap items-center gap-4'><Link href='/signup' className='rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-1'>Bắt đầu miễn phí <ArrowUpRight className='ml-1 inline h-4 w-4' /></Link><a href='#story' className='rounded-full border border-foreground/15 px-7 py-4 text-sm font-bold transition-colors hover:bg-card'>Khám phá thêm</a></div>
            <div className='mt-14 flex items-center gap-8 text-sm text-muted-foreground'><span className='flex items-center gap-2'><BookOpen className='h-4 w-4 text-brand-pink' /> 4 kỹ năng</span><span className='flex items-center gap-2'><Flame className='h-4 w-4 text-brand-orange' /> Học mỗi ngày</span></div>
          </div>
          <div className='relative mx-auto w-full max-w-[520px] animate-landing-rise [animation-delay:260ms]'><div className='absolute -right-4 top-8 h-40 w-40 rounded-full bg-brand-orange/60 blur-2xl animate-landing-drift' /><div className='relative rounded-[2.5rem] border border-white/70 bg-primary p-3 shadow-2xl shadow-primary/25 animate-landing-float'><Image src='/images/landing-hero-image-2.png' alt='Giao diện luyện tập tiếng Anh của Lingua' width={1244} height={645} className='rounded-[2rem] object-cover' priority /></div><div className='absolute -bottom-6 -left-5 rounded-2xl bg-brand-mint px-5 py-4 text-sm font-bold text-brand-mint-foreground shadow-xl'>Small steps.<br />Big changes.</div></div>
        </div>
        <a href='#story' className='group flex items-center gap-3 border-t border-foreground/10 py-6 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground'><span className='flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 transition-transform group-hover:translate-y-1'><ArrowDown className='h-4 w-4' /></span> Cuộn để khám phá</a>
      </section>

      <section id='story' className='bg-primary px-6 py-28 text-primary-foreground sm:px-10 lg:px-16'><div className='mx-auto max-w-7xl'><p className='scroll-reveal text-sm font-bold uppercase tracking-[0.18em] text-brand-orange'>Một hành trình rõ ràng</p><h2 className='scroll-reveal mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.06em] sm:text-7xl'>Không học nhiều hơn.<br /><span className='text-brand-orange'>Học tốt hơn.</span></h2><p className='scroll-reveal mt-8 max-w-xl text-lg leading-8 text-primary-foreground/65'>Lingua biến những mục tiêu lớn thành những phiên học nhỏ, vừa sức và có thể duy trì.</p></div></section>

      <section className='mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16'>{screens.map((screen, index) => <article key={screen.image} className='scroll-reveal grid items-center gap-10 border-b border-foreground/10 py-16 first:pt-0 last:border-0 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20'><div className={index % 2 === 1 ? 'lg:order-2' : ''}><p className='text-xs font-bold uppercase tracking-[0.18em] text-brand-pink'>{screen.label}</p><h3 className='mt-5 text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl'>{screen.title}</h3><p className='mt-5 max-w-md text-lg leading-8 text-muted-foreground'>{screen.text}</p></div><div className={index % 2 === 1 ? 'lg:order-1' : ''}><div className='overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-secondary p-2 shadow-xl transition-transform duration-700 hover:-translate-y-2'><Image src={screen.image} alt={screen.title} width={1244} height={645} className='h-auto w-full rounded-[1rem]' /></div></div></article>)}</section>

      <section id='features' className='bg-secondary/60 px-6 py-24 sm:px-10 lg:px-16'><div className='mx-auto max-w-7xl'><div className='mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end'><div><p className='text-sm font-bold uppercase tracking-[0.18em] text-brand-pink'>Vì sao Lingua?</p><h2 className='mt-4 text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl'>Học theo cách<br />của bạn.</h2></div><Brain className='hidden h-16 w-16 text-brand-orange sm:block' /></div><div className='grid gap-5 md:grid-cols-3'>{features.map((feature, index) => <article key={feature.number} className='scroll-reveal group rounded-3xl border border-foreground/10 bg-card p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10' style={{ animationDelay: `${index * 100}ms` }}><p className='text-sm font-bold text-brand-pink'>{feature.number}</p><h3 className='mt-14 text-2xl font-extrabold tracking-[-0.04em]'>{feature.title}</h3><p className='mt-4 leading-7 text-muted-foreground'>{feature.text}</p><div className={`mt-8 h-1 w-10 rounded-full ${feature.color} transition-all duration-300 group-hover:w-20`} /></article>)}</div></div></section>
      <footer className='mx-auto flex max-w-7xl flex-col gap-4 border-t border-foreground/10 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16'><span className='font-extrabold text-foreground'>Lingua<span className='text-brand-pink'>.</span></span><span>Học một chút. Tốt hơn mỗi ngày.</span></footer>
    </main>
  );
}

export default LandingPage;
