import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { LeaderboardEntry, LeaderboardFilters } from '@/types/leaderboard'

export class LeaderboardRepository {
  async getLeaderboard(filters: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
    try {
      let query = supabase
        .from('leaderboard_view')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(10)

      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      if (filters.genre_id) {
        query = query.contains('genre_ids', [filters.genre_id])
      }

      if (filters.trending) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        query = query.gte('last_voted', thirtyDaysAgo.toISOString())
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        vote_percentage: this.calculateVotePercentages(entry),
      }))
    } catch (error) {
      console.error('Error in getLeaderboard:', error)
      return []
    }
  }

  async refreshLeaderboard(): Promise<void> {
    if (typeof window !== 'undefined') return

    try {
      const admin = supabaseAdmin()
      await admin.rpc('refresh_leaderboard')
    } catch (error) {
      console.error('Error refreshing leaderboard:', error)
    }
  }

  private calculateVotePercentages(entry: any): {
    positive: number
    negative: number
    neutral: number
  } {
    const total = entry.total_votes || 0
    if (total === 0) {
      return { positive: 0, negative: 0, neutral: 0 }
    }

    return {
      positive: Math.round((entry.positive_votes / total) * 100),
      negative: Math.round((entry.negative_votes / total) * 100),
      neutral: Math.round((entry.neutral_votes / total) * 100),
    }
  }

  async getTrendingCount(): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count, error } = await supabase
      .from('leaderboard_view')
      .select('*', { count: 'exact', head: true })
      .gte('last_voted', thirtyDaysAgo.toISOString())

    if (error) {
      console.error('Error getting trending count:', error)
      return 0
    }

    return count || 0
  }
}

export const leaderboardRepository = new LeaderboardRepository()