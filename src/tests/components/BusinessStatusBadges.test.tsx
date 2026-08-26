import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import ProductStatusBadge from '@/features/products/components/ProductStatusBadge'
import CommissionStatusBadge from '@/features/commissions/components/CommissionStatusBadge'
import { CommissionStatus, SaleStatus } from '@/types'

describe('business status badges', () => {
  it('renders the backend sale status', () => {
    render(<SaleStatusBadge status={SaleStatus.Confirmed} />)
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })

  it('renders product activation state', () => {
    render(<ProductStatusBadge isActive={false} />)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('renders the backend commission status', () => {
    render(<CommissionStatusBadge status={CommissionStatus.Paid} />)
    expect(screen.getByText('Paid')).toBeInTheDocument()
  })
})
