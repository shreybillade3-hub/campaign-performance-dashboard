import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CampaignStat } from '../types'
import CampaignTable from './CampaignTable'

const make = (n: number): CampaignStat => ({
  id: `c${n}`,
  name: `Campaign ${n}`,
  channel: 'Display',
  impressions: 1000,
  clicks: 10,
  spend: 100,
  revenue: 300,
  roas: 3,
  ctr: 1,
})

describe('CampaignTable', () => {
  it('shows an empty state', () => {
    render(<CampaignTable stats={[]} sortKey="revenue" sortDir="desc" onSort={() => {}} />)
    expect(screen.getByText(/no campaigns match/i)).toBeInTheDocument()
  })

  it('paginates rows', async () => {
    const stats = Array.from({ length: 7 }, (_, i) => make(i + 1))
    render(<CampaignTable stats={stats} sortKey="revenue" sortDir="desc" onSort={() => {}} pageSize={5} />)
    expect(screen.getByText('Campaign 1')).toBeInTheDocument()
    expect(screen.queryByText('Campaign 6')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Campaign 6')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
  })

  it('calls onSort and exposes aria-sort', async () => {
    const onSort = vi.fn()
    render(<CampaignTable stats={[make(1)]} sortKey="revenue" sortDir="desc" onSort={onSort} />)
    expect(screen.getByRole('columnheader', { name: /revenue/i })).toHaveAttribute('aria-sort', 'descending')
    await userEvent.click(screen.getByRole('button', { name: /roas/i }))
    expect(onSort).toHaveBeenCalledWith('roas')
  })
})
