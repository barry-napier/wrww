import { NextRequest, NextResponse } from 'next/server'
import { contentRepository } from '@/lib/repositories/content'
import { tmdbService } from '@/lib/services/tmdb'
import { withErrorHandler, APIError } from '@/lib/api/error-handler'
import { checkRateLimit } from '@/lib/middleware/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    checkRateLimit(request)

    const contentId = parseInt(params.id, 10)
    if (isNaN(contentId)) {
      throw new APIError('Invalid content ID', 400)
    }

    const content = await contentRepository.getById(contentId)
    if (!content) {
      throw new APIError('Content not found', 404)
    }

    const detail = await tmdbService.getContentDetail(contentId, content.type)

    if (!detail) {
      return NextResponse.json(content)
    }

    return NextResponse.json(detail)
  })
}