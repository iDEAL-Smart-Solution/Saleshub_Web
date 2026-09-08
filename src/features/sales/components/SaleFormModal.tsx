import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import type {
  CreateSaleRequest,
  CustomerResponse,
  ProductResponse,
  MarketerSummaryResponse,
} from '@/types'

const schema = z.object({
  marketerId: z.string().uuid('Select a marketer'),
  customerId: z.string().uuid('Select a customer'),
  productId:  z.string().uuid('Select a product'),
  saleDate:   z.string().min(1, 'Sale date is required'),
  amount:     z.coerce.number<number>().positive('Amount must be greater than zero'),
})
type Values = z.infer<typeof schema>

interface Props {
  isOpen:    boolean
  onClose:   () => void
  /** All eligible marketers to select from. Required for all recorder roles. */
  marketers: MarketerSummaryResponse[]
  customers: CustomerResponse[]
  products:  ProductResponse[]
  onSubmit:  (data: CreateSaleRequest) => Promise<boolean>
  isLoading: boolean
  error?:    string | null
}

export default function SaleFormModal({
  isOpen, onClose, marketers, customers, products,
  onSubmit, isLoading, error,
}: Props) {
  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { saleDate: new Date().toISOString().slice(0, 10) },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        marketerId: '',
        customerId: '',
        productId:  '',
        saleDate:   new Date().toISOString().slice(0, 10),
        amount:     undefined,
      })
    }
  }, [isOpen, reset])

  const close = () => { reset(); onClose() }

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Record sale"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button form="sale-form" type="submit" isLoading={isLoading}>
            Record sale
          </Button>
        </>
      }
    >
      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-[#FFEBEE] p-3 text-sm text-[#C62828]">
          {error}
        </p>
      )}

      <form
        id="sale-form"
        className="space-y-4"
        noValidate
        onSubmit={handleSubmit(async (v) => { if (await onSubmit(v)) close() })}
      >
        {/* Marketer selector — always shown; recorder picks a marketer */}
        <Select
          label="Marketer"
          required
          placeholder="Select a marketer…"
          options={marketers.map((m) => ({
            value: m.id,
            label: `${m.firstName} ${m.lastName}`,
          }))}
          error={errors.marketerId?.message}
          {...register('marketerId')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Customer"
            required
            placeholder="Select a customer…"
            options={customers.filter((c) => c.isActive).map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            error={errors.customerId?.message}
            {...register('customerId')}
          />
          <Select
            label="Product"
            required
            placeholder="Select a product…"
            options={products.filter((p) => p.isActive).map((p) => ({
              value: p.id,
              label: p.name,
            }))}
            error={errors.productId?.message}
            {...register('productId')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Sale date"
            required
            type="date"
            error={errors.saleDate?.message}
            {...register('saleDate')}
          />
          <Input
            label="Amount (₦)"
            required
            type="number"
            min="0.01"
            step="0.01"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </div>
      </form>
    </Modal>
  )
}
