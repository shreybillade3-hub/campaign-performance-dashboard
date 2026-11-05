import type { Campaign, DailyRow } from '../types'

/**
 * Sample dataset. Values are generated locally with a seeded random number
 * generator so the dashboard is deterministic. It does not represent any real
 * advertiser or retailer.
 */
export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Summer Electronics Sale', channel: 'Sponsored Search' },
  { id: 'c2', name: 'Back to School Banners', channel: 'Display' },
  { id: 'c3', name: 'Home Essentials Push', channel: 'Sponsored Search' },
  { id: 'c4', name: 'Festive Fashion Launch', channel: 'Social' },
  { id: 'c5', name: 'Grocery Staples Promo', channel: 'Display' },
  { id: 'c6', name: 'Beauty Brand Spotlight', channel: 'Social' },
  { id: 'c7', name: 'Appliance Clearance', channel: 'Sponsored Search' },
  { id: 'c8', name: 'Toys and Games Spotlight', channel: 'Display' },
]

export const DATA_END_DATE = '2026-10-31'
export const DATA_DAYS = 60

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const profile = {
  'Sponsored Search': { cpm: 9, ctr: 0.022, rpc: 1.7 },
  Display: { cpm: 4.5, ctr: 0.011, rpc: 1.0 },
  Social: { cpm: 6.5, ctr: 0.016, rpc: 1.15 },
} as const

export function generateRows(list: Campaign[] = campaigns): DailyRow[] {
  const rows: DailyRow[] = []
  const end = new Date(`${DATA_END_DATE}T00:00:00Z`)
  list.forEach((campaign, index) => {
    const rand = mulberry32(1000 + index * 97)
    const p = profile[campaign.channel]
    const scale = 0.7 + rand() * 0.9
    for (let d = DATA_DAYS - 1; d >= 0; d--) {
      const day = new Date(end)
      day.setUTCDate(end.getUTCDate() - d)
      const weekend = [0, 6].includes(day.getUTCDay()) ? 1.15 : 1
      const impressions = Math.round((9000 + rand() * 6000) * scale * weekend)
      const clicks = Math.round(impressions * p.ctr * (0.85 + rand() * 0.3))
      const spend = Math.round((impressions / 1000) * p.cpm * (0.9 + rand() * 0.2))
      const revenue = Math.round(clicks * p.rpc * (0.8 + rand() * 0.4))
      rows.push({
        campaignId: campaign.id,
        date: day.toISOString().slice(0, 10),
        impressions,
        clicks,
        spend,
        revenue,
      })
    }
  })
  return rows
}

export const rows = generateRows()
