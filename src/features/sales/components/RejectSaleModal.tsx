import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import type { RejectSaleRequest } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RejectSaleRequest) => Promise<boolean>
  isLoading: boolean
  error?: string | null
}

export default function RejectSaleModal({ isOpen, onClose, onSubmit, isLoading, error }: Props) {
  const { register, handleSubmit, reset } = useForm<RejectSaleRequest>({
    defaultValues: { reason: '' },
  })

  useEffect(() => {
    if (isOpen) reset({ reason: '' })
  }, [isOpen, reset])

  const close = () => { reset(); onClose() }

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Reject sale"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            form="reject-form"
            type="submit"
            variant="danger"
            isLoading={isLoading}
          >
            Reject sale
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
        id="reject-form"
        className="space-y-3"
        noValidate
        onSubmit={handleSubmit(async (values) => {
          const data: RejectSaleRequest = {
            reason: values.reason?.trim() || undefined,
          }
          if (await onSubmit(data)) close()
        })}
      >
        <div>
          <label
            htmlFor="reject-reason"
            className="block text-sm font-medium text-[#424242] mb-1"
          >
            Reason for rejection{' '}
            <span className="text-[#9E9E9E] font-normal">(optional)</span>
          </label>
          <textarea
            id="reject-reason"
            rows={3}
            maxLength={500}
            placeholder="Describe why this sale is being rejected…"
            className="w-full rounded-lg border border-[#BDBDBD] px-3 py-2 text-sm
              text-[#212121] placeholder:text-[#9E9E9E] resize-none
              focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent
              disabled:bg-[#F5F5F5] disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-describedby="reject-reason-hint"
            {...register('reason')}
          />
          <p id="reject-reason-hint" className="mt-1 text-xs text-[#757575]">
            Maximum 500 characters.
          </p>
        </div>
      </form>
    </Modal>
  )
}
