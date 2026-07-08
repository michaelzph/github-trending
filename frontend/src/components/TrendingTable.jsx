const LANGUAGE_COLORS = {
  JavaScript:      '#f1e05a',
  TypeScript:      '#3178c6',
  Python:          '#3572A5',
  Java:            '#b07219',
  Go:              '#00ADD8',
  Rust:            '#dea584',
  C:               '#555555',
  'C++':           '#f34b7d',
  'C#':            '#178600',
  Ruby:            '#701516',
  PHP:             '#4F5D95',
  Swift:           '#F05138',
  Kotlin:          '#A97BFF',
  Dart:            '#00B4AB',
  Shell:           '#89e051',
  Vue:             '#41b883',
  CSS:             '#563d7c',
  HTML:            '#e34c26',
  Scala:           '#c22d40',
  Lua:             '#000080',
  R:               '#198CE7',
  Perl:            '#0298c3',
  Haskell:         '#5e5086',
  Elixir:          '#6e4a7e',
  Clojure:         '#db5855',
  Erlang:          '#B83998',
  Julia:           '#a270ba',
  Zig:             '#ec915c',
  Nim:             '#ffc200',
  OCaml:           '#3be133',
  'Objective-C':     '#438eff',
  CoffeeScript:    '#244776',
  PowerShell:      '#012456',
  Groovy:          '#4298b8',
  Dockerfile:      '#384d54',
  Makefile:        '#427819',
  Nix:             '#7e7eff',
  Terraform:       '#844FBA',
  Default:         '#8b949e',
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

export default function TrendingTable({ items, period = 'daily', onTrendClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          className="w-16 h-16 text-[var(--color-text-tertiary)] mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
          No trending data available
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)]">
          Click "Refresh" to fetch the latest data from GitHub
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((repo) => (
        <div
          key={repo.id + '-' + repo.rank}
          className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-150"
        >
          <div className="flex items-start gap-4">
            <span
              className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                repo.rank <= 3
                  ? 'bg-[var(--color-bg-badge-top)] text-[var(--color-text-badge-top)]'
                  : 'bg-[var(--color-bg-badge)] text-[var(--color-text-badge)]'
              }`}
            >
              {repo.rank}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-[var(--color-accent)] truncate hover:text-[var(--color-accent-hover)]"
                >
                  {repo.name}
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onTrendClick(repo.id, repo.name)
                  }}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-[var(--color-accent-light)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                  title="View stars trend"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 7h4v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Trend
                </button>
              </div>
              {repo.description && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {repo.language && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.176 3.404a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.176-3.404a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  {formatNumber(repo.stars)}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z" />
                  </svg>
                  {formatNumber(repo.forks)}
                </span>
                {repo.stars_today > 0 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-star-gain)]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +{formatNumber(repo.stars_today)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}