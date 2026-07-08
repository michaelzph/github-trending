const periods = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'monthly', label: 'This Month' },
]

export default function PeriodTabs({ period, onChange }) {
  return (
    <nav role="tablist" className="flex items-center gap-2 flex-wrap">
      {periods.map((p) => {
        const isActive = period === p.key
        return (
          <button
            key={p.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(p.key)}
            className={
              isActive
                ? 'px-5 py-2 text-sm font-semibold rounded-lg shadow-sm bg-[var(--color-accent)] text-[var(--color-accent-foreground)] cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2'
                : 'px-5 py-2 text-sm font-medium rounded-lg bg-[var(--color-bg-badge)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2'
            }
          >
            {p.label}
          </button>
        )
      })}
    </nav>
  )
}
