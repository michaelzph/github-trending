import { useState, useEffect } from 'react'
import axios from 'axios'
import PeriodTabs from './components/PeriodTabs'
import TrendingTable from './components/TrendingTable'
import StarChart from './components/StarChart'
import TrendModal from './components/TrendModal'

const API_BASE = ''

function App() {
  const [period, setPeriod] = useState('daily')
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scraping, setScraping] = useState(false)
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const [trendModal, setTrendModal] = useState({ open: false, repoId: null, repoName: '' })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    fetchTrending()
  }, [period])

  const fetchTrending = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_BASE}/api/trending/${period}`)
      setTrending(res.data.items)
    } catch {
      setError('Failed to fetch trending data')
      setTrending([])
    } finally {
      setLoading(false)
    }
  }

  const handleScrape = async () => {
    setScraping(true)
    try {
      await axios.post(`${API_BASE}/api/trending/${period}/scrape`)
      await fetchTrending()
    } catch {
      setError('Failed to scrape data')
    } finally {
      setScraping(false)
    }
  }

  const handleTrendClick = (repoId, repoName) => {
    setTrendModal({ open: true, repoId, repoName })
  }

  const handleCloseModal = () => {
    setTrendModal({ open: false, repoId: null, repoName: '' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-[var(--color-bg-header)] border-b border-[var(--color-border-header)]">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                GitHub Trending
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Track trending repositories over time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark(!dark)}
                aria-label="Toggle dark mode"
                className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {dark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="mt-5">
            <PeriodTabs period={period} onChange={setPeriod} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div role="alert" className="mb-6 flex items-center gap-3 rounded-lg border border-[var(--color-border-error)] bg-[var(--color-bg-error)] px-4 py-3">
            <svg
              className="shrink-0 w-5 h-5 text-[var(--color-text-error)]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-[var(--color-text-error)]">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-border)]" />
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--color-accent)] animate-spin" />
            </div>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Loading trending repositories...
            </p>
          </div>
        ) : trending.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendingTable items={trending} period={period} onTrendClick={handleTrendClick} />
            </div>
            <div>
              <StarChart items={trending} />
            </div>
          </div>
        )}
      </main>

      {trendModal.open && (
        <TrendModal
          repoId={trendModal.repoId}
          repoName={trendModal.repoName}
          period={period}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App