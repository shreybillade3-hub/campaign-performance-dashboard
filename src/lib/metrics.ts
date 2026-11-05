import type { Campaign, CampaignStat, DailyRow, SortDir, SortKey, Totals } from '../types'

export const emptyTotals = (): Totals => ({ impressions: 0, clicks: 0, spend: 0, revenue: 0 })

export const roas = (t: Pick<Totals, 'spend' | 'revenue'>) => (t.spend === 0 ? 0 : t.revenue / t.spend)
export const ctr = (t: Pick<Totals, 'impressions' | 'clicks'>) =>
  t.impressions === 0 ? 0 : (t.clicks / t.impressions) * 100

export function sumRows(rows: DailyRow[]): Totals {
  return rows.reduce<Totals>((acc, r) => {
    acc.impressions += r.impressions
    acc.clicks += r.clicks
    acc.spend += r.spend
    acc.revenue += r.revenue
    return acc
  }, emptyTotals())
}

/** Returns the last `days` calendar days ending at `end` (inclusive), or the `days` before that when `offset` is 1. */
export function windowRows(rows: DailyRow[], end: string, days: number, offset = 0): DailyRow[] {
  const endDate = new Date(`${end}T00:00:00Z`)
  endDate.setUTCDate(endDate.getUTCDate() - days * offset)
  const startDate = new Date(endDate)
  startDate.setUTCDate(endDate.getUTCDate() - (days - 1))
  const from = startDate.toISOString().slice(0, 10)
  const to = endDate.toISOString().slice(0, 10)
  return rows.filter((r) => r.date >= from && r.date <= to)
}

/** Percentage change from `previous` to `current`. Returns null when there is no baseline. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function buildCampaignStats(rows: DailyRow[], campaigns: Campaign[]): CampaignStat[] {
  return campaigns
    .map((c) => {
      const totals = sumRows(rows.filter((r) => r.campaignId === c.id))
      return { ...c, ...totals, roas: roas(totals), ctr: ctr(totals) }
    })
    .filter((s) => s.impressions > 0)
}

export function sortStats(stats: CampaignStat[], key: SortKey, dir: SortDir): CampaignStat[] {
  const sign = dir === 'asc' ? 1 : -1
  return [...stats].sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * sign
  })
}

export function dailyTrend(rows: DailyRow[]) {
  const byDate = new Map<string, Totals>()
  for (const r of rows) {
    const t = byDate.get(r.date) ?? emptyTotals()
    t.spend += r.spend
    t.revenue += r.revenue
    t.clicks += r.clicks
    t.impressions += r.impressions
    byDate.set(r.date, t)
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, t]) => ({ date, spend: t.spend, revenue: t.revenue }))
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
export const formatMoney = (n: number) => usd.format(n)
export const formatNumber = (n: number) => n.toLocaleString('en-US')
export const formatPercent = (n: number, digits = 2) => `${n.toFixed(digits)}%`
