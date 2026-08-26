import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { ProductResponse, CreateProductRequest, UpdateProductRequest } from '@/types'

export async function getAllProductsApi(): Promise<ProductResponse[]> {
  try { return (await apiClient.get<ProductResponse[]>('/products')).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function getActiveProductsApi(): Promise<ProductResponse[]> {
  try { return (await apiClient.get<ProductResponse[]>('/products/active')).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function getProductByIdApi(id: string): Promise<ProductResponse> {
  try { return (await apiClient.get<ProductResponse>(`/products/${id}`)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function createProductApi(data: CreateProductRequest): Promise<ProductResponse> {
  try { return (await apiClient.post<ProductResponse>('/products', data)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function updateProductApi(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
  try { return (await apiClient.put<ProductResponse>(`/products/${id}`, data)).data }
  catch (e) { throw normalizeApiError(e) }
}

export async function activateProductApi(id: string): Promise<void> {
  try { await apiClient.post(`/products/${id}/activate`) }
  catch (e) { throw normalizeApiError(e) }
}

export async function deactivateProductApi(id: string): Promise<void> {
  try { await apiClient.post(`/products/${id}/deactivate`) }
  catch (e) { throw normalizeApiError(e) }
}
