interface Props {
  label: string
  value: string
  /** Percent change versus the previous period. null hides the badge. */
  change: number | null
  /** Show the change in a neutral color (for metrics that are not good or bad, like spend). */
  neutral?: boolean
}

export default function KpiCard({ label, value, change, neutral = false }: Props) {
  const good = change === null ? null : change >= 0
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {change !== null && (
        <p
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            neutral
              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              : good
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
          }`}
        >
          <span aria-hidden>{change >= 0 ? '▲' : '▼'}</span>
          {Math.abs(change).toFixed(1)}% vs previous period
        </p>
      )}
    </div>
  )
}
