export interface LeaderboardEntry {
  rank: number
  content_id: number
  title: string
  type: 'movie' | 'tv'
  poster_path: string | null
  genre_ids: number[]
  release_date: Date | null
  tmdb_rating: number | null
  total_score: number
  positive_votes: number
  negative_votes: number
  neutral_votes: number
  total_votes: number
  vote_percentage: {
    positive: number
    negative: number
    neutral: number
  }
  last_voted: Date | null
}

export interface LeaderboardFilters {
  type?: 'movie' | 'tv' | 'all'
  genre_id?: number
  trending?: boolean
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[]
  updated_at: Date
  filters: LeaderboardFilters
}