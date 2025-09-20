import { NextRequest, NextResponse } from 'next/server'
import { NextCardQuerySchema } from '@/lib/validation/schemas'
import { contentRepository } from '@/lib/repositories/content'
import { handleApiError, withErrorHandler } from '@/lib/api/error-handler'
import { checkRateLimit } from '@/lib/middleware/rate-limit'

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    checkRateLimit(request)

    const searchParams = request.nextUrl.searchParams
    const query = {
      session_id: searchParams.get('session_id') || '',
      type: searchParams.get('type') || 'all',
      genre_id: searchParams.get('genre_id') || undefined,
    }

    const validatedQuery = NextCardQuerySchema.parse(query)

    const content = await contentRepository.getNextCard(
      validatedQuery.session_id,
      validatedQuery.type === 'all' ? 'all' : validatedQuery.type,
      validatedQuery.genre_id
    )

    if (!content) {
      return new NextResponse(null, { status: 204 })
    }

    return NextResponse.json(content)
  })
}