import { ArticlesSection } from '@/components/dashboard/home/articles-section';
import { CalendarCard } from '@/components/dashboard/home/calendar-card';
import { ProgressSection } from '@/components/dashboard/home/progress-section';
import { DailyWordBanner } from '@/components/dashboard/home/dailyword-banner';
import { PerformanceAnalysis } from '@/components/dashboard/home/performance-analysis';

export default function DashboardPage() {
	return (
		<section>
			<div className='gap-6 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] mt-6'>
				{/* Left column */}
				<div className='flex flex-col gap-6'>
					<DailyWordBanner />
					<ProgressSection />
					<ArticlesSection />
				</div>

				{/* Right column */}
				<div className='flex flex-col gap-6'>
					<CalendarCard />
					<PerformanceAnalysis />
				</div>
			</div>
		</section>
	);
}
