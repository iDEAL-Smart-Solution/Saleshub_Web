import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTeamPerformance } from '@/features/performance/hooks/useTeamPerformance'
import { type MonthlyPerformanceResponse } from '@/types'

vi.mock('@/services/api/performance.service', () => ({
  getAllMarketerPerformanceApi:      vi.fn(),
  getMyPerformanceApi:              vi.fn(),
  getMyPerformanceHistoryApi:       vi.fn(),
  compareMyPerformanceApi:          vi.fn(),
  getMarketerPerformanceApi:        vi.fn(),
  getMarketerPerformanceHistoryApi: vi.fn(),
}))

import * as perfService from '@/services/api/performance.service'

const mockRecord: MonthlyPerformanceResponse = {
  id: 'p1',
  marketerId: 'm1',
  marketerName: 'Alice Adeyemi',
  year: 2026,
  month: 8,
  kpiTarget: 3,
  carriedSales: 0,
  newSales: 2,
  totalKpiProgress: 2,
  performancePercentage: 66.67,
  isKpiMet: false,
  kpiMetAt: null,
  bonusSalesCount: 0,
  kpiReward: 0,
  bonusCommission: 0,
  totalCommission: 0,
  isClosed: false,
  closedAt: null,
  createdAt: '2026-08-01T00:00:00Z',
  lastModifiedAt: null,
}

describe('useTeamPerformance hook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetchTeamPerformance stores all performance records on success', async () => {
    vi.mocked(perfService.getAllMarketerPerformanceApi).mockResolvedValue([mockRecord])
    const { result } = renderHook(() => useTeamPerformance())

    await act(async () => { await result.current.fetchTeamPerformance(2026, 8) })

    expect(result.current.performances).toHaveLength(1)
    expect(result.current.performances[0].marketerName).toBe('Alice Adeyemi')
    expect(result.current.error).toBeNull()
  })

  it('passes year and month parameters to the API', async () => {
    vi.mocked(perfService.getAllMarketerPerformanceApi).mockResolvedValue([])
    const { result } = renderHook(() => useTeamPerformance())

    await act(async () => { await result.current.fetchTeamPerformance(2026, 10) })

    expect(vi.mocked(perfService.getAllMarketerPerformanceApi)).toHaveBeenCalledWith(2026, 10)
  })

  it('fetchTeamPerformance returns empty list when no data for period', async () => {
    vi.mocked(perfService.getAllMarketerPerformanceApi).mockResolvedValue([])
    const { result } = renderHook(() => useTeamPerformance())

    await act(async () => { await result.current.fetchTeamPerformance(2026, 8) })

    expect(result.current.performances).toHaveLength(0)
    expect(result.current.error).toBeNull()
  })

  it('fetchTeamPerformance sets error on API failure', async () => {
    vi.mocked(perfService.getAllMarketerPerformanceApi).mockRejectedValue(new Error('500'))
    const { result } = renderHook(() => useTeamPerformance())

    await act(async () => { await result.current.fetchTeamPerformance(2026, 8) })

    expect(result.current.error).not.toBeNull()
    expect(result.current.performances).toHaveLength(0)
  })

  it('does not call the Marketer-only me endpoint', async () => {
    vi.mocked(perfService.getAllMarketerPerformanceApi).mockResolvedValue([])
    const { result } = renderHook(() => useTeamPerformance())

    await act(async () => { await result.current.fetchTeamPerformance(2026, 8) })

    expect(vi.mocked(perfService.getMyPerformanceApi)).not.toHaveBeenCalled()
  })

  it('multiple fetches for different periods stay independent', async () => {
    vi.mocked(perfService.getAllMarketerPerformanceApi)
      .mockResolvedValueOnce([mockRecord])
      .mockResolvedValueOnce([])
    const { result } = renderHook(() => useTeamPerformance())

    await act(async () => { await result.current.fetchTeamPerformance(2026, 8) })
    expect(result.current.performances).toHaveLength(1)

    await act(async () => { await result.current.fetchTeamPerformance(2026, 7) })
    expect(result.current.performances).toHaveLength(0)
  })
})
