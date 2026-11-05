import { useMemo, useState } from 'react'
import CampaignTable from './components/CampaignTable'
import Filters from './components/Filters'
import KpiCard from './components/KpiCard'
import RoasChart from './components/RoasChart'
import ThemeToggle from './components/ThemeToggle'
import TrendChart from './components/TrendChart'
import { campaigns, DATA_END_DATE, rows } from './data/campaigns'
import useTheme from './hooks/useTheme'
import { downloadCsv, statsToCsv } from './lib/csv'
import {
  buildCampaignStats,
  ctr,
  dailyTrend,
  formatMoney,
  formatNumber,
  formatPercent,
  percentChange,
  roas,
  sortStats,
  sumRows,
  windowRows,
} from './lib/metrics'
import type { Channel, RangeDays, SortDir, SortKey } from './types'

const channels = [...new Set(campaigns.map((c) => c.channel))] as Channel[]

export default function App() {
  const { theme, toggle } = useTheme()
  const [range, setRange] = useState<RangeDays>(30)
  const [channel, setChannel] = useState<Channel | 'All'>('All')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('revenue')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const visibleCampaigns = useMemo(
    () =>
      campaigns.filter(
        (c) =>
          (channel === 'All' || c.channel === channel) && c.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [channel, search],
  )

  const { current, previous } = useMemo(() => {
    const ids = new Set(visibleCampaigns.map((c) => c.id))
    const scoped = rows.filter((r) => ids.has(r.campaignId))
    return {
      current: windowRows(scoped, DATA_END_DATE, range),
      previous: windowRows(scoped, DATA_END_DATE, range, 1),
    }
  }, [visibleCampaigns, range])

  const now = useMemo(() => sumRows(current), [current])
  const before = useMemo(() => sumRows(previous), [previous])
  const stats = useMemo(
    () => sortStats(buildCampaignStats(current, visibleCampaigns), sortKey, sortDir),
    [current, visibleCampaigns, sortKey, sortDir],
  )
  const trend = useMemo(() => dailyTrend(current), [current])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'channel' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaign Performance Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sample retail media data, last {range} days ending {DATA_END_DATE}
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <div className="mt-5">
        <Filters
          range={range}
          onRange={setRange}
          channel={channel}
          onChannel={setChannel}
          channels={channels}
          search={search}
          onSearch={setSearch}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Spend" value={formatMoney(now.spend)} change={percentChange(now.spend, before.spend)} neutral />
        <KpiCard label="Revenue" value={formatMoney(now.revenue)} change={percentChange(now.revenue, before.revenue)} />
        <KpiCard label="ROAS" value={`${roas(now).toFixed(2)}x`} change={percentChange(roas(now), roas(before))} />
        <KpiCard label="CTR" value={formatPercent(ctr(now))} change={percentChange(ctr(now), ctr(before))} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TrendChart data={trend} />
        </div>
        <div className="lg:col-span-2">
          <RoasChart stats={stats} />
        </div>
      </div>

      <section aria-labelledby="table-title" className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="table-title" className="text-base font-semibold">
            Campaigns ({formatNumber(now.clicks)} clicks)
          </h2>
          <button
            type="button"
            onClick={() => downloadCsv(`campaigns-${range}d.csv`, statsToCsv(stats))}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Export CSV
          </button>
        </div>
        <CampaignTable stats={stats} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
      </section>
    </div>
  )
}
