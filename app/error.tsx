"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] App error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-sm md:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-pink/20">
          <AlertTriangle className="h-9 w-9 text-brand-pink" aria-hidden="true" />
        </div>
        <h1 className="text-balance text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          An unexpected error occurred while loading this page. You can try again, and if the
          problem continues, come back a little later.
        </p>
        {error.digest ? (
          <p className="mt-4 rounded-lg bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  )
}
