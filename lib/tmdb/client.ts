const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const TMDB_CONFIG = {
  baseUrl: TMDB_BASE_URL,
  imageBaseUrl: TMDB_IMAGE_BASE,
  posterSizes: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdropSizes: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
}

class TMDBClient {
  private apiKey: string
  private readAccessToken: string
  private requestQueue: Promise<any> = Promise.resolve()
  private requestCount = 0
  private resetTime = Date.now() + 1000

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
    this.readAccessToken = process.env.TMDB_API_READ_ACCESS_TOKEN || ''
  }

  private async rateLimit() {
    const now = Date.now()
    if (now > this.resetTime) {
      this.requestCount = 0
      this.resetTime = now + 1000
    }

    if (this.requestCount >= 40) {
      const waitTime = this.resetTime - now
      await new Promise(resolve => setTimeout(resolve, waitTime))
      this.requestCount = 0
      this.resetTime = Date.now() + 1000
    }

    this.requestCount++
  }

  private async fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<any> {
    await this.rateLimit()

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.readAccessToken}`,
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        })

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10)
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
          continue
        }

        if (!response.ok) {
          throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  async getPopularMovies(page = 1) {
    const url = `${TMDB_BASE_URL}/movie/popular?page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async getPopularTVShows(page = 1) {
    const url = `${TMDB_BASE_URL}/tv/popular?page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async getTrendingContent(timeWindow: 'day' | 'week' = 'week', page = 1) {
    const url = `${TMDB_BASE_URL}/trending/all/${timeWindow}?page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async getMovieDetails(id: number) {
    const url = `${TMDB_BASE_URL}/movie/${id}?append_to_response=credits,videos&language=en-US`
    return this.fetchWithRetry(url)
  }

  async getTVShowDetails(id: number) {
    const url = `${TMDB_BASE_URL}/tv/${id}?append_to_response=credits,videos&language=en-US`
    return this.fetchWithRetry(url)
  }

  async getMovieGenres() {
    const url = `${TMDB_BASE_URL}/genre/movie/list?language=en-US`
    return this.fetchWithRetry(url)
  }

  async getTVGenres() {
    const url = `${TMDB_BASE_URL}/genre/tv/list?language=en-US`
    return this.fetchWithRetry(url)
  }

  async searchContent(query: string, page = 1) {
    const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  static getPosterUrl(path: string | null, size: keyof typeof TMDB_CONFIG.posterSizes = 'medium') {
    if (!path) return null
    return `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.posterSizes[size]}${path}`
  }

  static getBackdropUrl(path: string | null, size: keyof typeof TMDB_CONFIG.backdropSizes = 'medium') {
    if (!path) return null
    return `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.backdropSizes[size]}${path}`
  }
}

export const tmdbClient = new TMDBClient()
export default tmdbClient