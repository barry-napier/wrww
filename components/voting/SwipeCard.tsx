'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { ContentCard } from '@/types/content'
import { VoteValue } from '@/types/vote'
import { cn } from '@/lib/utils'
import { TMDB_CONFIG } from '@/lib/tmdb/client'

interface SwipeCardProps {
  content: ContentCard
  onVote: (value: VoteValue) => void
  isActive: boolean
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  content,
  onVote,
  isActive,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateZ = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5]
  )

  const voteIndicatorOpacity = useTransform(
    x,
    [-200, -50, 0, 50, 200],
    [1, 0, 0, 0, 1]
  )

  const upIndicatorOpacity = useTransform(
    y,
    [-200, -50, 0],
    [1, 0, 0]
  )

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false)

    const threshold = 100
    const { offset, velocity } = info

    if (Math.abs(offset.y) > Math.abs(offset.x) && offset.y < -threshold) {
      onVote(0)
    } else if (offset.x > threshold || velocity.x > 500) {
      onVote(1)
    } else if (offset.x < -threshold || velocity.x < -500) {
      onVote(-1)
    }
  }

  const posterUrl = content.poster_path
    ? `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.posterSizes.large}${content.poster_path}`
    : '/placeholder-poster.jpg'

  const backdropUrl = content.backdrop_path
    ? `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.backdropSizes.medium}${content.backdrop_path}`
    : null

  return (
    <motion.div
      className={cn(
        'absolute inset-0 cursor-grab active:cursor-grabbing',
        !isActive && 'pointer-events-none'
      )}
      style={{ x, y, rotateZ, opacity }}
      drag={isActive}
      dragElastic={0.2}
      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={!isActive ? { scale: 0.95, opacity: 0.5 } : {}}
      whileTap={{ scale: 1.02 }}
    >
      <div className="relative w-full h-full max-w-sm mx-auto">
        <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {backdropUrl && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={backdropUrl}
                alt=""
                fill
                className="object-cover blur-sm"
                priority={isActive}
              />
            </div>
          )}

          <div className="relative h-3/5">
            <Image
              src={posterUrl}
              alt={content.title}
              fill
              className="object-cover"
              priority={isActive}
            />

            <motion.div
              className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1 rounded-full font-bold text-lg"
              style={{ opacity: x.get() > 50 ? voteIndicatorOpacity : 0 }}
            >
              +1
            </motion.div>

            <motion.div
              className="absolute top-4 left-4 bg-error-500 text-white px-3 py-1 rounded-full font-bold text-lg"
              style={{ opacity: x.get() < -50 ? voteIndicatorOpacity : 0 }}
            >
              -1
            </motion.div>

            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-500 text-white px-3 py-1 rounded-full font-bold text-lg"
              style={{ opacity: upIndicatorOpacity }}
            >
              Skip
            </motion.div>
          </div>

          <div className="p-4 h-2/5 overflow-y-auto">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{content.title}</h3>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="capitalize">{content.type}</span>
              {content.release_date && (
                <>
                  <span>•</span>
                  <span>{new Date(content.release_date).getFullYear()}</span>
                </>
              )}
              {content.rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {content.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
              {content.overview}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SwipeCard