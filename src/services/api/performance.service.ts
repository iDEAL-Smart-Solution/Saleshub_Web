import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { MonthlyPerformanceResponse, PerformanceComparisonResponse } from '@/types'

export async function getMyPerformanceApi(year?: number, month?: number): Promise<MonthlyPerformanceResponse | null> {
  try {
    const params: Record<string, number> = {}
    if (year)  params['year']  = year
    if (month) params['month'] = month
    return (await apiClient.get<MonthlyPerformanceResponse>('/marketers/me/performance', { params })).data
  } catch (e) {
    const err = normalizeApiError(e)
    if (err.statusCode === 404) return null
    throw err
  }
}

export async function getMyPerformanceHistoryApi(): Promise<MonthlyPerformanceResponse[]> {
  try { return (await apiClient.get<MonthlyPerformanceResponse[]>('/marketers/me/performance/history')).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function compareMyPerformanceApi(
  yearA: number, monthA: number, yearB: number, monthB: number,
): Promise<PerformanceComparisonResponse | null> {
  try {
    return (await apiClient.get<PerformanceComparisonResponse>('/marketers/me/performance/compare', {
      params: { yearA, monthA, yearB, monthB },
    })).data
  } catch (e) {
    const err = normalizeApiError(e)
    if (err.statusCode === 404) return null
    throw err
  }
}

export async function getMarketerPerformanceApi(
  marketerId: string, year?: number, month?: number,
): Promise<MonthlyPerformanceResponse | null> {
  try {
    const params: Record<string, number> = {}
    if (year)  params['year']  = year
    if (month) params['month'] = month
    return (await apiClient.get<MonthlyPerformanceResponse>(`/marketers/${marketerId}/performance`, { params })).data
  } catch (e) {
    const err = normalizeApiError(e)
    if (err.statusCode === 404) return null
    throw err
  }
}

export async function getMarketerPerformanceHistoryApi(marketerId: string): Promise<MonthlyPerformanceResponse[]> {
  try { return (await apiClient.get<MonthlyPerformanceResponse[]>(`/marketers/${marketerId}/performance/history`)).data }
  catch (e) { throw normalizeApiError(e) }
}

/**
 * GET /api/marketers/performance/history?year=
 * MarketingLeadOrAbove. Returns ALL performance records for ALL marketers,
 * newest-first. Optionally filtered by year.
 */
export async function getAllMarketerPerformanceHistoryApi(
  year?: number,
): Promise<MonthlyPerformanceResponse[]> {
  try {
    const params: Record<string, number> = {}
    if (year) params['year'] = year
    return (await apiClient.get<MonthlyPerformanceResponse[]>('/marketers/performance/history', { params })).data
  } catch (e) { throw normalizeApiError(e) }
}

/**
 * GET /api/marketers/performance?year=&month=
 * MarketingLeadOrAbove. Returns performance for ALL marketers for the given period.
 * Defaults to current month when year/month are omitted.
 * Used for the team/aggregate performance view.
 */
export async function getAllMarketerPerformanceApi(
  year?: number, month?: number,
): Promise<MonthlyPerformanceResponse[]> {
  try {
    const params: Record<string, number> = {}
    if (year)  params['year']  = year
    if (month) params['month'] = month
    return (await apiClient.get<MonthlyPerformanceResponse[]>('/marketers/performance', { params })).data
  } catch (e) { throw normalizeApiError(e) }
}
