import { useEffect, useState } from 'react'
import { Plus, Search, Pencil } from 'lucide-react'
import { Button, Card, Input, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCustomers } from '@/features/customers'
import ProductStatusBadge from '@/features/products/components/ProductStatusBadge'
import CustomerFormModal from '@/features/customers/components/CustomerFormModal'
import { useAuthStore } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'
import type { CreateCustomerRequest, CustomerResponse } from '@/types'

export default function CustomersPage() {
  usePageTitle('Customers')
  const api = useCustomers(); 
  const modal = useDisclosure(); 
  const [selected, setSelected] = useState<CustomerResponse | null>(null); 
  const [search, setSearch] = useState(''); 
  const role = useAuthStore(s => s.user?.roles[0]); 
  const canToggle = role === ROLES.ADMIN || role === ROLES.DEV || role === ROLES.MARKETING_LEAD
  const { fetchCustomers } = api
  useEffect(() => { void fetchCustomers() }, [fetchCustomers])
  const save = async (data: CreateCustomerRequest) => selected ? api.updateCustomer(selected.id, data) : api.createCustomer(data)
  const columns: Column<CustomerResponse>[] = [
    { key: 'name', header: 'Customer', render: c => <div><p className="font-medium text-[#212121]">{c.name}</p>{c.contactPerson && <p className="text-xs text-[#757575]">{c.contactPerson}</p>}</div> },
    { key: 'contact', header: 'Contact', render: c => <div className="text-xs text-[#757575]"><p>{c.email ?? '—'}</p><p>{c.phoneNumber ?? ''}</p></div> },
    { key: 'isActive', header: 'Status', render: c => <ProductStatusBadge isActive={c.isActive} /> },
    { key: 'actions', header: '', className: 'text-right', render: c => <div className="flex justify-end gap-1"><Button size="sm" variant="ghost" leftIcon={<Pencil size={14}/>} onClick={() => { setSelected(c); modal.open() }}>Edit</Button>{canToggle && <Button size="sm" variant={c.isActive ? 'outline' : 'secondary'} isLoading={api.isActionLoading} onClick={() => void (c.isActive ? api.deactivateCustomer(c.id) : api.activateCustomer(c.id))}>{c.isActive ? 'Deactivate' : 'Activate'}</Button>}</div> },
  ]
  return <div>
    <PageHeader title="Customers" subtitle="Manage your business customers" action={<Button leftIcon={<Plus size={16}/>} onClick={() => { setSelected(null); modal.open() }}>New customer</Button>} />
    {api.error && !modal.isOpen ? <ErrorState message={api.error} onRetry={() => void api.fetchCustomers()} /> : <Card noPadding><div className="border-b border-[#EEEEEE] p-4"><Input aria-label="Search customers" placeholder="Search customers…" value={search} onChange={e => { setSearch(e.target.value); void api.fetchCustomers(e.target.value || undefined) }} leftAddon={<Search size={15}/>} /></div><Table columns={columns} data={api.customers} isLoading={api.isLoading} keyExtractor={c => c.id} emptyTitle="No customers found" emptyDescription={search ? 'Try a different search.' : 'Create a customer before recording a sale.'} /></Card>}
    <CustomerFormModal isOpen={modal.isOpen} onClose={modal.close} customer={selected} onSubmit={save} isLoading={api.isActionLoading} error={api.error} />
  </div>
}
