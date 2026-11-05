import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMoney } from '../lib/metrics'

interface Props {
  data: { date: string; spend: number; revenue: number }[]
}

export default function TrendChart({ data }: Props) {
  return (
    <section aria-labelledby="trend-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 id="trend-title" className="mb-3 text-base font-semibold">
        Spend vs revenue
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b822" />
            <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} tick={{ fontSize: 12 }} minTickGap={24} />
            <YAxis tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} width={48} />
            <Tooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ borderRadius: 8 }} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#5b5ff0" fill="#5b5ff033" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="spend" name="Spend" stroke="#f59e0b" fill="#f59e0b22" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
