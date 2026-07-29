import { ArticlesSection } from "@/components/dashboard/articles-section"
import { CalendarCard } from "@/components/dashboard/calendar-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ProgressSection } from "@/components/dashboard/progress-section"
import { PromoBanner } from "@/components/dashboard/promo-banner"
import { UpcomingCourses } from "@/components/dashboard/upcoming-courses"

export default function DashboardPage() {
  return (
    <main className="p-4 md:p-6 lg:p-8 h-screen">
      <div className="flex bg-card mx-auto border rounded-[2rem] max-w-7xl h-full overflow-hidden">
        <DashboardSidebar />

        <div className="flex-1 bg-secondary/40 p-5 md:p-6 lg:p-8 pb-24 md:pb-6">
          <DashboardHeader />

          <div className="gap-6 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] mt-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              <PromoBanner />
              <ProgressSection />
              <ArticlesSection />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              <CalendarCard />
              <UpcomingCourses />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
