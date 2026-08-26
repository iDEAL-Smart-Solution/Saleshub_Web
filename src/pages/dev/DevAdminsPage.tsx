import { useEffect, useState } from 'react'
import { Search, UserPlus, CheckCircle, ShieldCheck } from 'lucide-react'
import { useUsers } from '@/features/users'
import { UserStatusBadge, CreateUserModal, UserDetailModal } from '@/features/users'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button, Badge, Input, PageHeader, Card } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import { ROLES } from '@/constants/roles'
import type { UserSummaryResponse, CreateUserRequest } from '@/types'

/**
 * Dev-only page for creating and managing Admin accounts.
 *
 * Only Dev can create Admin accounts (backend enforces this too).
 * The CreateUserModal is pre-filtered to show only the Admin role
 * so Dev has a fast, clear path to add a new admin without navigating
 * to the general user management page.
 */
export default function DevAdminsPage() {
  usePageTitle('Admin Accounts')

  const {
    users, selectedUser,
    isLoading, isActionLoading, error,
    fetchAllUsers, fetchUserById,
    createUser, activateUser, deactivateUser,
    clearError,
  } = useUsers()

  const createModal = useDisclosure()
  const detailModal = useDisclosure()
  const [search, setSearch]         = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg]   = useState<string | null>(null)

  useEffect(() => { void fetchAllUsers() }, [fetchAllUsers])

  // Filter: show only Admin-role users
  const admins = users
    .filter((u) => u.roles.includes(ROLES.ADMIN))
    .filter((u) => {
      const q = search.toLowerCase()
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    })

  const handleViewUser = async (id: string) => {
    await fetchUserById(id)
    detailModal.open()
  }

  const handleCreate = async (data: CreateUserRequest): Promise<boolean> => {
    setCreateError(null)
    // Ensure role is locked to Admin regardless of what was passed
    const ok = await createUser({ ...data, role: ROLES.ADMIN })
    if (!ok) { setCreateError(error); return false }
    flash('Admin account created successfully.')
    return true
  }

  const handleActivate = async (id: string) => {
    const ok = await activateUser(id)
    if (ok) { flash('Admin activated.'); detailModal.close() }
  }

  const handleDeactivate = async (id: string) => {
    const ok = await deactivateUser(id)
    if (ok) { flash('Admin deactivated.'); detailModal.close() }
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
      key: 'status',
      header: 'Status',
      render: (u) => <UserStatusBadge user={u} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (u) => (
        <span className="text-xs text-[#757575]">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (u) => (
        <Button size="sm" variant="ghost" onClick={() => handleViewUser(u.id)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Admin Accounts"
        subtitle="Create and manage administrator accounts"
        action={
          <Button leftIcon={<UserPlus size={15} />} onClick={createModal.open}>
            New admin
          </Button>
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

      {error && !createModal.isOpen && (
        <ErrorState
          message={error}
          onRetry={() => { clearError(); void fetchAllUsers() }}
        />
      )}

      {/* Summary card */}
      {!isLoading && !error && (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[#E3F2FD] p-2 text-[#1565C0]">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-xs text-[#757575]">Total admins</p>
                <p className="text-xl font-bold text-[#212121]">
                  {users.filter((u) => u.roles.includes(ROLES.ADMIN)).length}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[#E8F5E9] p-2 text-[#2E7D32]">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-xs text-[#757575]">Active admins</p>
                <p className="text-xl font-bold text-[#212121]">
                  {users.filter((u) => u.roles.includes(ROLES.ADMIN) && u.isActive).length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Search + table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#EEEEEE] flex items-center gap-3">
          <div className="flex-1">
            <Input
              aria-label="Search admins"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftAddon={<Search size={15} />}
            />
          </div>
          <Badge variant="neutral" size="sm">
            {admins.length} result{admins.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <Table
          columns={columns}
          data={admins}
          isLoading={isLoading}
          keyExtractor={(u) => u.id}
          emptyTitle="No admin accounts found"
          emptyDescription={
            search
              ? 'Try a different search.'
              : 'Create the first Admin account using the button above.'
          }
        />
      </Card>

      {/* Create modal — role locked to Admin */}
      <CreateUserModal
        isOpen={createModal.isOpen}
        onClose={() => { createModal.close(); setCreateError(null) }}
        onSubmit={handleCreate}
        isLoading={isActionLoading}
        error={createError}
      />

      {/* Detail / activate / deactivate modal */}
      <UserDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        user={selectedUser}
        isLoading={isLoading && !selectedUser}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        isActionLoading={isActionLoading}
      />
    </div>
  )
}
