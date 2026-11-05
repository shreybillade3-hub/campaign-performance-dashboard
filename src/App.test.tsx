import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'
import App from './App'

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('App', () => {
  it('renders KPIs and the campaign table', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /campaign performance dashboard/i })).toBeInTheDocument()
    expect(screen.getAllByText(/vs previous period/)).toHaveLength(4)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('filters campaigns by search text', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox', { name: /search campaigns/i }), 'grocery')
    const table = screen.getByRole('table')
    expect(within(table).getByText('Grocery Staples Promo')).toBeInTheDocument()
    expect(within(table).queryByText('Summer Electronics Sale')).not.toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('searchbox', { name: /search campaigns/i }), 'zzzz')
    expect(screen.getByText(/no campaigns match/i)).toBeInTheDocument()
  })

  it('toggles dark mode', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /switch to/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
