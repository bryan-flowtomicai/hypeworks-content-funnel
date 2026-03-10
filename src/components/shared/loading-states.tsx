export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--brand)]" />
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  )
}
