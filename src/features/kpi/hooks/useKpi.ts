import { useCallback } from 'react'
import { useKpiStore } from '@/stores/kpiStore'
import {
  getAllKpiPeriodsApi,
  getKpiPeriodApi,
  createKpiPeriodApi,
  updateKpiPeriodApi,
} from '@/services/api/kpi.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { CreateKpiPeriodRequest, UpdateKpiPeriodRequest } from '@/types'

export function useKpi() {
  const store = useKpiStore()

  // Callbacks read actions via `useKpiStore.getState()` with `[]` deps so their
  // identity stays stable across renders. (Depending on the subscribed `store`
  // object gives every callback a new identity per store update → infinite loop
  // when used in a `useEffect` dep array.)

  const fetchAllPeriods = useCallback(async () => {
    const s = useKpiStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setPeriods(await getAllKpiPeriodsApi())
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchPeriod = useCallback(async (year: number, month: number) => {
    const s = useKpiStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      const p = await getKpiPeriodApi(year, month)
      s.setCurrentPeriod(p)
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const createPeriod = useCallback(
    async (data: CreateKpiPeriodRequest): Promise<boolean> => {
      const s = useKpiStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        const p = await createKpiPeriodApi(data)
        s.upsertPeriod(p)
        s.setCurrentPeriod(p)
        return true
      } catch (e) {
        s.setError(normalizeApiError(e).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [],
  )

  const updatePeriod = useCallback(
    async (year: number, month: number, data: UpdateKpiPeriodRequest): Promise<boolean> => {
      const s = useKpiStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        const p = await updateKpiPeriodApi(year, month, data)
        s.upsertPeriod(p)
        s.setCurrentPeriod(p)
        return true
      } catch (e) {
        s.setError(normalizeApiError(e).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [],
  )

  return {
    periods:          store.periods,
    currentPeriod:    store.currentPeriod,
    isLoading:        store.isLoading,
    isActionLoading:  store.isActionLoading,
    error:            store.error,
    fetchAllPeriods,
    fetchPeriod,
    createPeriod,
    updatePeriod,
    clearError:       () => useKpiStore.getState().setError(null),
  }
}
