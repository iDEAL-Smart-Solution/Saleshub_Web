import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSales } from '@/features/sales/hooks/useSales'
import { useSaleStore } from '@/stores/saleStore'
import { SaleStatus } from '@/types'
import type { SaleSummaryResponse } from '@/types'

vi.mock('@/services/api/sale.service', () => ({
  getAllSalesApi:         vi.fn(),
  getMySalesApi:         vi.fn(),
  getSalesByMarketerApi: vi.fn(),
  getSaleByIdApi:        vi.fn(),
  createSaleApi:         vi.fn(),
  confirmSaleApi:        vi.fn(),
  rejectSaleApi:         vi.fn(),
  refundSaleApi:         vi.fn(),
}))

import * as saleService from '@/services/api/sale.service'

const mockSale: SaleSummaryResponse = {
  id: 's1', marketerName: 'Alice', customerName: 'Acme',
  productName: 'Widget', saleDate: '2026-08-01T00:00:00Z',
  amount: 50000, status: SaleStatus.Pending, createdAt: '2026-08-01T00:00:00Z',
}

describe('useSales hook', () => {
  beforeEach(() => {
    useSaleStore.setState({
      sales: [], mySales: [], selectedSale: null,
      isLoading: false, isActionLoading: false, error: null,
    })
    vi.clearAllMocks()
  })

  it('fetchAllSales stores sales on success', async () => {
    vi.mocked(saleService.getAllSalesApi).mockResolvedValue([mockSale])
    const { result } = renderHook(() => useSales())

    await act(async () => { await result.current.fetchAllSales() })

    expect(result.current.sales).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('fetchAllSales sets error on failure', async () => {
    vi.mocked(saleService.getAllSalesApi).mockRejectedValue(new Error('500'))
    const { result } = renderHook(() => useSales())

    await act(async () => { await result.current.fetchAllSales() })

    expect(result.current.error).not.toBeNull()
  })

  it('fetchMySales stores own sales', async () => {
    vi.mocked(saleService.getMySalesApi).mockResolvedValue([mockSale])
    const { result } = renderHook(() => useSales())

    await act(async () => { await result.current.fetchMySales() })

    expect(result.current.mySales).toHaveLength(1)
  })

  it('confirmSale updates status to Confirmed', async () => {
    vi.mocked(saleService.confirmSaleApi).mockResolvedValue(undefined)
    useSaleStore.getState().setSales([mockSale])
    const { result } = renderHook(() => useSales())

    await act(async () => { await result.current.confirmSale('s1') })

    expect(result.current.sales[0].status).toBe(SaleStatus.Confirmed)
  })

  it('rejectSale updates status to Rejected', async () => {
    vi.mocked(saleService.rejectSaleApi).mockResolvedValue(undefined)
    useSaleStore.getState().setSales([mockSale])
    const { result } = renderHook(() => useSales())

    await act(async () => { await result.current.rejectSale('s1', { reason: 'Duplicate' }) })

    expect(result.current.sales[0].status).toBe(SaleStatus.Rejected)
  })

  it('confirmSale returns false and sets error on API failure', async () => {
    vi.mocked(saleService.confirmSaleApi).mockRejectedValue(new Error('403'))
    const { result } = renderHook(() => useSales())

    let ok = true
    await act(async () => { ok = await result.current.confirmSale('s1') })

    expect(ok).toBe(false)
    expect(result.current.error).not.toBeNull()
  })
})
