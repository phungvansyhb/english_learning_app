import Image from "next/image"
import { Bell } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Content management
        </p>
        <h2 className="text-lg font-bold text-foreground">Vocabulary library</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-11 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-5" />
        </button>
        <div className="flex items-center gap-3 rounded-full bg-card py-1 pl-1 pr-4">
          <span className="overflow-hidden rounded-full ring-2 ring-brand-orange">
            <Image
              src="/avatars/user.png"
              alt="Admin profile"
              width={40}
              height={40}
              className="size-10 object-cover"
            />
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-semibold text-foreground">Admin</span>
            <span className="block text-xs text-muted-foreground">Editor</span>
          </div>
        </div>
      </div>
    </header>
  )
}
