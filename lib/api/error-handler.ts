import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { ApiError } from '@/types/api'

export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    const errors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }))

    return NextResponse.json<ApiError>(
      {
        error: 'validation_error',
        message: 'Invalid request data',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    )
  }

  if (error instanceof APIError) {
    return NextResponse.json<ApiError>(
      {
        error: error.code || 'api_error',
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json<ApiError>(
      {
        error: 'server_error',
        message: error.message || 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }

  return NextResponse.json<ApiError>(
    {
      error: 'unknown_error',
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  )
}

export async function withErrorHandler<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler()
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}