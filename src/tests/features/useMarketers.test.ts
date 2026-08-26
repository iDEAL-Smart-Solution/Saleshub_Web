import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMarketers } from '@/features/users/hooks/useMarketers'
import type { MarketerSummaryResponse } from '@/types'

vi.mock('@/services/api/user.service', () => ({
  getActiveMarketersApi:  vi.fn(),
  getAllUsersApi:          vi.fn(),
  getPendingMarketersApi: vi.fn(),
  getUserByIdApi:         vi.fn(),
  createUserApi:          vi.fn(),
  approveMarketerApi:     vi.fn(),
  activateUserApi:        vi.fn(),
  deactivateUserApi:      vi.fn(),
  changeUserRoleApi:      vi.fn(),
}))

import * as userService from '@/services/api/user.service'

const mockMarketers: MarketerSummaryResponse[] = [
  { id: 'm1', firstName: 'Alice', lastName: 'Adeyemi', email: 'alice@test.com', isActive: true },
  { id: 'm2', firstName: 'Bob',   lastName: 'Bello',   email: 'bob@test.com',   isActive: true },
]

describe('useMarketers hook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetchMarketers stores marketers on success', async () => {
    vi.mocked(userService.getActiveMarketersApi).mockResolvedValue(mockMarketers)
    const { result } = renderHook(() => useMarketers())

    await act(async () => { await result.current.fetchMarketers() })

    expect(result.current.marketers).toHaveLength(2)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('fetchMarketers sets error on API failure', async () => {
    vi.mocked(userService.getActiveMarketersApi).mockRejectedValue(new Error('403'))
    const { result } = renderHook(() => useMarketers())

    await act(async () => { await result.current.fetchMarketers() })

    expect(result.current.error).not.toBeNull()
    expect(result.current.marketers).toHaveLength(0)
  })

  it('starts with empty list and no error', () => {
    const { result } = renderHook(() => useMarketers())
    expect(result.current.marketers).toHaveLength(0)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('isLoading is true during fetch and false after', async () => {
    let resolve!: (v: MarketerSummaryResponse[]) => void
    vi.mocked(userService.getActiveMarketersApi).mockImplementation(
      () => new Promise<MarketerSummaryResponse[]>((res) => { resolve = res }),
    )
    const { result } = renderHook(() => useMarketers())

    act(() => { void result.current.fetchMarketers() })
    expect(result.current.isLoading).toBe(true)

    await act(async () => { resolve([]) })
    expect(result.current.isLoading).toBe(false)
  })

  it('clearError resets error to null', async () => {
    vi.mocked(userService.getActiveMarketersApi).mockRejectedValue(new Error('500'))
    const { result } = renderHook(() => useMarketers())

    await act(async () => { await result.current.fetchMarketers() })
    expect(result.current.error).not.toBeNull()

    act(() => { result.current.clearError() })
    expect(result.current.error).toBeNull()
  })
})
