import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { CustomerResponse, CreateCustomerRequest, UpdateCustomerRequest } from '@/types'

export async function getAllCustomersApi(search?: string): Promise<CustomerResponse[]> {
  try {
    const params = search ? { search } : {}
    return (await apiClient.get<CustomerResponse[]>('/customers', { params })).data
  } catch (e) { throw normalizeApiError(e) }
}

export async function getCustomerByIdApi(id: string): Promise<CustomerResponse> {
  try { return (await apiClient.get<CustomerResponse>(`/customers/${id}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function createCustomerApi(data: CreateCustomerRequest): Promise<CustomerResponse> {
  try { return (await apiClient.post<CustomerResponse>('/customers', data)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function updateCustomerApi(id: string, data: UpdateCustomerRequest): Promise<CustomerResponse> {
  try { return (await apiClient.put<CustomerResponse>(`/customers/${id}`, data)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function activateCustomerApi(id: string): Promise<void> {
  try { await apiClient.post(`/customers/${id}/activate`) }
  catch (e) { throw normalizeApiError(e) }
}

export async function deactivateCustomerApi(id: string): Promise<void> {
  try { await apiClient.post(`/customers/${id}/deactivate`) }
  catch (e) { throw normalizeApiError(e) }
}
