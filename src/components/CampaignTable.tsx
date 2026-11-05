import { useState } from 'react'
import { formatMoney, formatNumber, formatPercent } from '../lib/metrics'
import type { CampaignStat, SortDir, SortKey } from '../types'

interface Props {
  stats: CampaignStat[]
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  pageSize?: number
}

const columns: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: 'name', label: 'Campaign', numeric: false },
  { key: 'channel', label: 'Channel', numeric: false },
  { key: 'spend', label: 'Spend', numeric: true },
  { key: 'revenue', label: 'Revenue', numeric: true },
  { key: 'roas', label: 'ROAS', numeric: true },
  { key: 'ctr', label: 'CTR', numeric: true },
]

export default function CampaignTable({ stats, sortKey, sortDir, onSort, pageSize = 5 }: Props) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(stats.length / pageSize))
  const current = Math.min(page, pages - 1)
  const visible = stats.slice(current * pageSize, current * pageSize + pageSize)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className={`px-3 py-2 ${c.numeric ? 'text-right' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => onSort(c.key)}
                    className="font-semibold hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
                  >
                    {c.label}
                    <span aria-hidden className="ml-1 text-xs">
                      {sortKey === c.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="px-3 py-2 font-medium">{s.name}</td>
                <td className="px-3 py-2">{s.channel}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatMoney(s.spend)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatMoney(s.revenue)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{s.roas.toFixed(2)}x</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatPercent(s.ctr)}</td>
              </tr>
            ))}
            {stats.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-500">
                  No campaigns match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          {formatNumber(stats.length)} campaign{stats.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </button>
          <span aria-live="polite">
            Page {current + 1} of {pages}
          </span>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
