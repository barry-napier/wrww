import { NextRequest, NextResponse } from 'next/server'
import { VoteRequestSchema } from '@/lib/validation/schemas'
import { voteRepository } from '@/lib/repositories/vote'
import { handleApiError, withErrorHandler } from '@/lib/api/error-handler'
import { checkRateLimit } from '@/lib/middleware/rate-limit'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    checkRateLimit(request, 'vote')

    const body = await request.json()
    const validatedData = VoteRequestSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     undefined

    const userAgent = request.headers.get('user-agent') || undefined

    const response = await voteRepository.submitVote(
      validatedData,
      ipAddress,
      userAgent
    )

    if (!response.success) {
      return NextResponse.json(response, { status: 409 })
    }

    return NextResponse.json(response, { status: 201 })
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}