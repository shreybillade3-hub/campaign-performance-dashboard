import { describe, expect, it } from 'vitest'
import { statsToCsv } from './csv'

describe('statsToCsv', () => {
  it('writes a header and escapes commas and quotes', () => {
    const csv = statsToCsv([
      { id: 'a', name: 'Sale, "Big"', channel: 'Display', impressions: 1000, clicks: 10, spend: 50, revenue: 200, roas: 4, ctr: 1 },
    ])
    const [header, line] = csv.split('\n')
    expect(header).toBe('Campaign,Channel,Impressions,Clicks,Spend,Revenue,ROAS,CTR %')
    expect(line).toBe('"Sale, ""Big""",Display,1000,10,50,200,4.00,1.00')
  })
})
