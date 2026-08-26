import { useEffect, useState } from 'react'
import { Plus, Search, Pencil } from 'lucide-react'
import { Button, Card, Input, PageHeader } from '@/components/common'
import Table, { type Column } from '@/components/tables/Table'
import { ErrorState } from '@/components/feedback'
import { useDisclosure } from '@/hooks/useDisclosure'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProducts } from '@/features/products'
import ProductStatusBadge from '@/features/products/components/ProductStatusBadge'
import ProductFormModal from '@/features/products/components/ProductFormModal'
import type { CreateProductRequest, ProductResponse } from '@/types'

export default function ProductsPage() {
  usePageTitle('Products')
  const api = useProducts(); const modal = useDisclosure(); const [selected, setSelected] = useState<ProductResponse | null>(null); const [search, setSearch] = useState('')
  const { fetchAllProducts } = api
  useEffect(() => { void fetchAllProducts() }, [fetchAllProducts])
  const save = async (data: CreateProductRequest) => selected ? api.updateProduct(selected.id, data) : api.createProduct(data)
  const shown = api.products.filter(p => `${p.name} ${p.description ?? ''}`.toLowerCase().includes(search.toLowerCase()))
  const columns: Column<ProductResponse>[] = [
    { key: 'name', header: 'Product', render: p => <div><p className="font-medium text-[#212121]">{p.name}</p>{p.description && <p className="max-w-sm truncate text-xs text-[#757575]">{p.description}</p>}</div> },
    { key: 'isActive', header: 'Status', render: p => <ProductStatusBadge isActive={p.isActive} /> },
    { key: 'actions', header: '', className: 'text-right', render: p => <div className="flex justify-end gap-1"><Button size="sm" variant="ghost" leftIcon={<Pencil size={14}/>} onClick={() => { setSelected(p); modal.open() }}>Edit</Button><Button size="sm" variant={p.isActive ? 'outline' : 'secondary'} isLoading={api.isActionLoading} onClick={() => void (p.isActive ? api.deactivateProduct(p.id) : api.activateProduct(p.id))}>{p.isActive ? 'Deactivate' : 'Activate'}</Button></div> },
  ]
  return <div><PageHeader title="Products" subtitle="Manage the products available for sale" action={<Button leftIcon={<Plus size={16}/>} onClick={() => { setSelected(null); modal.open() }}>New product</Button>} />
    {api.error && !modal.isOpen ? <ErrorState message={api.error} onRetry={() => void api.fetchAllProducts()} /> : <Card noPadding><div className="border-b border-[#EEEEEE] p-4"><Input aria-label="Search products" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} leftAddon={<Search size={15}/>} /></div><Table columns={columns} data={shown} isLoading={api.isLoading} keyExtractor={p => p.id} emptyTitle="No products found" emptyDescription="Create a product to start recording sales." /></Card>}
    <ProductFormModal isOpen={modal.isOpen} onClose={modal.close} product={selected} onSubmit={save} isLoading={api.isActionLoading} error={api.error} />
  </div>
}
