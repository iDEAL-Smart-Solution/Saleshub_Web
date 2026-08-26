import axios from 'axios'
import type { ApiError } from '@/types'

/**
 * Normalizes any thrown error into a consistent ApiError shape.
 * Never exposes raw backend stack traces to the UI.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const data = error.response?.data as Record<string, unknown> | undefined

    // Backend returned a structured error body
    if (data && typeof data === 'object') {
      return {
        statusCode: status,
        message:
          (data['message'] as string) ||
          (data['error'] as string) ||    // backend uses { error: "..." } on many failure responses
          (data['title'] as string) ||
          getDefaultMessage(status),
        errors: data['errors'] as Record<string, string[]> | undefined,
      }
    }

    // Network error (no response)
    if (!error.response) {
      return {
        statusCode: 0,
        message:
          'Unable to reach the server. Please check your connection and try again.',
      }
    }

    return {
      statusCode: status,
      message: getDefaultMessage(status),
    }
  }

  // Non-axios error
  return {
    statusCode: 0,
    message: 'An unexpected error occurred. Please try again.',
  }
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input.'
    case 401:
      return 'Your session has expired. Please log in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'A conflict occurred. The resource may already exist.'
    case 422:
      return 'Validation failed. Please review the form.'
    case 429:
      return 'Too many requests. Please wait a moment before trying again.'
    case 500:
      return 'A server error occurred. Please try again later.'
    case 503:
      return 'The service is temporarily unavailable. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
