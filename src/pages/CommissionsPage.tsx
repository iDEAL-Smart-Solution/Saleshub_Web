import { useEffect, useState } from 'react'
import { CheckCircle, DollarSign, XCircle } from 'lucide-react'
import { Button, Card, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import CommissionStatusBadge from '@/features/commissions/components/CommissionStatusBadge'
import { useCommissions } from '@/features/commissions'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuthStore } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'
import { CommissionStatus, type CommissionResponse } from '@/types'
import { formatCurrency, formatMonth, getCommissionTypeLabel } from '@/utils/formatters'

export default function CommissionsPage({ mine = false }: { mine?: boolean }) {
  usePageTitle(mine ? 'My Commissions' : 'Commissions')

  const api  = useCommissions()
  const role = useAuthStore((s) => s.user?.roles[0])
  const canManage = !mine && (role === ROLES.DEV || role === ROLES.ADMIN)

  const { fetchMine, fetchAll } = api

  useEffect(() => {
    void (mine ? fetchMine() : fetchAll())
  }, [mine, fetchMine, fetchAll])

  // ── Payout action handlers ────────────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleApprove = async (id: string) => {
    const ok = await api.updateStatus(id, CommissionStatus.Approved)
    if (ok) flash('Commission approved.')
  }

  const handleMarkPaid = async (id: string) => {
    const ok = await api.updateStatus(id, CommissionStatus.Paid, 'Payment confirmed by admin.')
    if (ok) flash('Commission marked as paid.')
  }

  const handleCancel = async (id: string) => {
    const ok = await api.updateStatus(id, CommissionStatus.Cancelled)
    if (ok) flash('Commission cancelled.')
  }

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: Column<CommissionResponse>[] = [
    ...(!mine
      ? [{ key: 'marketerName', header: 'Marketer' } as Column<CommissionResponse>]
      : []),
    {
      key: 'period',
      header: 'Period',
      render: (c) => formatMonth(c.performanceYear, c.performanceMonth),
    },
    {
      key: 'type',
      header: 'Type',
      render: (c) => getCommissionTypeLabel(c.type),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (c) => <span className="font-medium">{formatCurrency(c.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <CommissionStatusBadge status={c.status} />,
    },
    ...(canManage
      ? ([
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (c: CommissionResponse) => (
              <div className="flex justify-end gap-1">
                {/* Pending → Approve */}
                {c.status === CommissionStatus.Pending && (
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={api.isActionLoading}
                    leftIcon={<CheckCircle size={13} />}
                    onClick={() => void handleApprove(c.id)}
                  >
                    Approve
                  </Button>
                )}
                {/* Approved → Paid */}
                {c.status === CommissionStatus.Approved && (
                  <Button
                    size="sm"
                    isLoading={api.isActionLoading}
                    leftIcon={<DollarSign size={13} />}
                    onClick={() => void handleMarkPaid(c.id)}
                  >
                    Mark paid
                  </Button>
                )}
                {/* Pending or Approved → Cancel */}
                {(c.status === CommissionStatus.Pending ||
                  c.status === CommissionStatus.Approved) && (
                  <Button
                    size="sm"
                    variant="danger"
                    isLoading={api.isActionLoading}
                    leftIcon={<XCircle size={13} />}
                    onClick={() => void handleCancel(c.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            ),
          },
        ] as Column<CommissionResponse>[])
      : []),
  ]

  return (
    <div>
      <PageHeader
        title={mine ? 'My Commissions' : 'Commissions'}
        subtitle={
          canManage
            ? 'Approve and record payment of marketer commissions'
            : 'Backend-calculated commission records'
        }
      />

      {/* Success banner */}
      {successMsg && (
        <div
          role="status"
          className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg
            bg-[#E8F5E9] border border-[#C8E6C9] text-sm text-[#2E7D32]"
        >
          <CheckCircle size={15} />
          {successMsg}
        </div>
      )}

      {api.error ? (
        <ErrorState
          message={api.error}
          onRetry={() => void (mine ? api.fetchMine() : api.fetchAll())}
        />
      ) : (
        <Card noPadding>
          <Table
            columns={columns}
            data={api.commissions}
            isLoading={api.isLoading}
            keyExtractor={(c) => c.id}
            emptyTitle="No commissions found"
            emptyDescription="Commission records will appear here after qualifying sales are processed."
          />
        </Card>
      )}
    </div>
  )
}
