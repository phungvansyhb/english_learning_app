export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
          <span className="relative inline-flex h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-lg font-semibold text-foreground">Loading Lingua</p>
          <p className="text-sm text-muted-foreground">Getting your learning space ready…</p>
        </div>
      </div>
    </div>
  )
}
