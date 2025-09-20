'use client'

import { useState, useEffect, useCallback } from 'react'
import { SessionData, SessionVote } from '@/types/session'
import { sessionService } from '@/lib/services/session'

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSession = () => {
      const id = sessionService.getSessionId()
      const data = sessionService.getSessionData()

      setSessionId(id)
      setSessionData(data)
      setIsLoading(false)
    }

    loadSession()

    // Check for session changes
    const interval = setInterval(loadSession, 5000)
    return () => clearInterval(interval)
  }, [])

  const getVotes = useCallback((): SessionVote[] => {
    return sessionService.getVotes()
  }, [])

  const hasVoted = useCallback((contentId: number): boolean => {
    return sessionService.hasVoted(contentId)
  }, [])

  const getVote = useCallback((contentId: number) => {
    return sessionService.getVote(contentId)
  }, [])

  const clearSession = useCallback(() => {
    sessionService.clearSession()
    setSessionData(null)
    window.location.reload()
  }, [])

  const getVotedContentIds = useCallback((): number[] => {
    return sessionService.getVotedContentIds()
  }, [])

  return {
    sessionId,
    sessionData,
    isLoading,
    getVotes,
    hasVoted,
    getVote,
    clearSession,
    getVotedContentIds,
  }
}

export default useSession