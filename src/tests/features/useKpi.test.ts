import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKpi } from '@/features/kpi/hooks/useKpi'
import { useKpiStore } from '@/stores/kpiStore'
import type { KpiPeriodResponse } from '@/types'

vi.mock('@/services/api/kpi.service', () => ({
  getAllKpiPeriodsApi:  vi.fn(),
  getKpiPeriodApi:     vi.fn(),
  createKpiPeriodApi:  vi.fn(),
  updateKpiPeriodApi:  vi.fn(),
}))

import * as kpiService from '@/services/api/kpi.service'

const period: KpiPeriodResponse = {
  id: 'k1', year: 2026, month: 8, targetSales: 5, isActive: true,
  createdAt: '2026-08-01T00:00:00Z',
}

describe('useKpi hook', () => {
  beforeEach(() => {
    useKpiStore.setState({
      periods: [], currentPeriod: null,
      isLoading: false, isActionLoading: false, error: null,
    })
    vi.clearAllMocks()
  })

  it('fetchAllPeriods stores periods on success', async () => {
    vi.mocked(kpiService.getAllKpiPeriodsApi).mockResolvedValue([period])
    const { result } = renderHook(() => useKpi())

    await act(async () => { await result.current.fetchAllPeriods() })

    expect(result.current.periods).toHaveLength(1)
    expect(result.current.periods[0].targetSales).toBe(5)
    expect(result.current.error).toBeNull()
  })

  it('fetchAllPeriods sets error on failure', async () => {
    vi.mocked(kpiService.getAllKpiPeriodsApi).mockRejectedValue(new Error('500'))
    const { result } = renderHook(() => useKpi())

    await act(async () => { await result.current.fetchAllPeriods() })

    expect(result.current.error).not.toBeNull()
  })

  it('createPeriod adds new period to store on success', async () => {
    vi.mocked(kpiService.createKpiPeriodApi).mockResolvedValue(period)
    const { result } = renderHook(() => useKpi())

    let ok = false
    await act(async () => {
      ok = await result.current.createPeriod({ year: 2026, month: 8, targetSales: 5 })
    })

    expect(ok).toBe(true)
    expect(result.current.periods).toHaveLength(1)
    expect(result.current.currentPeriod?.id).toBe('k1')
  })

  it('createPeriod returns false and sets error on failure', async () => {
    vi.mocked(kpiService.createKpiPeriodApi).mockRejectedValue(
      new Error('A KPI period already exists for August 2026.')
    )
    const { result } = renderHook(() => useKpi())

    let ok = true
    await act(async () => {
      ok = await result.current.createPeriod({ year: 2026, month: 8, targetSales: 5 })
    })

    expect(ok).toBe(false)
    expect(result.current.error).not.toBeNull()
  })

  it('updatePeriod replaces existing period in store', async () => {
    vi.mocked(kpiService.updateKpiPeriodApi).mockResolvedValue({ ...period, targetSales: 10 })
    useKpiStore.getState().setPeriods([period])
    const { result } = renderHook(() => useKpi())

    let ok = false
    await act(async () => {
      ok = await result.current.updatePeriod(2026, 8, { targetSales: 10 })
    })

    expect(ok).toBe(true)
    expect(result.current.periods[0].targetSales).toBe(10)
  })

  it('updatePeriod returns false and sets error on failure', async () => {
    vi.mocked(kpiService.updateKpiPeriodApi).mockRejectedValue(new Error('Not found'))
    const { result } = renderHook(() => useKpi())

    let ok = true
    await act(async () => {
      ok = await result.current.updatePeriod(2026, 8, { targetSales: 10 })
    })

    expect(ok).toBe(false)
    expect(result.current.error).not.toBeNull()
  })
})
