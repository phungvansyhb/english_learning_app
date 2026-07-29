import { BookMarked, GraduationCap, MoreHorizontal, Droplet } from "lucide-react"

import { progressCourses } from "@/lib/data"
import type { ProgressCourse, ProgressTone } from "@/lib/types"
import { cn } from "@/lib/utils"

const toneStyles: Record<
  ProgressTone,
  { card: string; bar: string; track: string; icon: typeof Droplet }
> = {
  purple: {
    card: "bg-brand-purple text-accent-foreground",
    bar: "bg-primary",
    track: "bg-primary/15",
    icon: Droplet,
  },
  orange: {
    card: "bg-brand-orange text-primary",
    bar: "bg-primary",
    track: "bg-primary/15",
    icon: GraduationCap,
  },
  pink: {
    card: "bg-brand-pink text-primary",
    bar: "bg-primary",
    track: "bg-primary/15",
    icon: BookMarked,
  },
}

function ProgressCard({ course }: { course: ProgressCourse }) {
  const style = toneStyles[course.tone]
  const Icon = style.icon

  return (
    <article
      className={cn(
        "flex min-h-40 flex-col justify-between rounded-2xl p-4",
        style.card,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-card text-foreground">
          <Icon className="size-5" />
        </span>
        <button
          type="button"
          aria-label="Course options"
          className="text-current/60 transition-opacity hover:text-current"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      <h3 className="mt-4 text-pretty text-base font-semibold leading-snug">
        {course.title}
      </h3>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className={cn("h-1.5 w-full rounded-full", style.track)}>
          <div
            className={cn("h-full rounded-full", style.bar)}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </article>
  )
}

export function ProgressSection() {
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground">Your progress</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {progressCourses.map((course) => (
          <ProgressCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  )
}
