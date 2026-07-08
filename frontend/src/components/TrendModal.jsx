import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const API_BASE = ''

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-[var(--color-text-primary)] font-semibold">
        {formatNumber(payload[0].value)} stars
      </p>
      {payload[0].payload.stars_today > 0 && (
        <p className="text-[var(--color-text-star-gain)]">
          +{formatNumber(payload[0].payload.stars_today)}
        </p>
      )}
    </div>
  )
}

export default function TrendModal({ repoId, repoName, period, onClose }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 根据周期设置不同的时间范围
  const getDays = () => {
    switch (period) {
      case 'weekly': return 180  // 近半年
      case 'monthly': return 365  // 近1年
      default: return 90  // daily: 近90天
    }
  }

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      setError(null)
      try {
        const days = getDays()
        const res = await fetch(`${API_BASE}/api/repo/${repoId}/history?period=${period}&days=${days}`)
        if (!res.ok) throw new Error('Failed to fetch history')
        const json = await res.json()
        setData(json.history || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (repoId) fetchHistory()
  }, [repoId, period])

  // 计算增量
  const chartData = data.map((item, index) => {
    const prevStars = index > 0 ? data[index - 1].stars : item.stars
    const delta = index > 0 ? item.stars - prevStars : 0
    return {
      date: item.date,
      stars: item.stars,
      stars_today: item.stars_today || delta,
      delta: delta
    }
  })

  const totalGain = chartData.length > 1
    ? chartData[chartData.length - 1].stars - chartData[0].stars
    : 0

  const getGainLabel = () => {
    switch (period) {
      case 'weekly': return '6m gain'
      case 'monthly': return '1y gain'
      default: return '90d gain'
    }
  }

  const getPeriodLabel = () => {
    switch (period) {
      case 'weekly': return 'last 6 months'
      case 'monthly': return 'last 1 year'
      default: return 'last 90 days'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {repoName}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Stars trend {getPeriodLabel()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-[var(--color-text-error)]">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              No historical data available yet.
              <p className="text-sm mt-2">Click "Refresh" to start collecting data.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">Current:</span>
                  <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {formatNumber(chartData[chartData.length - 1]?.stars || 0)}
                  </span>
                </div>
                {totalGain > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">{getGainLabel()}:</span>
                    <span className="text-lg font-semibold text-[var(--color-text-star-gain)]">
                      +{formatNumber(totalGain)}
                    </span>
                  </div>
                )}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                    stroke="var(--color-border)"
                    tickFormatter={(value) => value.slice(5)} // 显示 MM-DD
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                    stroke="var(--color-border)"
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="stars"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-accent)', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: 'var(--color-accent)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </div>
  )
}