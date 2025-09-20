export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  error: string
  message: string
  code?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  total_pages: number
  total_items: number
  has_more: boolean
}

export interface CategoryResponse {
  genres: {
    id: number
    name: string
    type: 'movie' | 'tv'
  }[]
  trending: {
    enabled: boolean
    count: number
  }
}