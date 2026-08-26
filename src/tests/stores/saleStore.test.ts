import { describe, it, expect, beforeEach } from 'vitest'
import { useSaleStore } from '@/stores/saleStore'
import { SaleStatus } from '@/types'
import type { SaleSummaryResponse } from '@/types'

const s1: SaleSummaryResponse = {
  id: 's1', marketerName: 'Alice', customerName: 'Acme Ltd',
  productName: 'Widget', saleDate: '2026-08-01T00:00:00Z',
  amount: 50000, status: SaleStatus.Pending, createdAt: '2026-08-01T00:00:00Z',
}
const s2: SaleSummaryResponse = { ...s1, id: 's2', status: SaleStatus.Confirmed }

describe('saleStore', () => {
  beforeEach(() => {
    useSaleStore.setState({
      sales: [], mySales: [], selectedSale: null,
      isLoading: false, isActionLoading: false, error: null,
    })
  })

  it('setSales stores sales list', () => {
    useSaleStore.getState().setSales([s1, s2])
    expect(useSaleStore.getState().sales).toHaveLength(2)
  })

  it('setMySales stores own sales', () => {
    useSaleStore.getState().setMySales([s1])
    expect(useSaleStore.getState().mySales).toHaveLength(1)
  })

  it('updateSaleStatus patches status in both lists', () => {
    useSaleStore.getState().setSales([s1])
    useSaleStore.getState().setMySales([s1])
    useSaleStore.getState().updateSaleStatus('s1', SaleStatus.Confirmed)

    expect(useSaleStore.getState().sales[0].status).toBe(SaleStatus.Confirmed)
    expect(useSaleStore.getState().mySales[0].status).toBe(SaleStatus.Confirmed)
  })

  it('updateSaleStatus also patches selectedSale', () => {
    const fullSale = { ...s1, marketerId: 'u1', customerId: 'c1', productId: 'prod1',
      recordedById: 'u1', recordedByName: 'Alice' }
    useSaleStore.getState().setSelectedSale(fullSale)
    useSaleStore.getState().updateSaleStatus('s1', SaleStatus.Rejected)
    expect(useSaleStore.getState().selectedSale?.status).toBe(SaleStatus.Rejected)
  })

  it('updateSaleStatus does not touch unrelated sales', () => {
    useSaleStore.getState().setSales([s1, s2])
    useSaleStore.getState().updateSaleStatus('s1', SaleStatus.Refunded)
    expect(useSaleStore.getState().sales[1].status).toBe(SaleStatus.Confirmed)
  })
})
