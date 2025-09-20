interface CacheItem<T> {
  data: T
  expires: number
}

class CacheService {
  private memoryCache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_TTL = 1000 * 60 * 5 // 5 minutes

  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.DEFAULT_TTL
    this.memoryCache.set(key, {
      data,
      expires: Date.now() + ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.memoryCache.get(key)

    if (!item) return null

    if (item.expires < Date.now()) {
      this.memoryCache.delete(key)
      return null
    }

    return item.data as T
  }

  has(key: string): boolean {
    const item = this.memoryCache.get(key)
    if (!item) return false

    if (item.expires < Date.now()) {
      this.memoryCache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.memoryCache.delete(key)
  }

  clear(): void {
    this.memoryCache.clear()
  }

  cleanExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expires < now) {
        this.memoryCache.delete(key)
      }
    }
  }

  size(): number {
    this.cleanExpired()
    return this.memoryCache.size
  }
}

export const cacheService = new CacheService()

// Clean expired items every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanExpired()
  }, 60000)
}

export default cacheService