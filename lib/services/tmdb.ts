import tmdbClient, { TMDB_CONFIG } from '@/lib/tmdb/client'
import { ContentDetail } from '@/types/content'

class TMDBService {
  private cache = new Map<string, { data: any; expires: number }>()
  private readonly CACHE_DURATION = 1000 * 60 * 60 // 1 hour

  private getCacheKey(type: string, id: number | string): string {
    return `${type}-${id}`
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.CACHE_DURATION,
    })
  }

  async getContentDetail(id: number, type: 'movie' | 'tv'): Promise<ContentDetail | null> {
    const cacheKey = this.getCacheKey('detail', `${type}-${id}`)
    const cached = this.getFromCache<ContentDetail>(cacheKey)
    if (cached) return cached

    try {
      const data = type === 'movie'
        ? await tmdbClient.getMovieDetails(id)
        : await tmdbClient.getTVShowDetails(id)

      const detail: ContentDetail = {
        id: data.id,
        title: type === 'movie' ? data.title : data.name,
        type,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        overview: data.overview,
        genres: data.genres?.map((g: any) => g.id) || [],
        release_date: type === 'movie' ? data.release_date : data.first_air_date,
        rating: data.vote_average,
        vote_count: data.vote_count,
        popularity: data.popularity,
        cached_at: new Date(),
        updated_at: new Date(),
        cast: data.credits?.cast?.slice(0, 10).map((c: any) => ({
          name: c.name,
          character: c.character,
          profile_path: c.profile_path,
        })),
        director: type === 'movie'
          ? data.credits?.crew?.find((c: any) => c.job === 'Director')?.name
          : data.created_by?.[0]?.name,
        runtime: type === 'movie' ? data.runtime : undefined,
        seasons: type === 'tv' ? data.number_of_seasons : undefined,
        episodes: type === 'tv' ? data.number_of_episodes : undefined,
      }

      this.setCache(cacheKey, detail)
      return detail
    } catch (error) {
      console.error('Error fetching content detail from TMDB:', error)
      return null
    }
  }

  async searchContent(query: string, page = 1): Promise<any> {
    const cacheKey = this.getCacheKey('search', `${query}-${page}`)
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const results = await tmdbClient.searchContent(query, page)
      this.setCache(cacheKey, results)
      return results
    } catch (error) {
      console.error('Error searching content:', error)
      return null
    }
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<any> {
    const cacheKey = this.getCacheKey('trending', timeWindow)
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const results = await tmdbClient.getTrendingContent(timeWindow)
      this.setCache(cacheKey, results)
      return results
    } catch (error) {
      console.error('Error fetching trending content:', error)
      return null
    }
  }

  getPosterUrl(path: string | null, size: keyof typeof TMDB_CONFIG.posterSizes = 'medium'): string | null {
    return tmdbClient.constructor.getPosterUrl(path, size)
  }

  getBackdropUrl(path: string | null, size: keyof typeof TMDB_CONFIG.backdropSizes = 'medium'): string | null {
    return tmdbClient.constructor.getBackdropUrl(path, size)
  }
}

export const tmdbService = new TMDBService()
export default tmdbService