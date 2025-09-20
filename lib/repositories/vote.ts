import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { Vote, VoteRequest, VoteResponse } from '@/types/vote'

export class VoteRepository {
  async submitVote(request: VoteRequest, ipAddress?: string, userAgent?: string): Promise<VoteResponse> {
    try {
      const ipHash = ipAddress || null

      const isServer = typeof window === 'undefined'
      const client = isServer ? supabaseAdmin() : supabase

      const { data, error } = await client.rpc('insert_vote', {
        p_content_id: request.content_id,
        p_vote_value: request.vote_value,
        p_session_id: request.session_id,
        p_ip_hash: ipHash,
        p_user_agent: userAgent,
      })

      if (error) {
        if (error.message?.includes('duplicate')) {
          return {
            success: false,
            error: 'duplicate_vote',
            message: 'You have already voted on this content',
          }
        }
        throw error
      }

      return data as VoteResponse
    } catch (error) {
      console.error('Error submitting vote:', error)
      return {
        success: false,
        error: 'server_error',
        message: 'Failed to submit vote',
      }
    }
  }

  async getUserVotes(sessionId: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user votes:', error)
      return []
    }

    return data || []
  }

  async getVoteStats(contentId: number): Promise<{
    total_votes: number
    positive_votes: number
    negative_votes: number
    neutral_votes: number
    average_score: number
  }> {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_value')
      .eq('content_id', contentId)

    if (error || !data) {
      return {
        total_votes: 0,
        positive_votes: 0,
        negative_votes: 0,
        neutral_votes: 0,
        average_score: 0,
      }
    }

    const stats = {
      total_votes: data.length,
      positive_votes: data.filter(v => v.vote_value === 1).length,
      negative_votes: data.filter(v => v.vote_value === -1).length,
      neutral_votes: data.filter(v => v.vote_value === 0).length,
      average_score: 0,
    }

    if (stats.total_votes > 0) {
      const sum = data.reduce((acc, v) => acc + v.vote_value, 0)
      stats.average_score = sum / stats.total_votes
    }

    return stats
  }

  async hasVoted(sessionId: string, contentId: number): Promise<boolean> {
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('session_id', sessionId)
      .eq('content_id', contentId)
      .single()

    return !!data
  }
}

export const voteRepository = new VoteRepository()