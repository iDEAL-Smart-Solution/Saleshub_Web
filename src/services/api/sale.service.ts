import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { SaleSummaryResponse, SaleResponse, CreateSaleRequest, RejectSaleRequest } from '@/types'

/** GET /api/sales — Admin/Dev/MarketingLead */
export async function getAllSalesApi(): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>('/sales')).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/sales/my — Marketer (own sales) */
export async function getMySalesApi(): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>('/sales/my')).data }
  catch (e) { throw normalizeApiError(e) }
}

/**
 * GET /api/sales/my-distributor — Distributor
 * Returns sales for all marketers assigned to the authenticated distributor.
 */
export async function getDistributorSalesApi(): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>('/sales/my-distributor')).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/sales/marketer/{marketerId} — MarketingLeadOrAbove */
export async function getSalesByMarketerApi(marketerId: string): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>(`/sales/marketer/${marketerId}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/sales/distributor/{distributorId} — MarketingLeadOrAbove */
export async function getSalesByDistributorApi(distributorId: string): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>(`/sales/distributor/${distributorId}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

/** GET /api/sales/{id} — DistributorOrAbove + Distributor IDOR check */
export async function getSaleByIdApi(id: string): Promise<SaleResponse> {
  try { return (await apiClient.get<SaleResponse>(`/sales/${id}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

/**
 * POST /api/sales — CanRecordSale (Marketer, Distributor, Admin, Dev)
 * Backend enforces:
 *   Marketer   → MarketerId overridden to self
 *   Distributor → MarketerId must be an assigned marketer
 *   MarketingLead → FORBIDDEN (backend 403)
 */
export async function createSaleApi(data: CreateSaleRequest): Promise<SaleResponse> {
  try { return (await apiClient.post<SaleResponse>('/sales', data)).data }
  catch (e) { throw normalizeApiError(e) }
}

/** POST /api/sales/{id}/confirm — CanApproveSale (Dev/Admin/MarketingLead) */
export async function confirmSaleApi(id: string): Promise<void> {
  try { await apiClient.post(`/sales/${id}/confirm`) }
  catch (e) { throw normalizeApiError(e) }
}

/** POST /api/sales/{id}/reject — CanApproveSale */
export async function rejectSaleApi(id: string, data: RejectSaleRequest): Promise<void> {
  try { await apiClient.post(`/sales/${id}/reject`, data) }
  catch (e) { throw normalizeApiError(e) }
}

/** POST /api/sales/{id}/refund — DevOrAdmin */
export async function refundSaleApi(id: string): Promise<void> {
  try { await apiClient.post(`/sales/${id}/refund`) }
  catch (e) { throw normalizeApiError(e) }
}
