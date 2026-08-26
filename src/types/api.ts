/**
 * Standard API response envelope matching the backend.
 */
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

/**
 * Paginated API response envelope.
 */
export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Structured API error returned from the backend.
 */
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
  traceId?: string
}

/**
 * Generic select option used across dropdowns / selects.
 */
export interface SelectOption<T = string> {
  label: string
  value: T
}

/**
 * Sort direction.
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Common query params for paginated list requests.
 */
export interface PaginationParams {
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDirection?: SortDirection
}
