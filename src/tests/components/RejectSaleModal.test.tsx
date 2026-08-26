import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import RejectSaleModal from '@/features/sales/components/RejectSaleModal'

const noop = async () => false

function renderModal(props?: Partial<React.ComponentProps<typeof RejectSaleModal>>) {
  return render(
    <RejectSaleModal
      isOpen
      onClose={vi.fn()}
      onSubmit={noop}
      isLoading={false}
      {...props}
    />,
  )
}

describe('RejectSaleModal', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the modal with a reason textarea', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByLabelText(/reason for rejection/i)).toBeDefined()
  })

  it('shows optional label hint', () => {
    renderModal()
    expect(screen.getByText(/optional/i)).toBeDefined()
  })

  it('calls onSubmit with an empty reason when submitted without input', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    renderModal({ onSubmit })
    await userEvent.click(screen.getByRole('button', { name: /reject sale/i }))
    expect(onSubmit).toHaveBeenCalledWith({ reason: undefined })
  })

  it('calls onSubmit with the typed reason', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    renderModal({ onSubmit })
    await userEvent.type(
      screen.getByLabelText(/reason for rejection/i),
      'Duplicate entry',
    )
    await userEvent.click(screen.getByRole('button', { name: /reject sale/i }))
    expect(onSubmit).toHaveBeenCalledWith({ reason: 'Duplicate entry' })
  })

  it('displays backend error when provided', () => {
    renderModal({ error: 'Sale has already been processed.' })
    expect(screen.getByRole('alert')).toBeDefined()
    expect(screen.getByText('Sale has already been processed.')).toBeDefined()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('disables Cancel while loading', () => {
    renderModal({ isLoading: true })
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })
})
