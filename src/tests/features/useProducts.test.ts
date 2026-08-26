import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useProductStore } from '@/stores/productStore'
import type { ProductResponse } from '@/types'

vi.mock('@/services/api/product.service', () => ({
  getAllProductsApi:   vi.fn(),
  getActiveProductsApi: vi.fn(),
  createProductApi:   vi.fn(),
  updateProductApi:   vi.fn(),
  activateProductApi: vi.fn(),
  deactivateProductApi: vi.fn(),
}))

import * as productService from '@/services/api/product.service'

const mockProduct: ProductResponse = {
  id: 'p1', name: 'Solar Panel', isActive: true, createdAt: '2026-01-01T00:00:00Z',
}

describe('useProducts hook', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [], selectedProduct: null,
      isLoading: false, isActionLoading: false, error: null,
    })
    vi.clearAllMocks()
  })

  it('fetchAllProducts sets products on success', async () => {
    vi.mocked(productService.getAllProductsApi).mockResolvedValue([mockProduct])
    const { result } = renderHook(() => useProducts())

    await act(async () => { await result.current.fetchAllProducts() })

    expect(result.current.products).toHaveLength(1)
    expect(result.current.products[0].name).toBe('Solar Panel')
    expect(result.current.error).toBeNull()
  })

  it('fetchAllProducts sets error on failure', async () => {
    vi.mocked(productService.getAllProductsApi).mockRejectedValue(
      new Error('Network failure'),
    )
    const { result } = renderHook(() => useProducts())

    await act(async () => { await result.current.fetchAllProducts() })

    expect(result.current.error).not.toBeNull()
    expect(result.current.products).toHaveLength(0)
  })

  it('createProduct adds product to store on success', async () => {
    vi.mocked(productService.createProductApi).mockResolvedValue(mockProduct)
    const { result } = renderHook(() => useProducts())

    let ok = false
    await act(async () => {
      ok = await result.current.createProduct({ name: 'Solar Panel' })
    })

    expect(ok).toBe(true)
    expect(result.current.products).toHaveLength(1)
  })

  it('createProduct returns false and sets error on failure', async () => {
    vi.mocked(productService.createProductApi).mockRejectedValue(
      new Error('Duplicate name'),
    )
    const { result } = renderHook(() => useProducts())

    let ok = true
    await act(async () => {
      ok = await result.current.createProduct({ name: 'Bad' })
    })

    expect(ok).toBe(false)
    expect(result.current.error).not.toBeNull()
  })

  it('loading is true during fetch and false after', async () => {
    let resolveCall!: (v: ProductResponse[]) => void
    vi.mocked(productService.getAllProductsApi).mockImplementation(
      () => new Promise<ProductResponse[]>((res) => { resolveCall = res }),
    )
    const { result } = renderHook(() => useProducts())

    act(() => { void result.current.fetchAllProducts() })
    expect(result.current.isLoading).toBe(true)

    await act(async () => { resolveCall([]) })
    expect(result.current.isLoading).toBe(false)
  })
})
