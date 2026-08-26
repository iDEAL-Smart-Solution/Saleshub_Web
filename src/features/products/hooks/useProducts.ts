import { useCallback } from 'react'
import { useProductStore } from '@/stores/productStore'
import {
  getAllProductsApi,
  getActiveProductsApi,
  createProductApi,
  updateProductApi,
  activateProductApi,
  deactivateProductApi,
} from '@/services/api/product.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { CreateProductRequest, UpdateProductRequest } from '@/types'

export function useProducts() {
  const store = useProductStore()

  // Callbacks read actions/state via `useProductStore.getState()` with `[]` deps so
  // their identity stays stable across renders. (Depending on the subscribed `store`
  // object gives every callback a new identity per store update → infinite loop when
  // used in a `useEffect` dep array.)

  const fetchAllProducts = useCallback(async () => {
    const s = useProductStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setProducts(await getAllProductsApi())
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchActiveProducts = useCallback(async () => {
    const s = useProductStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setProducts(await getActiveProductsApi())
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const createProduct = useCallback(
    async (data: CreateProductRequest): Promise<boolean> => {
      const s = useProductStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        const p = await createProductApi(data)
        s.upsertProduct(p)
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

  const updateProduct = useCallback(
    async (id: string, data: UpdateProductRequest): Promise<boolean> => {
      const s = useProductStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        const p = await updateProductApi(id, data)
        s.upsertProduct(p)
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

  const activateProduct = useCallback(async (id: string): Promise<boolean> => {
    const s = useProductStore.getState()
    s.setActionLoading(true)
    s.setError(null)
    try {
      await activateProductApi(id)
      const existing = useProductStore.getState().products.find((p) => p.id === id)
      if (existing) s.upsertProduct({ ...existing, isActive: true })
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  const deactivateProduct = useCallback(async (id: string): Promise<boolean> => {
    const s = useProductStore.getState()
    s.setActionLoading(true)
    s.setError(null)
    try {
      await deactivateProductApi(id)
      const existing = useProductStore.getState().products.find((p) => p.id === id)
      if (existing) s.upsertProduct({ ...existing, isActive: false })
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  return {
    products:          store.products,
    selectedProduct:   store.selectedProduct,
    isLoading:         store.isLoading,
    isActionLoading:   store.isActionLoading,
    error:             store.error,
    fetchAllProducts,
    fetchActiveProducts,
    createProduct,
    updateProduct,
    activateProduct,
    deactivateProduct,
    setSelectedProduct: store.setSelectedProduct,
    clearError:         () => useProductStore.getState().setError(null),
  }
}
