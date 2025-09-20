export type VoteValue = -1 | 0 | 1

export interface Vote {
  id: string
  content_id: number
  vote_value: VoteValue
  session_id: string
  ip_hash?: string | null
  user_agent?: string | null
  created_at: Date
}

export interface VoteRequest {
  content_id: number
  vote_value: VoteValue
  session_id: string
}

export interface VoteResponse {
  success: boolean
  vote_id?: string
  error?: string
  message: string
}

export interface VoteStats {
  total_votes: number
  positive_votes: number
  negative_votes: number
  neutral_votes: number
  average_score: number
  vote_percentage: {
    positive: number
    negative: number
    neutral: number
  }
}