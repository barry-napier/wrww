import { VoteValue } from './vote'

export interface SessionData {
  session_id: string
  voted_content: Map<number, {
    vote_value: VoteValue
    voted_at: Date
  }>
  created_at: Date
}

export interface SessionVote {
  content_id: number
  vote_value: VoteValue
  voted_at: Date
}

export interface SessionState {
  sessionId: string
  votes: SessionVote[]
  isLoading: boolean
  error?: string | null
}