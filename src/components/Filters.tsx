import type { Channel, RangeDays } from '../types'

interface Props {
  range: RangeDays
  onRange: (range: RangeDays) => void
  channel: Channel | 'All'
  onChannel: (channel: Channel | 'All') => void
  channels: Channel[]
  search: string
  onSearch: (value: string) => void
}

const ranges: RangeDays[] = [7, 14, 30]
const field =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 focus-visible:outline-2 focus-visible:outline-brand-500'

export default function Filters({ range, onRange, channel, onChannel, channels, search, onSearch }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="group" aria-label="Date range" className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
        {ranges.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={range === r}
            onClick={() => onRange(r)}
            className={`px-3 py-2 text-sm font-medium ${
              range === r ? 'bg-brand-600 text-white' : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800'
            }`}
          >
            {r}D
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 dark:text-slate-400">Channel</span>
        <select className={field} value={channel} onChange={(e) => onChannel(e.target.value as Channel | 'All')}>
          <option value="All">All channels</option>
          {channels.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <input
        type="search"
        className={`${field} min-w-52 flex-1 sm:flex-none`}
        placeholder="Search campaigns"
        aria-label="Search campaigns"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
