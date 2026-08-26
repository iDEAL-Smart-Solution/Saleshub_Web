import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { SaleSummaryResponse, SaleResponse, CreateSaleRequest, RejectSaleRequest } from '@/types'

export async function getAllSalesApi(): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>('/sales')).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function getMySalesApi(): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>('/sales/my')).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function getSalesByMarketerApi(marketerId: string): Promise<SaleSummaryResponse[]> {
  try { return (await apiClient.get<SaleSummaryResponse[]>(`/sales/marketer/${marketerId}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function getSaleByIdApi(id: string): Promise<SaleResponse> {
  try { return (await apiClient.get<SaleResponse>(`/sales/${id}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function createSaleApi(data: CreateSaleRequest): Promise<SaleResponse> {
  try { return (await apiClient.post<SaleResponse>('/sales', data)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function confirmSaleApi(id: string): Promise<void> {
  try { await apiClient.post(`/sales/${id}/confirm`) }
  catch (e) { throw normalizeApiError(e) }
}

export async function rejectSaleApi(id: string, data: RejectSaleRequest): Promise<void> {
  try { await apiClient.post(`/sales/${id}/reject`, data) }
  catch (e) { throw normalizeApiError(e) }
}

export async function refundSaleApi(id: string): Promise<void> {
  try { await apiClient.post(`/sales/${id}/refund`) }
  catch (e) { throw normalizeApiError(e) }
}
