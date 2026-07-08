import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 shadow-[var(--shadow-tooltip)] text-sm border border-[var(--color-border)]"
      style={{ backgroundColor: 'var(--color-bg-surface)' }}
    >
      <p className="font-medium text-[var(--color-text-primary)]">{label}</p>
      <p className="text-[var(--color-text-accent)]">
        +{payload[0].value.toLocaleString()} stars
      </p>
    </div>
  )
}

export default function StarChart({ items }) {
  if (!items || items.length === 0) return null

  const data = items
    .filter((r) => r.stars_today > 0)
    .slice(0, 15)
    .map((repo) => ({
      name: repo.name.split('/')[1] || repo.name,
      stars: repo.stars_today,
    }))
    .reverse()

  if (data.length === 0) return null

  return (
    <div className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border)] p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">
        Stars Gained
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 28 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="var(--color-chart-grid)"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'var(--color-chart-axis)' }}
            stroke="var(--color-chart-axis)"
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 11, fill: 'var(--color-chart-axis)' }}
            stroke="var(--color-chart-axis)"
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="stars"
            fill="var(--color-chart-bar)"
            radius={[0, 4, 4, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
