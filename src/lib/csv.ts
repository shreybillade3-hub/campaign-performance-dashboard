import type { CampaignStat } from '../types'

const escapeCell = (value: string | number) => {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function statsToCsv(stats: CampaignStat[]): string {
  const header = ['Campaign', 'Channel', 'Impressions', 'Clicks', 'Spend', 'Revenue', 'ROAS', 'CTR %']
  const lines = stats.map((s) =>
    [s.name, s.channel, s.impressions, s.clicks, s.spend, s.revenue, s.roas.toFixed(2), s.ctr.toFixed(2)]
      .map(escapeCell)
      .join(','),
  )
  return [header.join(','), ...lines].join('\n')
}

export function downloadCsv(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
