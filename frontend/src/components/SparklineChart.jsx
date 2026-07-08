export default function SparklineChart({ data, width = 100, height = 48 }) {
  if (!data || data.length === 0) return null

  // 单条数据时，模拟从0到当前值的趋势（与多条数据统一风格）
  const displayData = data.length === 1 ? [0, data[0]] : data

  const max = Math.max(...displayData, 1)
  const min = Math.min(...displayData)
  const range = max - min || 1

  const points = displayData.map((value, i) => {
    const x = (i / (displayData.length - 1)) * width
    const y = height - 4 - ((value - min) / range) * (height - 8)
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${height} ${points} ${width},${height}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-text-star-gain)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-text-star-gain)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline
        fill="url(#sparkGrad)"
        stroke="none"
        points={areaPoints}
      />
      <polyline
        fill="none"
        stroke="var(--color-text-star-gain)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}