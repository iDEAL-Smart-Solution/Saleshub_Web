import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProductStore } from '@/stores/productStore'
import type { ProductResponse } from '@/types'

const p1: ProductResponse = {
  id: 'p1', name: 'Solar Panel 200W', isActive: true, createdAt: '2026-01-01T00:00:00Z',
}
const p2: ProductResponse = {
  id: 'p2', name: 'Inverter 5KVA', isActive: false, createdAt: '2026-02-01T00:00:00Z',
}

describe('productStore', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [], selectedProduct: null,
      isLoading: false, isActionLoading: false, error: null,
    })
    vi.restoreAllMocks()
  })

  it('setProducts stores the list', () => {
    useProductStore.getState().setProducts([p1, p2])
    expect(useProductStore.getState().products).toHaveLength(2)
  })

  it('upsertProduct inserts a new product', () => {
    useProductStore.getState().upsertProduct(p1)
    expect(useProductStore.getState().products).toHaveLength(1)
    expect(useProductStore.getState().products[0].name).toBe('Solar Panel 200W')
  })

  it('upsertProduct updates an existing product', () => {
    useProductStore.getState().setProducts([p1])
    useProductStore.getState().upsertProduct({ ...p1, name: 'Solar Panel 400W' })
    const products = useProductStore.getState().products
    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Solar Panel 400W')
  })

  it('setSelectedProduct stores selection', () => {
    useProductStore.getState().setSelectedProduct(p1)
    expect(useProductStore.getState().selectedProduct?.id).toBe('p1')
  })

  it('setError stores error message', () => {
    useProductStore.getState().setError('Network failure')
    expect(useProductStore.getState().error).toBe('Network failure')
  })

  it('setLoading toggles loading flag', () => {
    useProductStore.getState().setLoading(true)
    expect(useProductStore.getState().isLoading).toBe(true)
    useProductStore.getState().setLoading(false)
    expect(useProductStore.getState().isLoading).toBe(false)
  })
})
