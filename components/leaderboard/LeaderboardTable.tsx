'use client'

import React from 'react'
import Image from 'next/image'
import { LeaderboardEntry } from '@/types/leaderboard'
import { TMDB_CONFIG } from '@/lib/tmdb/client'
import { cn } from '@/lib/utils'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  isLoading?: boolean
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="w-16 h-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No entries found for the selected filters.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const posterUrl = entry.poster_path
          ? `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.posterSizes.small}${entry.poster_path}`
          : '/placeholder-poster.jpg'

        const getRankBadge = (rank: number) => {
          if (rank === 1) return '🥇'
          if (rank === 2) return '🥈'
          if (rank === 3) return '🥉'
          return `#${rank}`
        }

        return (
          <div
            key={entry.content_id}
            className={cn(
              'flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm',
              'hover:shadow-md transition-shadow duration-200',
              entry.rank <= 3 && 'border-2',
              entry.rank === 1 && 'border-yellow-400',
              entry.rank === 2 && 'border-gray-400',
              entry.rank === 3 && 'border-orange-400'
            )}
          >
            <div className="flex-shrink-0 text-2xl font-bold w-12 text-center">
              {getRankBadge(entry.rank)}
            </div>

            <div className="relative w-16 h-20 flex-shrink-0">
              <Image
                src={posterUrl}
                alt={entry.title}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{entry.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="capitalize">{entry.type}</span>
                {entry.release_date && (
                  <span>{new Date(entry.release_date).getFullYear()}</span>
                )}
                {entry.tmdb_rating && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {entry.tmdb_rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {entry.total_score > 0 ? '+' : ''}{entry.total_score}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {entry.total_votes} votes
              </div>
              <div className="flex gap-1 mt-1">
                <span className="text-xs text-success-600" title="Upvotes">
                  +{entry.positive_votes}
                </span>
                <span className="text-xs text-error-600" title="Downvotes">
                  -{entry.negative_votes}
                </span>
                <span className="text-xs text-neutral-600" title="Skips">
                  ={entry.neutral_votes}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default LeaderboardTable