import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import type { CreateProductRequest, ProductResponse } from '@/types'

const schema = z.object({ name: z.string().trim().min(1, 'Product name is required').max(200), description: z.string().max(1000).optional() })
type Values = z.infer<typeof schema>
interface Props { isOpen: boolean; onClose: () => void; product?: ProductResponse | null; onSubmit: (data: CreateProductRequest) => Promise<boolean>; isLoading: boolean; error?: string | null }

export default function ProductFormModal({ isOpen, onClose, product, onSubmit, isLoading, error }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) })
  useEffect(() => { reset({ name: product?.name ?? '', description: product?.description ?? '' }) }, [product, reset, isOpen])
  const close = () => { reset(); onClose() }
  return <Modal isOpen={isOpen} onClose={close} title={product ? 'Edit product' : 'New product'} footer={<><Button variant="outline" onClick={close}>Cancel</Button><Button form="product-form" type="submit" isLoading={isLoading}>{product ? 'Save changes' : 'Create product'}</Button></>}>
    {error && <p role="alert" className="mb-4 rounded-lg bg-[#FFEBEE] p-3 text-sm text-[#C62828]">{error}</p>}
    <form id="product-form" onSubmit={handleSubmit(async values => { if (await onSubmit({ name: values.name.trim(), description: values.description?.trim() || undefined })) close() })} className="space-y-4" noValidate>
      <Input label="Product name" required error={errors.name?.message} {...register('name')} />
      <Input label="Description" error={errors.description?.message} {...register('description')} />
    </form>
  </Modal>
}
