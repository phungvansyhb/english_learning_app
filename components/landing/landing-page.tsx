import Link from 'next/link';

const features = [
  { number: '01', title: 'Học vừa đủ', text: 'Bài học ngắn, rõ ràng để bạn duy trì nhịp học mỗi ngày.' },
  { number: '02', title: 'Luyện đúng điểm yếu', text: 'Tập trung vào từ vựng, ngữ pháp và kỹ năng bạn cần nhất.' },
  { number: '03', title: 'Thấy mình tiến bộ', text: 'Theo dõi hành trình và biến mỗi phiên học thành động lực mới.' },
];

export function LandingPage() {
  return (
    <main className='min-h-screen overflow-hidden bg-secondary/40 text-foreground'>
      <section className='relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16'>
        <div aria-hidden='true' className='pointer-events-none absolute -left-24 top-32 h-64 w-64 rounded-full bg-brand-pink/20 blur-3xl animate-landing-drift' />
        <div aria-hidden='true' className='pointer-events-none absolute right-0 top-16 h-48 w-48 rounded-full bg-brand-orange/25 blur-3xl animate-landing-drift [animation-delay:1.4s]' />
        <header className='relative flex items-center justify-between animate-landing-rise'>
          <Link href='/' className='text-xl font-extrabold tracking-[-0.06em]'>Lingua<span className='text-brand-pink'>.</span></Link>
          <nav className='hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex'>
            <a href='#why-lingua' className='transition-colors hover:text-foreground'>Vì sao Lingua</a>
            <a href='#features' className='transition-colors hover:text-foreground'>Tính năng</a>
          </nav>
          <Link href='/login' className='rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5'>Đăng nhập</Link>
        </header>

        <div className='grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-16'>
          <div className='relative animate-landing-rise [animation-delay:120ms]'>
            <p className='mb-7 inline-flex rounded-full border border-foreground/15 bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] shadow-sm'>English, but make it yours</p>
            <h1 className='max-w-3xl text-6xl font-extrabold leading-[0.98] tracking-[-0.08em] sm:text-8xl'>Học tiếng Anh <span className='text-brand-pink'>theo cách</span> của bạn.</h1>
            <p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>Một không gian học tập nhẹ nhàng, thông minh và đủ thú vị để bạn muốn quay lại mỗi ngày.</p>
            <div className='mt-10 flex flex-wrap items-center gap-4'>
              <Link href='/register' className='rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-1'>Bắt đầu miễn phí <span aria-hidden='true'>→</span></Link>
              <a href='#features' className='rounded-full border border-foreground/15 px-7 py-4 text-sm font-bold transition-colors hover:bg-card'>Khám phá thêm</a>
            </div>
          </div>
          <div className='relative mx-auto w-full max-w-md animate-landing-rise [animation-delay:260ms]'>
            <div className='absolute -right-2 top-2 h-24 w-24 rounded-full bg-brand-orange blur-sm sm:-right-8 sm:top-0 animate-landing-drift' />
            <div className='relative rounded-[2.5rem] bg-primary p-5 shadow-2xl shadow-primary/25 animate-landing-float'>
              <div className='rounded-[2rem] bg-card p-6 sm:p-8'>
                <div className='mb-12 flex items-center justify-between text-xs font-bold text-muted-foreground'><span>HÔM NAY</span><span className='rounded-full bg-brand-mint px-3 py-1 text-brand-mint-foreground'>+12 phút</span></div>
                <p className='text-sm font-semibold text-muted-foreground'>Từ vựng mới</p>
                <p className='mt-2 text-5xl font-extrabold tracking-[-0.08em]'>curious<span className='text-brand-pink'>?</span></p>
                <p className='mt-3 text-sm text-muted-foreground'>/ˈkjʊəriəs/ · tính từ</p>
                <div className='mt-10 rounded-2xl bg-brand-purple-soft p-4 text-sm font-semibold leading-6'>“Having a strong desire to know or learn something.”</div>
                <div className='mt-6 flex gap-2'><span className='h-2 flex-1 rounded-full bg-brand-pink' /><span className='h-2 flex-1 rounded-full bg-brand-pink' /><span className='h-2 flex-1 rounded-full bg-border' /><span className='h-2 flex-1 rounded-full bg-border' /></div>
              </div>
            </div>
            <div className='absolute -bottom-8 -left-8 rounded-2xl bg-brand-mint px-5 py-4 text-sm font-bold text-brand-mint-foreground shadow-xl'>Small steps.<br />Big changes.</div>
          </div>
        </div>
        <div className='border-t border-foreground/10 py-6 text-sm font-semibold text-muted-foreground'>Hơn 4 kỹ năng · 1 hành trình của riêng bạn</div>
      </section>

      <section id='why-lingua' className='bg-primary px-6 py-24 text-primary-foreground sm:px-10 lg:px-16'>
        <div className='mx-auto max-w-7xl'><p className='text-sm font-bold uppercase tracking-[0.18em] text-brand-orange'>Tại sao Lingua?</p><h2 className='mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl'>Không học nhiều hơn. Học <span className='text-brand-orange'>tốt hơn.</span></h2></div>
      </section>
      <section id='features' className='mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16'><div className='grid gap-5 md:grid-cols-3'>{features.map((feature, index) => <article key={feature.number} className='group rounded-3xl border border-foreground/10 bg-card p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 animate-landing-rise' style={{ animationDelay: `${360 + index * 120}ms` }}><p className='text-sm font-bold text-brand-pink transition-transform duration-300 group-hover:translate-x-1'>{feature.number}</p><h3 className='mt-14 text-2xl font-extrabold tracking-[-0.04em]'>{feature.title}</h3><p className='mt-4 leading-7 text-muted-foreground'>{feature.text}</p><div className='mt-8 h-1 w-10 rounded-full bg-brand-orange transition-all duration-300 group-hover:w-20' /></article>)}</div></section>
      <footer className='mx-auto flex max-w-7xl flex-col gap-4 border-t border-foreground/10 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16'><span className='font-extrabold text-foreground'>Lingua<span className='text-brand-pink'>.</span></span><span>Học một chút. Tốt hơn mỗi ngày.</span></footer>
    </main>
  );
}

export default LandingPage;
