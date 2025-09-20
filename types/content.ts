export interface Content {
  id: number
  title: string
  type: 'movie' | 'tv'
  poster_path: string | null
  backdrop_path: string | null
  overview: string | null
  genres: number[]
  release_date: Date | null
  rating: number | null
  vote_count: number
  popularity: number | null
  cached_at: Date
  updated_at: Date
}

export interface ContentCard extends Content {
  vote_stats?: {
    total_votes: number
    average_score: number
  }
}

export interface ContentDetail extends ContentCard {
  cast?: {
    name: string
    character?: string
    profile_path?: string
  }[]
  director?: string
  runtime?: number
  seasons?: number
  episodes?: number
}

export interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  genre_ids: number[]
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  video: boolean
  original_language: string
  original_title: string
}

export interface TMDBTVShow {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  genre_ids: number[]
  first_air_date: string
  vote_average: number
  vote_count: number
  popularity: number
  origin_country: string[]
  original_language: string
  original_name: string
}

export type TMDBContent = TMDBMovie | TMDBTVShow

export interface Genre {
  id: number
  name: string
  type: 'movie' | 'tv'
}