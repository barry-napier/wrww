'use client'

import { useState, useCallback } from 'react'
import { ContentCard } from '@/types/content'
import { VoteValue } from '@/types/vote'
import { sessionService } from '@/lib/services/session'

interface UseVotingOptions {
  sessionId: string
  onVoteSuccess?: (contentId: number, voteValue: VoteValue) => void
  onVoteError?: (error: Error) => void
}

export function useVoting({
  sessionId,
  onVoteSuccess,
  onVoteError,
}: UseVotingOptions) {
  const [isVoting, setIsVoting] = useState(false)
  const [votedContent, setVotedContent] = useState<Set<number>>(
    new Set(sessionService.getVotedContentIds())
  )

  const submitVote = useCallback(
    async (contentId: number, voteValue: VoteValue) => {
      if (votedContent.has(contentId)) {
        const error = new Error('Already voted on this content')
        onVoteError?.(error)
        throw error
      }

      setIsVoting(true)

      try {
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content_id: contentId,
            vote_value: voteValue,
            session_id: sessionId,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to submit vote')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Vote submission failed')
        }

        sessionService.addVote(contentId, voteValue)
        setVotedContent(prev => new Set([...prev, contentId]))
        onVoteSuccess?.(contentId, voteValue)

        return result
      } catch (error) {
        onVoteError?.(error as Error)
        throw error
      } finally {
        setIsVoting(false)
      }
    },
    [sessionId, votedContent, onVoteSuccess, onVoteError]
  )

  const loadNextCard = useCallback(
    async (type: 'movie' | 'tv' | 'all' = 'all', genreId?: number): Promise<ContentCard | null> => {
      try {
        const params = new URLSearchParams({
          session_id: sessionId,
          type,
        })

        if (genreId) {
          params.append('genre_id', genreId.toString())
        }

        const response = await fetch(`/api/movies/next?${params}`)

        if (response.status === 204) {
          return null
        }

        if (!response.ok) {
          throw new Error('Failed to load next card')
        }

        return await response.json()
      } catch (error) {
        console.error('Error loading next card:', error)
        return null
      }
    },
    [sessionId]
  )

  const hasVoted = useCallback(
    (contentId: number): boolean => {
      return votedContent.has(contentId)
    },
    [votedContent]
  )

  return {
    submitVote,
    loadNextCard,
    hasVoted,
    isVoting,
    votedContent,
  }
}

export default useVoting