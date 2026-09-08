import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Select from '@/components/common/Select'
import type { DistributorSummaryResponse, UserSummaryResponse } from '@/types'

interface Props {
  isOpen:       boolean
  onClose:      () => void
  marketer:     UserSummaryResponse | null
  distributors: DistributorSummaryResponse[]
  isLoading:    boolean
  error?:       string | null
  onSubmit:     (marketerId: string, distributorId: string) => Promise<boolean>
}

export default function ApproveMarketerModal({
  isOpen, onClose, marketer, distributors, isLoading, error, onSubmit,
}: Props) {
  const [distributorId, setDistributorId] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleClose = () => {
    setDistributorId('')
    setValidationError(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!distributorId) {
      setValidationError('Please select a distributor before approving.')
      return
    }
    if (!marketer) return
    const ok = await onSubmit(marketer.id, distributorId)
    if (ok) handleClose()
  }

  const displayError = validationError || error

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Approve Marketer"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button isLoading={isLoading} loadingText="Approving…" onClick={handleSubmit}>
            Approve & assign
          </Button>
        </>
      }
    >
      {marketer && (
        <div className="flex flex-col gap-4">
          {/* Marketer info */}
          <div className="p-3 rounded-lg bg-[#F5F5F5]">
            <p className="text-sm font-medium text-[#212121]">
              {marketer.firstName} {marketer.lastName}
            </p>
            <p className="text-xs text-[#757575]">{marketer.email}</p>
          </div>

          {/* Error */}
          {displayError && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]"
            >
              <AlertCircle size={15} className="text-[#D32F2F] shrink-0 mt-0.5" />
              <p className="text-sm text-[#C62828]">{displayError}</p>
            </div>
          )}

          {/* Distributor selector */}
          <Select
            label="Assign to Distributor"
            required
            value={distributorId}
            onChange={(e) => {
              setDistributorId(e.target.value)
              setValidationError(null)
            }}
            options={distributors.map((d) => ({
              value: d.id,
              label: `${d.firstName} ${d.lastName}`,
            }))}
            placeholder="Select a distributor…"
            disabled={distributors.length === 0}
            hint={
              distributors.length === 0
                ? 'No active distributors found. Create a Distributor account first.'
                : 'The marketer will be assigned to this distributor on approval.'
            }
            error={validationError && !distributorId ? ' ' : undefined}
          />
        </div>
      )}
    </Modal>
  )
}
