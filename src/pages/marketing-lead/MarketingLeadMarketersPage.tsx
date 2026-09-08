import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button, Card, Input, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { EmptyState, ErrorState } from '@/components/feedback'
import UserStatusBadge from '@/features/users/components/UserStatusBadge'
import CreateUserModal from '@/features/users/components/CreateUserModal'
import { useMarketers, useUsers, useDistributors } from '@/features/users'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ROLES } from '@/constants/roles'
import type { CreateUserRequest, MarketerSummaryResponse } from '@/types'

export default function MarketingLeadMarketersPage() {
  usePageTitle('All Marketers')

  const { marketers, isLoading, error, fetchMarketers } = useMarketers()
  const { distributors, isLoading: loadingDist, fetchDistributors } = useDistributors()
  const users       = useUsers()
  const createModal = useDisclosure()
  const [search, setSearch] = useState('')

  useEffect(() => {
    void fetchMarketers()
    void fetchDistributors()
  }, [fetchMarketers, fetchDistributors])

  const shown = marketers.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.email} ${m.distributorName ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const handleCreate = async (data: CreateUserRequest): Promise<boolean> => {
    const ok = await users.createUser({ ...data, role: ROLES.MARKETER })
    if (ok) void fetchMarketers()
    return ok
  }

  const columns: Column<MarketerSummaryResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (m) => <span className="font-medium">{m.firstName} {m.lastName}</span>,
    },
    { key: 'email', header: 'Email' },
    {
      key: 'distributor',
      header: 'Distributor',
      render: (m) => m.distributorName ?? <span className="text-[#9E9E9E]">—</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (m) => <UserStatusBadge user={{ isActive: m.isActive }} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="All Marketers"
        subtitle="All active marketers across the organisation"
        action={
          <Button leftIcon={<Plus size={16} />} onClick={createModal.open}>
            Add marketer
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={() => void fetchMarketers()} />
      ) : (
        <Card noPadding>
          <div className="border-b border-[#EEEEEE] p-4">
            <Input
              aria-label="Search marketers"
              placeholder="Search by name, email or distributor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftAddon={<Search size={15} />}
            />
          </div>
          {!isLoading && shown.length === 0 ? (
            <EmptyState
              title="No marketers found"
              description="Marketers will appear here once they are registered and assigned to a distributor."
            />
          ) : (
            <Table
              columns={columns}
              data={shown}
              isLoading={isLoading}
              keyExtractor={(m) => m.id}
              emptyTitle="No marketers found"
              emptyDescription="No marketers match your search."
            />
          )}
        </Card>
      )}

      {/* CreateUserModal with distributor selector for Marketing Lead */}
      <CreateUserModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSubmit={handleCreate}
        isLoading={users.isActionLoading}
        error={users.error}
        distributors={distributors}
        loadingDistributors={loadingDist}
      />
    </div>
  )
}
