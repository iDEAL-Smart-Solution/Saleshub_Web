import { useEffect, useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { Button, Card, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import { useKpi } from '@/features/kpi'
import KpiPeriodFormModal from '@/features/kpi/components/KpiPeriodFormModal'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuthStore } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'
import { formatMonth } from '@/utils/formatters'
import type {
  KpiPeriodResponse,
  CreateKpiPeriodRequest,
  UpdateKpiPeriodRequest,
} from '@/types'

export default function KpiPage() {
  usePageTitle('KPI')
  const api = useKpi()
  const { fetchAllPeriods } = api
  const role = useAuthStore((s) => s.user?.roles[0])
  const canManage = role === ROLES.DEV || role === ROLES.ADMIN

  const createModal = useDisclosure()
  const editModal   = useDisclosure()
  const [editing, setEditing] = useState<KpiPeriodResponse | null>(null)

  useEffect(() => { void fetchAllPeriods() }, [fetchAllPeriods])

  const handleCreate = async (data: CreateKpiPeriodRequest): Promise<boolean> => {
    const ok = await api.createPeriod(data)
    return ok
  }

  const handleEdit = async (data: UpdateKpiPeriodRequest): Promise<boolean> => {
    if (!editing) return false
    const ok = await api.updatePeriod(editing.year, editing.month, data)
    return ok
  }

  const openEdit = (period: KpiPeriodResponse) => {
    setEditing(period)
    editModal.open()
  }

  const columns: Column<KpiPeriodResponse>[] = [
    {
      key: 'period',
      header: 'Period',
      render: (p) => formatMonth(p.year, p.month),
    },
    {
      key: 'targetSales',
      header: 'Sales target',
      render: (p) => (
        <span className="font-medium">{p.targetSales} sales</span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (p) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            p.isActive
              ? 'bg-[#E8F5E9] text-[#2E7D32]'
              : 'bg-[#F5F5F5] text-[#757575]'
          }`}
        >
          {p.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    ...(canManage
      ? ([
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (p: KpiPeriodResponse) => (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Pencil size={14} />}
                onClick={() => openEdit(p)}
              >
                Edit
              </Button>
            ),
          },
        ] as Column<KpiPeriodResponse>[])
      : []),
  ]

  return (
    <div>
      <PageHeader
        title="KPI configuration"
        subtitle="Monthly sales targets configured by the business"
        action={
          canManage ? (
            <Button leftIcon={<Plus size={16} />} onClick={createModal.open}>
              New KPI period
            </Button>
          ) : undefined
        }
      />

      {api.error ? (
        <ErrorState message={api.error} onRetry={() => void api.fetchAllPeriods()} />
      ) : (
        <Card noPadding>
          <Table
            columns={columns}
            data={api.periods}
            isLoading={api.isLoading}
            keyExtractor={(p) => p.id}
            emptyTitle="No KPI periods"
            emptyDescription={
              canManage
                ? 'Create the first KPI period to define monthly sales targets.'
                : 'No monthly KPI periods have been configured yet.'
            }
          />
        </Card>
      )}

      {/* Create modal — Admin/Dev only */}
      {canManage && (
        <>
          <KpiPeriodFormModal
            mode="create"
            isOpen={createModal.isOpen}
            onClose={createModal.close}
            onSubmit={handleCreate}
            isLoading={api.isActionLoading}
            error={api.error}
          />

          {editing && (
            <KpiPeriodFormModal
              mode="edit"
              period={editing}
              isOpen={editModal.isOpen}
              onClose={() => { editModal.close(); setEditing(null) }}
              onSubmit={handleEdit}
              isLoading={api.isActionLoading}
              error={api.error}
            />
          )}
        </>
      )}
    </div>
  )
}
