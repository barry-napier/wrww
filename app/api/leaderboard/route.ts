import { NextRequest, NextResponse } from 'next/server'
import { LeaderboardQuerySchema } from '@/lib/validation/schemas'
import { leaderboardRepository } from '@/lib/repositories/leaderboard'
import { withErrorHandler } from '@/lib/api/error-handler'
import { checkRateLimit } from '@/lib/middleware/rate-limit'

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    checkRateLimit(request)

    const searchParams = request.nextUrl.searchParams
    const query = {
      type: searchParams.get('type') || 'all',
      genre_id: searchParams.get('genre_id') || undefined,
      trending: searchParams.get('trending') || 'false',
    }

    const validatedQuery = LeaderboardQuerySchema.parse(query)

    const entries = await leaderboardRepository.getLeaderboard(validatedQuery)

    return NextResponse.json({
      entries,
      updated_at: new Date().toISOString(),
      filters: validatedQuery,
    })
  })
}