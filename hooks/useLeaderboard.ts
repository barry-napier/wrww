'use client'

import { useState, useCallback, useEffect } from 'react'
import { LeaderboardEntry, LeaderboardFilters } from '@/types/leaderboard'

export function useLeaderboard(initialFilters: LeaderboardFilters = {}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [filters, setFilters] = useState<LeaderboardFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.type) {
        params.append('type', filters.type)
      }
      if (filters.genre_id) {
        params.append('genre_id', filters.genre_id.toString())
      }
      if (filters.trending) {
        params.append('trending', 'true')
      }

      const response = await fetch(`/api/leaderboard?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }

      const data = await response.json()
      setEntries(data.entries)
      setLastUpdated(new Date(data.updated_at))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching leaderboard:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const setTypeFilter = useCallback((type: 'movie' | 'tv' | 'all') => {
    updateFilters({ type })
  }, [updateFilters])

  const setGenreFilter = useCallback((genreId: number | null) => {
    updateFilters({ genre_id: genreId || undefined })
  }, [updateFilters])

  const setTrendingFilter = useCallback((trending: boolean) => {
    updateFilters({ trending })
  }, [updateFilters])

  const refresh = useCallback(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    entries,
    filters,
    isLoading,
    error,
    lastUpdated,
    setTypeFilter,
    setGenreFilter,
    setTrendingFilter,
    updateFilters,
    refresh,
  }
}

export default useLeaderboard