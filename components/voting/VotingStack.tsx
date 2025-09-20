'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import SwipeCard from './SwipeCard'
import VoteButtons from './VoteButtons'
import { ContentCard } from '@/types/content'
import { VoteValue } from '@/types/vote'
import { Loading } from '@/components/ui/Loading'

interface VotingStackProps {
  initialCards?: ContentCard[]
  onVote: (contentId: number, value: VoteValue) => Promise<void>
  onLoadMore: () => Promise<ContentCard[]>
  sessionId: string
}

export const VotingStack: React.FC<VotingStackProps> = ({
  initialCards = [],
  onVote,
  onLoadMore,
  sessionId,
}) => {
  const [cards, setCards] = useState<ContentCard[]>(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cards.length - currentIndex <= 2) {
      loadMoreCards()
    }
  }, [currentIndex])

  const loadMoreCards = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const newCards = await onLoadMore()
      setCards(prev => [...prev, ...newCards])
      setError(null)
    } catch (err) {
      setError('Failed to load more content')
      console.error('Error loading cards:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (value: VoteValue) => {
    if (isVoting || currentIndex >= cards.length) return

    const currentCard = cards[currentIndex]
    if (!currentCard) return

    setIsVoting(true)
    try {
      await onVote(currentCard.id, value)
      setCurrentIndex(prev => prev + 1)
      setError(null)
    } catch (err) {
      setError('Failed to submit vote')
      console.error('Error voting:', err)
    } finally {
      setIsVoting(false)
    }
  }

  const currentCard = cards[currentIndex]
  const nextCard = cards[currentIndex + 1]

  if (cards.length === 0 && isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loading size="lg" />
      </div>
    )
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center">
        <h3 className="text-xl font-semibold mb-2">No more content to vote on!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for more movies and TV shows.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-error-50 dark:bg-error-900 text-error-700 dark:text-error-300 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="relative h-[600px] max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {nextCard && (
            <SwipeCard
              key={`card-${nextCard.id}`}
              content={nextCard}
              onVote={handleVote}
              isActive={false}
            />
          )}
          {currentCard && (
            <SwipeCard
              key={`card-${currentCard.id}`}
              content={currentCard}
              onVote={handleVote}
              isActive={!isVoting}
            />
          )}
        </AnimatePresence>
      </div>

      <VoteButtons onVote={handleVote} disabled={isVoting} />

      {isLoading && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Loading more content...
        </div>
      )}
    </div>
  )
}

export default VotingStack