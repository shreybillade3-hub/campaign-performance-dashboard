import type { CampaignStat } from '../types'

interface Props {
  stats: CampaignStat[]
}

/** Horizontal bar list. Built with plain elements so it is accessible and easy to test. */
export default function RoasChart({ stats }: Props) {
  const ranked = [...stats].sort((a, b) => b.roas - a.roas)
  const max = Math.max(...ranked.map((s) => s.roas), 1)
  return (
    <section aria-labelledby="roas-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 id="roas-title" className="mb-3 text-base font-semibold">
        ROAS by campaign
      </h2>
      {ranked.length === 0 ? (
        <p className="text-sm text-slate-500">No campaigns to show.</p>
      ) : (
        <ul className="space-y-3">
          {ranked.map((s) => (
            <li key={s.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="truncate pr-2">{s.name}</span>
                <span className="font-medium tabular-nums">{s.roas.toFixed(2)}x</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" role="presentation">
                <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(s.roas / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
