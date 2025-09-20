import { SessionData, SessionVote } from '@/types/session'

class SessionService {
  private readonly SESSION_KEY = 'wrww_session'
  private readonly VOTES_KEY = 'wrww_votes'

  getSessionId(): string | null {
    if (typeof window === 'undefined') return null

    const cookies = document.cookie.split(';')
    const sessionCookie = cookies.find(c => c.trim().startsWith('session_id='))

    if (sessionCookie) {
      return sessionCookie.split('=')[1]
    }

    return null
  }

  getSessionData(): SessionData | null {
    if (typeof window === 'undefined') return null

    const sessionId = this.getSessionId()
    if (!sessionId) return null

    const storedData = localStorage.getItem(this.SESSION_KEY)
    if (!storedData) {
      const newSession: SessionData = {
        session_id: sessionId,
        voted_content: new Map(),
        created_at: new Date(),
      }
      this.saveSessionData(newSession)
      return newSession
    }

    try {
      const parsed = JSON.parse(storedData)
      return {
        ...parsed,
        voted_content: new Map(parsed.voted_content),
        created_at: new Date(parsed.created_at),
      }
    } catch {
      return null
    }
  }

  saveSessionData(data: SessionData): void {
    if (typeof window === 'undefined') return

    const toStore = {
      ...data,
      voted_content: Array.from(data.voted_content.entries()),
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(toStore))
  }

  addVote(contentId: number, voteValue: -1 | 0 | 1): void {
    if (typeof window === 'undefined') return

    const session = this.getSessionData()
    if (!session) return

    session.voted_content.set(contentId, {
      vote_value: voteValue,
      voted_at: new Date(),
    })

    this.saveSessionData(session)

    const votes = this.getVotes()
    votes.push({
      content_id: contentId,
      vote_value: voteValue,
      voted_at: new Date(),
    })
    this.saveVotes(votes)
  }

  hasVoted(contentId: number): boolean {
    if (typeof window === 'undefined') return false

    const session = this.getSessionData()
    return session?.voted_content.has(contentId) ?? false
  }

  getVote(contentId: number): { vote_value: -1 | 0 | 1; voted_at: Date } | null {
    if (typeof window === 'undefined') return null

    const session = this.getSessionData()
    return session?.voted_content.get(contentId) ?? null
  }

  getVotes(): SessionVote[] {
    if (typeof window === 'undefined') return []

    const stored = localStorage.getItem(this.VOTES_KEY)
    if (!stored) return []

    try {
      const parsed = JSON.parse(stored)
      return parsed.map((v: any) => ({
        ...v,
        voted_at: new Date(v.voted_at),
      }))
    } catch {
      return []
    }
  }

  saveVotes(votes: SessionVote[]): void {
    if (typeof window === 'undefined') return

    localStorage.setItem(this.VOTES_KEY, JSON.stringify(votes))
  }

  clearSession(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem(this.SESSION_KEY)
    localStorage.removeItem(this.VOTES_KEY)
  }

  getVotedContentIds(): number[] {
    const session = this.getSessionData()
    return session ? Array.from(session.voted_content.keys()) : []
  }
}

export const sessionService = new SessionService()
export default sessionService