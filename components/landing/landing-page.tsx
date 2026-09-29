'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, BookOpen, Brain, Flame, Mail, Sparkles, Trophy, Volume2 } from 'lucide-react';

const features = [
  { number: '01', title: 'Học vừa đủ', text: 'Bài học ngắn, rõ ràng để bạn duy trì nhịp học mỗi ngày.', color: 'bg-brand-pink', icon: BookOpen },
  { number: '02', title: 'Luyện đúng điểm yếu', text: 'Tập trung vào từ vựng, ngữ pháp và kỹ năng bạn cần nhất.', color: 'bg-brand-orange', icon: Brain },
  { number: '03', title: 'Thấy mình tiến bộ', text: 'Theo dõi hành trình và biến mỗi phiên học thành động lực mới.', color: 'bg-brand-mint', icon: Trophy },
];

const screens = [
  { image: '/images/landing-hero-image-1.png', label: '01 / Grammar library', title: 'Nắm chắc nền tảng', text: 'Khám phá danh sách chủ đề ngữ pháp được sắp xếp rõ ràng, dễ tìm và vừa sức với trình độ của bạn.' },
  { image: '/images/landing-hero-image-2.png', label: '02 / Vocabulary', title: 'Từ mới ở lại lâu hơn', text: 'Mở rộng vốn từ theo chủ đề, nghe phát âm và ôn tập đúng lúc để nhớ tự nhiên hơn mỗi ngày.' },
  { image: '/images/landing-hero-image-3.png', label: '03 / Leaderboard', title: 'Học cùng một cộng đồng', text: 'Theo dõi bảng xếp hạng, giữ streak và biến từng bước tiến nhỏ thành động lực lớn.' },
];

const reveal = { hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0 } };
const spring = { type: 'spring' as const, stiffness: 90, damping: 20 };

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);

  return (
    <main className='min-h-screen overflow-hidden bg-background text-foreground'>
      <motion.div className='fixed left-0 top-0 z-50 h-1 bg-brand-pink' style={{ width: progress }} aria-hidden='true' />
      <section className='relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16'>
        <div aria-hidden='true' className='pointer-events-none absolute -left-24 top-44 h-72 w-72 rounded-full bg-brand-pink/20 blur-3xl animate-landing-drift' />
        <div aria-hidden='true' className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl animate-landing-drift [animation-delay:1.4s]' />
        <header className='relative z-10 flex items-center justify-between'>
          <Link href='/' className='text-xl font-extrabold tracking-[-0.06em]'>Lingua<span className='text-brand-pink'>.</span></Link>
          <nav className='hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex'>
            <a href='#story' className='transition-colors hover:text-foreground'>Hành trình</a>
            <a href='#features' className='transition-colors hover:text-foreground'>Tính năng</a>
            <a href='#contact' className='transition-colors hover:text-foreground'>Liên hệ</a>
          </nav>
          <Link href='/login' className='rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5'>Đăng nhập</Link>
        </header>

        <div className='relative grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1fr_0.85fr] lg:py-16'>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...spring, delay: 0.12 }}>
            <p className='mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-sm'><Sparkles className='h-3.5 w-3.5 text-brand-orange' /> English, but make it yours</p>
            <h1 className='max-w-3xl text-6xl font-extrabold leading-[0.94] tracking-[-0.08em] sm:text-8xl'>Mỗi ngày một bước <span className='text-brand-pink'>gần hơn</span> với tiếng Anh.</h1>
            <p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>Một không gian học tập nhẹ nhàng, thông minh và đủ thú vị để bạn muốn quay lại mỗi ngày.</p>
            <div className='mt-10 flex flex-wrap items-center gap-4'><Link href='/signup' className='rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-1'>Bắt đầu miễn phí <ArrowUpRight className='ml-1 inline h-4 w-4' /></Link><a href='#story' className='rounded-full border border-foreground/15 px-7 py-4 text-sm font-bold transition-colors hover:bg-card'>Khám phá thêm</a></div>
            <div className='mt-14 flex items-center gap-8 text-sm text-muted-foreground'><span className='flex items-center gap-2'><BookOpen className='h-4 w-4 text-brand-pink' /> 4 kỹ năng</span><span className='flex items-center gap-2'><Flame className='h-4 w-4 text-brand-orange' /> Học mỗi ngày</span></div>
          </motion.div>
          <motion.div className='relative mx-auto w-full max-w-[520px]' style={reduceMotion ? undefined : { y: heroY }} initial={{ opacity: 0, scale: 0.94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ ...spring, delay: 0.28 }}>
            <div className='absolute -right-4 top-8 h-40 w-40 rounded-full bg-brand-orange/60 blur-2xl animate-landing-drift' />
            <motion.div className='relative rounded-[2.5rem] border border-white/70 bg-primary p-3 shadow-2xl shadow-primary/25' animate={reduceMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><Image src='/images/landing-hero-image-1.png' alt='Danh sách chủ đề ngữ pháp trong Lingua' width={1244} height={645} className='rounded-[2rem] object-cover' priority /></motion.div>
            <div className='absolute -bottom-6 -left-5 rounded-2xl bg-brand-mint px-5 py-4 text-sm font-bold text-brand-mint-foreground shadow-xl'>Small steps.<br />Big changes.</div>
          </motion.div>
        </div>
        <a href='#story' className='group flex items-center gap-3 border-t border-foreground/10 py-6 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground'><span className='flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 transition-transform group-hover:translate-y-1'><ArrowDown className='h-4 w-4' /></span> Cuộn để khám phá</a>
      </section>

      <section id='story' className='bg-primary px-6 py-28 text-primary-foreground sm:px-10 lg:px-16'><motion.div className='mx-auto max-w-7xl' initial='hidden' whileInView='visible' viewport={{ once: true, amount: 0.35 }} variants={reveal} transition={spring}><p className='text-sm font-bold uppercase tracking-[0.18em] text-brand-orange'>Một hành trình rõ ràng</p><h2 className='mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.06em] sm:text-7xl'>Không học nhiều hơn.<br /><span className='text-brand-orange'>Học tốt hơn.</span></h2><p className='mt-8 max-w-xl text-lg leading-8 text-primary-foreground/65'>Lingua biến những mục tiêu lớn thành những phiên học nhỏ, vừa sức và có thể duy trì.</p></motion.div></section>

      <section className='mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16'>{screens.map((screen, index) => <motion.article key={screen.image} className='grid items-center gap-10 border-b border-foreground/10 py-16 first:pt-0 last:border-0 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20' initial='hidden' whileInView='visible' viewport={{ once: true, amount: 0.2 }} variants={reveal} transition={{ ...spring, delay: index * 0.08 }}><div className={index % 2 === 1 ? 'lg:order-2' : ''}><p className='text-xs font-bold uppercase tracking-[0.18em] text-brand-pink'>{screen.label}</p><h3 className='mt-5 text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl'>{screen.title}</h3><p className='mt-5 max-w-md text-lg leading-8 text-muted-foreground'>{screen.text}</p></div><motion.div className={index % 2 === 1 ? 'lg:order-1' : ''} whileHover={{ y: -8 }} transition={spring}><div className='overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-secondary p-2 shadow-xl'><Image src={screen.image} alt={screen.title} width={1244} height={645} className='h-auto w-full rounded-[1rem]' /></div></motion.div></motion.article>)}</section>

      <section id='features' className='bg-secondary/60 px-6 py-24 sm:px-10 lg:px-16'><div className='mx-auto max-w-7xl'><div className='mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end'><div><p className='text-sm font-bold uppercase tracking-[0.18em] text-brand-pink'>Vì sao Lingua?</p><h2 className='mt-4 text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl'>Học theo cách<br />của bạn.</h2></div><Brain className='hidden h-16 w-16 text-brand-orange sm:block' /></div><div className='grid gap-5 md:grid-cols-3'>{features.map((feature, index) => { const Icon = feature.icon; return <motion.article key={feature.number} className='group rounded-3xl border border-foreground/10 bg-card p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10' initial='hidden' whileInView='visible' viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ ...spring, delay: index * 0.1 }} whileHover={{ y: -8 }}><div className='flex items-center justify-between'><p className='text-sm font-bold text-brand-pink'>{feature.number}</p><Icon className='h-5 w-5 text-brand-orange' /></div><h3 className='mt-14 text-2xl font-extrabold tracking-[-0.04em]'>{feature.title}</h3><p className='mt-4 leading-7 text-muted-foreground'>{feature.text}</p><div className={`mt-8 h-1 w-10 rounded-full ${feature.color} transition-all duration-300 group-hover:w-20`} /></motion.article>; })}</div></div></section>

      <section id='contact' className='px-6 py-24 sm:px-10 lg:px-16'><motion.div className='mx-auto grid max-w-7xl gap-12 rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-12 lg:grid-cols-[1fr_0.8fr] lg:p-16' initial='hidden' whileInView='visible' viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={spring}><div><p className='text-sm font-bold uppercase tracking-[0.18em] text-brand-orange'>Luôn sẵn sàng lắng nghe</p><h2 className='mt-5 max-w-xl text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl'>Có điều muốn nói với Lingua?</h2><p className='mt-6 max-w-lg text-lg leading-8 text-primary-foreground/65'>Gửi cho chúng mình một lời nhắn. Mọi góp ý đều giúp trải nghiệm học tiếng Anh trở nên tốt hơn.</p></div><div className='flex flex-col justify-center gap-4'><a href='mailto:hello@lingua.app' className='flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-5 transition-colors hover:bg-primary-foreground/15'><Mail className='h-6 w-6 text-brand-orange' /><span><span className='block text-xs uppercase tracking-widest text-primary-foreground/50'>Email</span><span className='font-bold'>hello@lingua.app</span></span><ArrowUpRight className='ml-auto h-5 w-5' /></a><a href='tel:+84000000000' className='flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-5 transition-colors hover:bg-primary-foreground/15'><Volume2 className='h-6 w-6 text-brand-pink' /><span><span className='block text-xs uppercase tracking-widest text-primary-foreground/50'>Hỗ trợ</span><span className='font-bold'>Liên hệ với đội ngũ Lingua</span></span><ArrowUpRight className='ml-auto h-5 w-5' /></a></div></motion.div></section>

      <footer className='mx-auto flex max-w-7xl flex-col gap-4 border-t border-foreground/10 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16'><span className='font-extrabold text-foreground'>Lingua<span className='text-brand-pink'>.</span></span><span>Học một chút. Tốt hơn mỗi ngày.</span></footer>
    </main>
  );
}

export default LandingPage;
