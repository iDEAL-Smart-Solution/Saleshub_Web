import { useEffect, useState } from 'react'
import { Search, UserPlus, CheckCircle } from 'lucide-react'
import { useUsers } from '@/features/users'
import {
  UserStatusBadge,
  CreateUserModal,
  UserDetailModal,
  ApproveMarketerModal,
} from '@/features/users'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button, Badge, Input, PageHeader, Card } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import type { UserSummaryResponse, CreateUserRequest } from '@/types'

export default function UsersPage() {
  usePageTitle('Users')

  const {
    users, pendingMarketers, distributors, selectedUser,
    isLoading, isActionLoading, error,
    fetchAllUsers, fetchPendingMarketers, fetchDistributors, fetchUserById,
    createUser, approveMarketer, activateUser, deactivateUser,
    clearError,
  } = useUsers()

  const createModal  = useDisclosure()
  const detailModal  = useDisclosure()
  const approveModal = useDisclosure()

  const [search, setSearch] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [selectedMarketer, setSelectedMarketer] = useState<UserSummaryResponse | null>(null)

  useEffect(() => {
    void fetchAllUsers()
    void fetchPendingMarketers()
    void fetchDistributors()
  }, [fetchAllUsers, fetchPendingMarketers, fetchDistributors])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roles.some((r) => r.toLowerCase().includes(q))
    )
  })

  const handleViewUser = async (id: string) => {
    await fetchUserById(id)
    detailModal.open()
  }

  const handleOpenApprove = (marketer: UserSummaryResponse) => {
    setSelectedMarketer(marketer)
    approveModal.open()
  }

  const handleApprove = async (marketerId: string, distributorId: string): Promise<boolean> => {
    const ok = await approveMarketer(marketerId, distributorId)
    if (ok) {
      flash('Marketer approved and assigned.')
      void fetchPendingMarketers()
    }
    return ok
  }

  const handleCreate = async (data: CreateUserRequest): Promise<boolean> => {
    setCreateError(null)
    const ok = await createUser(data)
    if (!ok) {
      setCreateError(error)
      return false
    }
    flash('User created successfully.')
    return true
  }

  const handleActivate = async (id: string) => {
    const ok = await activateUser(id)
    if (ok) { flash('User activated.'); detailModal.close() }
  }

  const handleDeactivate = async (id: string) => {
    const ok = await deactivateUser(id)
    if (ok) { flash('User deactivated.'); detailModal.close() }
  }

  function flash(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const columns: Column<UserSummaryResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <div>
          <p className="font-medium text-[#212121]">{u.firstName} {u.lastName}</p>
          <p className="text-xs text-[#757575]">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Role',
      render: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roles.map((r) => <Badge key={r} variant="primary" size="sm">{r}</Badge>)}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <UserStatusBadge user={u} />,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (u) => (
        <span className="text-xs text-[#757575]">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (u) => (
        <Button size="sm" variant="ghost" onClick={() => handleViewUser(u.id)}>
          View
        </Button>
      ),
      headerClassName: 'text-right',
      className: 'text-right',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage all system users"
        action={
          <Button leftIcon={<UserPlus size={15} />} onClick={createModal.open}>
            New user
          </Button>
        }
      />

      {/* Success banner */}
      {successMsg && (
        <div role="status" className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] text-sm text-[#2E7D32]">
          <CheckCircle size={15} /> {successMsg}
        </div>
      )}

      {error && !createModal.isOpen && !approveModal.isOpen && (
        <ErrorState message={error} onRetry={() => { clearError(); void fetchAllUsers() }} />
      )}

      {/* Pending marketers */}
      {pendingMarketers.length > 0 && (
        <Card className="mb-5 border-[#FFF8E1] bg-[#FFFDE7]">
          <Card.Header
            title={`Pending Approval (${pendingMarketers.length})`}
            subtitle="These marketers are waiting for account activation"
          />
          <div className="flex flex-col gap-2">
            {pendingMarketers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#EEEEEE]"
              >
                <div>
                  <p className="text-sm font-medium text-[#212121]">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-[#757575]">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => handleViewUser(u.id)}>
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleOpenApprove(u)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search + table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#EEEEEE]">
          <Input
            placeholder="Search by name, email, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search size={15} />}
            aria-label="Search users"
          />
        </div>

        <Table
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          keyExtractor={(u) => u.id}
          emptyTitle="No users found"
          emptyDescription={search ? 'Try adjusting your search.' : 'No users have been created yet.'}
        />
      </Card>

      {/* Modals */}
      <CreateUserModal
        isOpen={createModal.isOpen}
        onClose={() => { createModal.close(); setCreateError(null) }}
        onSubmit={handleCreate}
        isLoading={isActionLoading}
        error={createError}
        distributors={distributors}
      />

      <UserDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        user={selectedUser}
        isLoading={isLoading && !selectedUser}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        isActionLoading={isActionLoading}
      />

      <ApproveMarketerModal
        isOpen={approveModal.isOpen}
        onClose={() => { approveModal.close(); setSelectedMarketer(null) }}
        marketer={selectedMarketer}
        distributors={distributors}
        isLoading={isActionLoading}
        error={error}
        onSubmit={handleApprove}
      />
    </div>
  )
}
