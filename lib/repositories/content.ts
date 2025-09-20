import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { Content, ContentCard, Genre } from '@/types/content'
import { tmdbClient, TMDB_CONFIG } from '@/lib/tmdb/client'

export class ContentRepository {
  async getById(id: number): Promise<Content | null> {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching content:', error)
      return null
    }

    return data
  }

  async getNextCard(sessionId: string, type: 'movie' | 'tv' | 'all' = 'all', genreId?: number): Promise<ContentCard | null> {
    try {
      const votedQuery = supabase
        .from('votes')
        .select('content_id')
        .eq('session_id', sessionId)

      const { data: votedContent } = await votedQuery
      const votedIds = votedContent?.map(v => v.content_id) || []

      let query = supabase
        .from('content')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(1)

      if (votedIds.length > 0) {
        query = query.not('id', 'in', `(${votedIds.join(',')})`)
      }

      if (type !== 'all') {
        query = query.eq('type', type)
      }

      if (genreId) {
        query = query.contains('genres', [genreId])
      }

      const { data, error } = await query.single()

      if (error || !data) {
        await this.refreshContentFromTMDB()

        const retryQuery = supabase
          .from('content')
          .select('*')
          .order('popularity', { ascending: false })
          .limit(1)

        if (votedIds.length > 0) {
          retryQuery.not('id', 'in', `(${votedIds.join(',')})`)
        }

        const { data: retryData } = await retryQuery.single()
        return retryData
      }

      return data
    } catch (error) {
      console.error('Error getting next card:', error)
      return null
    }
  }

  async refreshContentFromTMDB(): Promise<void> {
    if (typeof window !== 'undefined') return

    try {
      const [movies, tvShows] = await Promise.all([
        tmdbClient.getPopularMovies(),
        tmdbClient.getPopularTVShows(),
      ])

      const admin = supabaseAdmin()
      const contentToUpsert: Partial<Content>[] = []

      movies.results.forEach((movie: any) => {
        contentToUpsert.push({
          id: movie.id,
          title: movie.title,
          type: 'movie',
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview?.substring(0, 500),
          genres: movie.genre_ids || [],
          release_date: movie.release_date ? new Date(movie.release_date) : null,
          rating: movie.vote_average,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
          cached_at: new Date(),
          updated_at: new Date(),
        })
      })

      tvShows.results.forEach((show: any) => {
        contentToUpsert.push({
          id: show.id,
          title: show.name,
          type: 'tv',
          poster_path: show.poster_path,
          backdrop_path: show.backdrop_path,
          overview: show.overview?.substring(0, 500),
          genres: show.genre_ids || [],
          release_date: show.first_air_date ? new Date(show.first_air_date) : null,
          rating: show.vote_average,
          vote_count: show.vote_count,
          popularity: show.popularity,
          cached_at: new Date(),
          updated_at: new Date(),
        })
      })

      if (contentToUpsert.length > 0) {
        await admin
          .from('content')
          .upsert(contentToUpsert, { onConflict: 'id' })
      }

      await this.refreshGenres()
    } catch (error) {
      console.error('Error refreshing content from TMDB:', error)
    }
  }

  async refreshGenres(): Promise<void> {
    if (typeof window !== 'undefined') return

    try {
      const [movieGenres, tvGenres] = await Promise.all([
        tmdbClient.getMovieGenres(),
        tmdbClient.getTVGenres(),
      ])

      const admin = supabaseAdmin()
      const genresToUpsert: Genre[] = []

      movieGenres.genres?.forEach((genre: any) => {
        genresToUpsert.push({
          id: genre.id,
          name: genre.name,
          type: 'movie',
        })
      })

      tvGenres.genres?.forEach((genre: any) => {
        genresToUpsert.push({
          id: genre.id,
          name: genre.name,
          type: 'tv',
        })
      })

      if (genresToUpsert.length > 0) {
        await admin
          .from('genres')
          .upsert(genresToUpsert, { onConflict: 'id,type' })
      }
    } catch (error) {
      console.error('Error refreshing genres:', error)
    }
  }

  async getGenres(type: 'movie' | 'tv' | 'all' = 'all'): Promise<Genre[]> {
    let query = supabase.from('genres').select('*')

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    const { data, error } = await query.order('name')

    if (error) {
      console.error('Error fetching genres:', error)
      return []
    }

    return data || []
  }
}

export const contentRepository = new ContentRepository()