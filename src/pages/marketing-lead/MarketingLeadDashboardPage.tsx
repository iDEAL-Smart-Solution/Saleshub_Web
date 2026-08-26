import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, UserSquare2 } from 'lucide-react'
import { Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState } from '@/components/feedback'
import SaleStatusBadge from '@/features/sales/components/SaleStatusBadge'
import { useSales } from '@/features/sales'
import { useCustomers } from '@/features/customers'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function MarketingLeadDashboardPage() {
  usePageTitle('Marketing Lead Dashboard')
  const user = useAuthStore(s => s.user); const sales = useSales(); const customers = useCustomers()
  const { fetchAllSales } = sales; const { fetchCustomers } = customers
  useEffect(() => { void fetchAllSales(); void fetchCustomers() }, [fetchAllSales, fetchCustomers])
  if (sales.isLoading && !sales.sales.length) return <LoadingState message="Loading sales activity…" />
  if (sales.error ?? customers.error) return <ErrorState message={sales.error ?? customers.error ?? 'Unable to load dashboard'} onRetry={() => void sales.fetchAllSales()} />
  return <div><PageHeader title={`Welcome, ${user?.firstName ?? 'Marketing Lead'}`} subtitle="Sales activity and customer overview" />
    <div className="mb-6 grid gap-4 sm:grid-cols-2"><Metric icon={ShoppingCart} label="Recorded sales" value={String(sales.sales.length)} href="/marketing-lead/sales"/><Metric icon={UserSquare2} label="Active customers" value={String(customers.customers.filter(c => c.isActive).length)} href="/marketing-lead/customers"/></div>
    <Card noPadding><Card.Header className="p-5 pb-0" title="Recent sales" action={<Link className="text-sm text-[#1565C0]" to="/marketing-lead/sales">View all</Link>}/>{sales.sales.slice(0,8).map(s => <div className="flex items-center justify-between gap-3 border-t border-[#EEEEEE] px-5 py-3" key={s.id}><div><p className="font-medium">{s.customerName}</p><p className="text-xs text-[#757575]">{s.marketerName} · {s.productName} · {formatDate(s.saleDate)}</p></div><div className="text-right"><p className="text-sm font-medium">{formatCurrency(s.amount)}</p><SaleStatusBadge status={s.status}/></div></div>)}{sales.sales.length === 0 && <p className="p-5 text-sm text-[#757575]">No sales have been recorded.</p>}</Card>
  </div>
}
function Metric({ icon: Icon, label, value, href }: { icon: typeof ShoppingCart; label: string; value: string; href: string }) { return <Link to={href}><Card className="h-full hover:border-[#90CAF9]"><div className="flex gap-3"><span className="rounded-lg bg-[#E3F2FD] p-2 text-[#1565C0]"><Icon size={18}/></span><div><p className="text-xs text-[#757575]">{label}</p><p className="text-lg font-bold">{value}</p></div></div></Card></Link> }
