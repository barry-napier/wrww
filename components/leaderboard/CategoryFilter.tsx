'use client'

import React from 'react'
import { Genre } from '@/types/content'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  genres: Genre[]
  selectedType: 'movie' | 'tv' | 'all'
  selectedGenre?: number | null
  showTrending: boolean
  trendingCount: number
  onTypeChange: (type: 'movie' | 'tv' | 'all') => void
  onGenreChange: (genreId: number | null) => void
  onTrendingChange: (trending: boolean) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  genres,
  selectedType,
  selectedGenre,
  showTrending,
  trendingCount,
  onTypeChange,
  onGenreChange,
  onTrendingChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onTypeChange('all')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedType === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          All
        </button>
        <button
          onClick={() => onTypeChange('movie')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedType === 'movie'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          Movies
        </button>
        <button
          onClick={() => onTypeChange('tv')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedType === 'tv'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          TV Shows
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => onTrendingChange(!showTrending)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
            showTrending
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1-4 1-4s.5 5.5 2.5 7.5c0-1.5.5-2.5.5-2.5s1 1 3 1c0-2 1-4 1-4s1.5 4.5 0 7.5z"
            />
          </svg>
          Trending
          {trendingCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {trendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Genre Filter
        </label>
        <select
          value={selectedGenre || ''}
          onChange={(e) => onGenreChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Genres</option>
          {genres
            .filter(g => selectedType === 'all' || g.type === selectedType)
            .map((genre) => (
              <option key={`${genre.type}-${genre.id}`} value={genre.id}>
                {genre.name} ({genre.type})
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}

export default CategoryFilter