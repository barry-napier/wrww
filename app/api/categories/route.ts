import { NextRequest, NextResponse } from 'next/server'
import { CategoryQuerySchema } from '@/lib/validation/schemas'
import { contentRepository } from '@/lib/repositories/content'
import { leaderboardRepository } from '@/lib/repositories/leaderboard'
import { withErrorHandler } from '@/lib/api/error-handler'
import { checkRateLimit } from '@/lib/middleware/rate-limit'

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    checkRateLimit(request)

    const searchParams = request.nextUrl.searchParams
    const query = {
      type: searchParams.get('type') || 'all',
    }

    const validatedQuery = CategoryQuerySchema.parse(query)

    const [genres, trendingCount] = await Promise.all([
      contentRepository.getGenres(validatedQuery.type),
      leaderboardRepository.getTrendingCount(),
    ])

    return NextResponse.json({
      genres,
      trending: {
        enabled: true,
        count: trendingCount,
      },
    })
  })
}