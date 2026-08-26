import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { KpiPeriodResponse, CreateKpiPeriodRequest, UpdateKpiPeriodRequest } from '@/types'

export async function getAllKpiPeriodsApi(): Promise<KpiPeriodResponse[]> {
  try { return (await apiClient.get<KpiPeriodResponse[]>('/kpi-periods')).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function getKpiPeriodApi(year: number, month: number): Promise<KpiPeriodResponse | null> {
  try { return (await apiClient.get<KpiPeriodResponse>(`/kpi-periods/${year}/${month}`)).data }
  catch (e) {
    const err = normalizeApiError(e)
    if (err.statusCode === 404) return null
    throw err
  }
}

export async function createKpiPeriodApi(data: CreateKpiPeriodRequest): Promise<KpiPeriodResponse> {
  try { return (await apiClient.post<KpiPeriodResponse>('/kpi-periods', data)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function updateKpiPeriodApi(year: number, month: number, data: UpdateKpiPeriodRequest): Promise<KpiPeriodResponse> {
  try { return (await apiClient.put<KpiPeriodResponse>(`/kpi-periods/${year}/${month}`, data)).data }
  catch (e) { throw normalizeApiError(e) }
}
