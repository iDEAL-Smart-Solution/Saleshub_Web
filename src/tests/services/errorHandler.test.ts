import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { normalizeApiError } from '@/services/api/errorHandler'

describe('normalizeApiError', () => {
  it('handles network error (no response)', () => {
    const err = new axios.AxiosError('Network Error')
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(0)
    expect(result.message).toContain('Unable to reach')
  })

  it('handles 401 response', () => {
    const err = new axios.AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      data: { message: 'Token expired' },
      statusText: 'Unauthorized',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Token expired')
  })

  it('handles 403 with default message when no body', () => {
    const err = new axios.AxiosError('Forbidden', '403', undefined, undefined, {
      status: 403,
      data: {},
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(403)
    expect(result.message).toContain('permission')
  })

  it('handles non-axios errors', () => {
    const result = normalizeApiError(new Error('Random error'))
    expect(result.statusCode).toBe(0)
    expect(result.message).toContain('unexpected')
  })

  it('handles 400 with validation errors', () => {
    const err = new axios.AxiosError('Bad Request', '400', undefined, undefined, {
      status: 400,
      data: { message: 'Validation failed', errors: { email: ['Email already exists'] } },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(400)
    expect(result.errors?.email?.[0]).toBe('Email already exists')
  })
})
