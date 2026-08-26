import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import type { CreateCustomerRequest, CustomerResponse } from '@/types'

const optional = (max: number) => z.string().max(max).optional()
const schema = z.object({ name: z.string().trim().min(1, 'Customer name is required').max(300), contactPerson: optional(200), email: z.string().email('Enter a valid email').max(256).optional().or(z.literal('')), phoneNumber: optional(20), address: optional(500) })
type Values = z.infer<typeof schema>
interface Props { isOpen: boolean; onClose: () => void; customer?: CustomerResponse | null; onSubmit: (data: CreateCustomerRequest) => Promise<boolean>; isLoading: boolean; error?: string | null }

export default function CustomerFormModal({ isOpen, onClose, customer, onSubmit, isLoading, error }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) })
  useEffect(() => { reset({ name: customer?.name ?? '', contactPerson: customer?.contactPerson ?? '', email: customer?.email ?? '', phoneNumber: customer?.phoneNumber ?? '', address: customer?.address ?? '' }) }, [customer, reset, isOpen])
  const close = () => { reset(); onClose() }
  const blank = (v?: string) => v?.trim() || undefined
  return <Modal isOpen={isOpen} onClose={close} title={customer ? 'Edit customer' : 'New customer'} footer={<><Button variant="outline" onClick={close}>Cancel</Button><Button form="customer-form" type="submit" isLoading={isLoading}>{customer ? 'Save changes' : 'Create customer'}</Button></>}>
    {error && <p role="alert" className="mb-4 rounded-lg bg-[#FFEBEE] p-3 text-sm text-[#C62828]">{error}</p>}
    <form id="customer-form" onSubmit={handleSubmit(async v => { if (await onSubmit({ name: v.name.trim(), contactPerson: blank(v.contactPerson), email: blank(v.email), phoneNumber: blank(v.phoneNumber), address: blank(v.address) })) close() })} className="space-y-4" noValidate>
      <Input label="Customer name" required error={errors.name?.message} {...register('name')} />
      <Input label="Contact person" error={errors.contactPerson?.message} {...register('contactPerson')} />
      <div className="grid gap-4 sm:grid-cols-2"><Input label="Email" type="email" error={errors.email?.message} {...register('email')} /><Input label="Phone number" error={errors.phoneNumber?.message} {...register('phoneNumber')} /></div>
      <Input label="Address" error={errors.address?.message} {...register('address')} />
    </form>
  </Modal>
}
