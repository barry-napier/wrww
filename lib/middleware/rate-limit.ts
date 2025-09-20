import { NextRequest } from 'next/server'
import { APIError } from '@/lib/api/error-handler'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private readonly windowMs = 1000 // 1 second window
  private readonly maxRequests = 10 // 10 requests per second

  constructor(maxRequests?: number, windowMs?: number) {
    if (maxRequests) this.maxRequests = maxRequests
    if (windowMs) this.windowMs = windowMs
  }

  check(identifier: string): void {
    const now = Date.now()
    const record = this.store[identifier]

    if (!record || now > record.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs,
      }
      return
    }

    if (record.count >= this.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000)
      throw new APIError(
        `Rate limit exceeded. Try again in ${retryAfter} seconds`,
        429,
        'RATE_LIMIT_EXCEEDED'
      )
    }

    record.count++
  }

  cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key]?.resetTime < now) {
        delete this.store[key]
      }
    })
  }
}

const voteRateLimiter = new RateLimiter(1, 1000) // 1 vote per second
const apiRateLimiter = new RateLimiter(30, 1000) // 30 requests per second

// Cleanup every minute
if (typeof global !== 'undefined') {
  setInterval(() => {
    voteRateLimiter.cleanup()
    apiRateLimiter.cleanup()
  }, 60000)
}

export function checkRateLimit(request: NextRequest, type: 'vote' | 'api' = 'api'): void {
  const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'

  const limiter = type === 'vote' ? voteRateLimiter : apiRateLimiter
  limiter.check(ip)
}

export { voteRateLimiter, apiRateLimiter }