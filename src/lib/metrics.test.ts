import { describe, expect, it } from 'vitest'
import type { DailyRow } from '../types'
import { buildCampaignStats, ctr, percentChange, roas, sortStats, sumRows, windowRows } from './metrics'

const row = (campaignId: string, date: string, spend: number, revenue: number): DailyRow => ({
  campaignId,
  date,
  impressions: 1000,
  clicks: 20,
  spend,
  revenue,
})

describe('metrics', () => {
  it('computes ROAS and guards against zero spend', () => {
    expect(roas({ spend: 100, revenue: 450 })).toBe(4.5)
    expect(roas({ spend: 0, revenue: 50 })).toBe(0)
  })

  it('computes CTR as a percentage', () => {
    expect(ctr({ impressions: 2000, clicks: 50 })).toBe(2.5)
    expect(ctr({ impressions: 0, clicks: 0 })).toBe(0)
  })

  it('sums rows', () => {
    const t = sumRows([row('a', '2026-10-30', 10, 40), row('a', '2026-10-31', 20, 60)])
    expect(t).toMatchObject({ spend: 30, revenue: 100, impressions: 2000, clicks: 40 })
  })

  it('returns null change when there is no baseline', () => {
    expect(percentChange(10, 0)).toBeNull()
    expect(percentChange(150, 100)).toBe(50)
    expect(percentChange(50, 100)).toBe(-50)
  })

  it('selects the current and previous window', () => {
    const rows = ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'].map((d) => row('a', d, 1, 1))
    expect(windowRows(rows, '2026-10-31', 2).map((r) => r.date)).toEqual(['2026-10-30', '2026-10-31'])
    expect(windowRows(rows, '2026-10-31', 2, 1).map((r) => r.date)).toEqual(['2026-10-28', '2026-10-29'])
  })

  it('builds per-campaign stats and sorts them', () => {
    const campaigns = [
      { id: 'a', name: 'Alpha', channel: 'Display' as const },
      { id: 'b', name: 'Beta', channel: 'Social' as const },
    ]
    const stats = buildCampaignStats([row('a', '2026-10-31', 10, 20), row('b', '2026-10-31', 10, 50)], campaigns)
    expect(sortStats(stats, 'roas', 'desc').map((s) => s.name)).toEqual(['Beta', 'Alpha'])
    expect(sortStats(stats, 'name', 'asc').map((s) => s.name)).toEqual(['Alpha', 'Beta'])
  })
})
