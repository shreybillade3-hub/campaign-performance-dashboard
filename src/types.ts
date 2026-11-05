export type Channel = 'Sponsored Search' | 'Display' | 'Social'

export interface Campaign {
  id: string
  name: string
  channel: Channel
}

export interface DailyRow {
  campaignId: string
  date: string // YYYY-MM-DD
  impressions: number
  clicks: number
  spend: number
  revenue: number
}

export interface Totals {
  impressions: number
  clicks: number
  spend: number
  revenue: number
}

export interface CampaignStat extends Totals {
  id: string
  name: string
  channel: Channel
  roas: number
  ctr: number
}

export type SortKey = 'name' | 'channel' | 'spend' | 'revenue' | 'roas' | 'ctr'
export type SortDir = 'asc' | 'desc'
export type RangeDays = 7 | 14 | 30
