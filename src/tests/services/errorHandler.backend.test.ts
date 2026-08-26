/**
 * Additional errorHandler tests — verifies the backend { error: "..." } shape
 * that the backend uses on login failures, registration failures, etc.
 */
import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { normalizeApiError } from '@/services/api/errorHandler'

describe('normalizeApiError — backend { error } key', () => {
  it('extracts the error field from a 401 login failure', () => {
    const err = new axios.AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      data: { error: 'Invalid email or password.' },
      statusText: 'Unauthorized',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Invalid email or password.')
  })

  it('extracts the error field from a 400 registration failure', () => {
    const err = new axios.AxiosError('Bad Request', '400', undefined, undefined, {
      status: 400,
      data: { error: 'Email already exists.' },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(400)
    expect(result.message).toBe('Email already exists.')
  })

  it('prefers message over error when both are present', () => {
    const err = new axios.AxiosError('Bad Request', '400', undefined, undefined, {
      status: 400,
      data: { message: 'Validation failed', error: 'Should not be used' },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.message).toBe('Validation failed')
  })

  it('falls back to default when neither message nor error is present', () => {
    const err = new axios.AxiosError('Conflict', '409', undefined, undefined, {
      status: 409,
      data: {},
      statusText: 'Conflict',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.statusCode).toBe(409)
    expect(result.message).toContain('conflict')
  })

  it('extracts error from a sale operation failure', () => {
    const err = new axios.AxiosError('Bad Request', '400', undefined, undefined, {
      status: 400,
      data: { error: 'Sale cannot be confirmed. It has already been processed.' },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    })
    const result = normalizeApiError(err)
    expect(result.message).toBe('Sale cannot be confirmed. It has already been processed.')
  })
})
