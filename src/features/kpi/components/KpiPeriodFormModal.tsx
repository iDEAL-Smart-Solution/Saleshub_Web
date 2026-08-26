import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import type { KpiPeriodResponse, CreateKpiPeriodRequest, UpdateKpiPeriodRequest } from '@/types'

const MONTH_OPTIONS = [
  { value: '1',  label: 'January'   },
  { value: '2',  label: 'February'  },
  { value: '3',  label: 'March'     },
  { value: '4',  label: 'April'     },
  { value: '5',  label: 'May'       },
  { value: '6',  label: 'June'      },
  { value: '7',  label: 'July'      },
  { value: '8',  label: 'August'    },
  { value: '9',  label: 'September' },
  { value: '10', label: 'October'   },
  { value: '11', label: 'November'  },
  { value: '12', label: 'December'  },
]

const createSchema = z.object({
  year:        z.coerce.number<number>().int().min(2020).max(2100),
  month:       z.coerce.number<number>().int().min(1).max(12),
  targetSales: z.coerce.number<number>().int().positive('Target must be a positive whole number'),
})

const editSchema = z.object({
  targetSales: z.coerce.number<number>().int().positive('Target must be a positive whole number'),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues   = z.infer<typeof editSchema>

interface CreateProps {
  mode: 'create'
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateKpiPeriodRequest) => Promise<boolean>
  isLoading: boolean
  error?: string | null
}

interface EditProps {
  mode: 'edit'
  period: KpiPeriodResponse
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UpdateKpiPeriodRequest) => Promise<boolean>
  isLoading: boolean
  error?: string | null
}

type Props = CreateProps | EditProps

export default function KpiPeriodFormModal(props: Props) {
  const { mode, isOpen, onClose, isLoading, error } = props

  // ── Create form ─────────────────────────────────────────────────────────────
  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      year:        new Date().getFullYear(),
      month:       new Date().getMonth() + 1,
      targetSales: undefined,
    },
  })

  // ── Edit form ───────────────────────────────────────────────────────────────
  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
  })

  useEffect(() => {
    if (!isOpen) return
    if (mode === 'create') {
      createForm.reset({
        year:        new Date().getFullYear(),
        month:       new Date().getMonth() + 1,
        targetSales: undefined,
      })
    } else {
      editForm.reset({ targetSales: (props as EditProps).period.targetSales })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode])

  const close = () => { createForm.reset(); editForm.reset(); onClose() }
  const formId = mode === 'create' ? 'kpi-create-form' : 'kpi-edit-form'
  const title  = mode === 'create' ? 'New KPI period' : 'Edit KPI period'
  const period = mode === 'edit' ? (props as EditProps).period : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={close} disabled={isLoading}>Cancel</Button>
          <Button form={formId} type="submit" isLoading={isLoading}>
            {mode === 'create' ? 'Create period' : 'Save changes'}
          </Button>
        </>
      }
    >
      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-[#FFEBEE] p-3 text-sm text-[#C62828]">
          {error}
        </p>
      )}

      {/* ── Create form ───────────────────────────────────────────────────── */}
      {mode === 'create' && (
        <form
          id={formId}
          className="space-y-4"
          noValidate
          onSubmit={createForm.handleSubmit(async (v) => {
            const ok = await (props as CreateProps).onSubmit({
              year:        v.year,
              month:       v.month,
              targetSales: v.targetSales,
            })
            if (ok) close()
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Year"
              required
              type="number"
              min={2020}
              max={2100}
              error={createForm.formState.errors.year?.message}
              {...createForm.register('year')}
            />
            <Select
              label="Month"
              required
              options={MONTH_OPTIONS}
              error={createForm.formState.errors.month?.message}
              {...createForm.register('month')}
            />
          </div>
          <Input
            label="Sales target"
            required
            type="number"
            min={1}
            step={1}
            hint="Number of confirmed sales required to meet KPI"
            error={createForm.formState.errors.targetSales?.message}
            {...createForm.register('targetSales')}
          />
        </form>
      )}

      {/* ── Edit form ─────────────────────────────────────────────────────── */}
      {mode === 'edit' && period && (
        <form
          id={formId}
          className="space-y-4"
          noValidate
          onSubmit={editForm.handleSubmit(async (v) => {
            const ok = await (props as EditProps).onSubmit({ targetSales: v.targetSales })
            if (ok) close()
          })}
        >
          <p className="text-sm text-[#757575]">
            Editing KPI for{' '}
            <strong className="text-[#212121]">
              {MONTH_OPTIONS[(period.month - 1)].label} {period.year}
            </strong>
          </p>
          <Input
            label="Sales target"
            required
            type="number"
            min={1}
            step={1}
            hint="Number of confirmed sales required to meet KPI"
            error={editForm.formState.errors.targetSales?.message}
            {...editForm.register('targetSales')}
          />
        </form>
      )}
    </Modal>
  )
}
