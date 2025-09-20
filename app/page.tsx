'use client'

import { useState, useEffect, useCallback } from 'react'
import VotingStack from '@/components/voting/VotingStack'
import { ContentCard } from '@/types/content'
import { VoteValue } from '@/types/vote'
import { useSession } from '@/hooks/useSession'
import { useVoting } from '@/hooks/useVoting'
import { Loading } from '@/components/ui/Loading'

export default function HomePage() {
  const { sessionId, isLoading: sessionLoading } = useSession()
  const [initialCards, setInitialCards] = useState<ContentCard[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(true)

  const { submitVote, loadNextCard } = useVoting({
    sessionId: sessionId || '',
    onVoteSuccess: (contentId, voteValue) => {
      console.log(`Voted ${voteValue} on content ${contentId}`)
    },
    onVoteError: (error) => {
      console.error('Vote error:', error)
    },
  })

  useEffect(() => {
    const loadInitialCards = async () => {
      if (!sessionId) return

      setIsLoadingCards(true)
      const cards: ContentCard[] = []

      for (let i = 0; i < 5; i++) {
        const card = await loadNextCard()
        if (card) {
          cards.push(card)
        }
      }

      setInitialCards(cards)
      setIsLoadingCards(false)
    }

    loadInitialCards()
  }, [sessionId, loadNextCard])

  const handleVote = useCallback(
    async (contentId: number, value: VoteValue) => {
      if (!sessionId) return
      await submitVote(contentId, value)
    },
    [sessionId, submitVote]
  )

  const handleLoadMore = useCallback(async (): Promise<ContentCard[]> => {
    if (!sessionId) return []

    const cards: ContentCard[] = []
    for (let i = 0; i < 3; i++) {
      const card = await loadNextCard()
      if (card) {
        cards.push(card)
      }
    }

    return cards
  }, [sessionId, loadNextCard])

  if (sessionLoading || isLoadingCards) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loading size="lg" />
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Session Error</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unable to create a session. Please refresh the page.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">What Are We Watching?</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Swipe right to upvote, left to downvote, or up to skip
        </p>
      </div>

      <VotingStack
        initialCards={initialCards}
        onVote={handleVote}
        onLoadMore={handleLoadMore}
        sessionId={sessionId}
      />

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">How to Vote:</h3>
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="text-success-600">→</span>
            Swipe right or click ❤️ to upvote (+1)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-error-600">←</span>
            Swipe left or click ✕ to downvote (-1)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-neutral-600">↑</span>
            Swipe up or click ↑ to skip (0)
          </li>
        </ul>
      </div>
    </div>
  )
}
