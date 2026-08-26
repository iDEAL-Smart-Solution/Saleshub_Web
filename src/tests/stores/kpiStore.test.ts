import { describe, it, expect, beforeEach } from 'vitest'
import { useKpiStore } from '@/stores/kpiStore'
import type { KpiPeriodResponse } from '@/types'

const aug: KpiPeriodResponse = {
  id: 'k1', year: 2026, month: 8, targetSales: 3, isActive: true, createdAt: '2026-08-01T00:00:00Z',
}
const sep: KpiPeriodResponse = {
  id: 'k2', year: 2026, month: 9, targetSales: 4, isActive: true, createdAt: '2026-09-01T00:00:00Z',
}

describe('kpiStore', () => {
  beforeEach(() => {
    useKpiStore.setState({
      periods: [], currentPeriod: null,
      isLoading: false, isActionLoading: false, error: null,
    })
  })

  it('setPeriods stores all periods', () => {
    useKpiStore.getState().setPeriods([aug, sep])
    expect(useKpiStore.getState().periods).toHaveLength(2)
  })

  it('upsertPeriod inserts a new period', () => {
    useKpiStore.getState().upsertPeriod(aug)
    expect(useKpiStore.getState().periods).toHaveLength(1)
  })

  it('upsertPeriod updates an existing period', () => {
    useKpiStore.getState().setPeriods([aug])
    useKpiStore.getState().upsertPeriod({ ...aug, targetSales: 5 })
    const periods = useKpiStore.getState().periods
    expect(periods).toHaveLength(1)
    expect(periods[0].targetSales).toBe(5)
  })

  it('setCurrentPeriod sets the selected period', () => {
    useKpiStore.getState().setCurrentPeriod(aug)
    expect(useKpiStore.getState().currentPeriod?.month).toBe(8)
  })

  it('setError stores error message', () => {
    useKpiStore.getState().setError('Failed to load KPI')
    expect(useKpiStore.getState().error).toBe('Failed to load KPI')
  })
})
