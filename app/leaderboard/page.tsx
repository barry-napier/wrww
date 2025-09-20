'use client'

import { useState, useEffect } from 'react'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import CategoryFilter from '@/components/leaderboard/CategoryFilter'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { Genre } from '@/types/content'
import { Loading } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'

export default function LeaderboardPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [trendingCount, setTrendingCount] = useState(0)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const {
    entries,
    filters,
    isLoading,
    error,
    lastUpdated,
    setTypeFilter,
    setGenreFilter,
    setTrendingFilter,
    refresh,
  } = useLeaderboard()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to load categories')

        const data = await response.json()
        setGenres(data.genres || [])
        setTrendingCount(data.trending?.count || 0)
      } catch (err) {
        console.error('Error loading categories:', err)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            {isLoadingCategories ? (
              <Loading />
            ) : (
              <CategoryFilter
                genres={genres}
                selectedType={filters.type || 'all'}
                selectedGenre={filters.genre_id || null}
                showTrending={filters.trending || false}
                trendingCount={trendingCount}
                onTypeChange={setTypeFilter}
                onGenreChange={setGenreFilter}
                onTrendingChange={setTrendingFilter}
              />
            )}
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <Button
                variant="secondary"
                onClick={refresh}
                disabled={isLoading}
                loading={isLoading}
              >
                Refresh
              </Button>
            </div>

            {lastUpdated && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}

            {error && (
              <div className="mt-4 p-4 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <LeaderboardTable entries={entries} isLoading={isLoading} />

          {!isLoading && entries.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or check back later for new content.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}