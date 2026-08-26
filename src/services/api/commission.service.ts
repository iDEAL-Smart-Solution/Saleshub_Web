import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { CommissionResponse } from '@/types'
import { CommissionStatus } from '@/types'

/** GET /api/commissions — DevOrAdmin only */
export async function getAllCommissionsApi(): Promise<CommissionResponse[]> {
  try { return (await apiClient.get<CommissionResponse[]>('/commissions')).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/commissions/my — AuthenticatedMarketer */
export async function getMyCommissionsApi(): Promise<CommissionResponse[]> {
  try { return (await apiClient.get<CommissionResponse[]>('/commissions/my')).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/commissions/marketer/{marketerId} — MarketingLeadOrAbove */
export async function getCommissionsByMarketerApi(marketerId: string): Promise<CommissionResponse[]> {
  try { return (await apiClient.get<CommissionResponse[]>(`/commissions/marketer/${marketerId}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/commissions/performance/{performanceId} — MarketingLeadOrAbove */
export async function getCommissionsByPerformanceApi(performanceId: string): Promise<CommissionResponse[]> {
  try { return (await apiClient.get<CommissionResponse[]>(`/commissions/performance/${performanceId}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

/**
 * PATCH /api/commissions/{id}/status
 * DevOrAdmin only. Manually advances commission through payout lifecycle.
 * Pending → Approved → Paid   (or Cancelled from Pending/Approved)
 */
export async function updateCommissionStatusApi(
  id: string,
  status: CommissionStatus,
  note?: string,
): Promise<CommissionResponse> {
  try {
    return (await apiClient.patch<CommissionResponse>(`/commissions/${id}/status`, { status, note })).data
  } catch (e) { throw normalizeApiError(e) }
}
