import { useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button, Card, PageHeader } from '@/components/common'
import { ErrorState, LoadingState, EmptyState } from '@/components/feedback'
import { useNotifications } from '@/features/notifications'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getNotificationTypeLabel, formatDateTime } from '@/utils/formatters'

export default function NotificationsPage() {
  usePageTitle('Notifications')
  const api = useNotifications()
  const { fetchNotifications } = api
  useEffect(() => { void fetchNotifications() }, [fetchNotifications])
  return <div><PageHeader title="Notifications" subtitle="Stay up to date with your sales activity" action={api.unreadCount ? <Button variant="outline" leftIcon={<CheckCheck size={16}/>} onClick={() => void api.markAllRead()}>Mark all as read</Button> : undefined} />
    {api.error ? <ErrorState message={api.error} onRetry={() => void api.fetchNotifications()} /> : api.isLoading ? <LoadingState message="Loading notifications…" /> : api.notifications.length === 0 ? <EmptyState icon={<Bell size={26}/>} title="No notifications" description="New activity notifications will appear here." /> : <div className="space-y-3">{api.notifications.map(n => <Card key={n.id} className={n.isRead ? '' : 'border-[#BBDEFB] bg-[#F8FBFF]'}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#1565C0]">{getNotificationTypeLabel(n.type)}</p><h2 className="mt-1 font-semibold text-[#212121]">{n.title}</h2><p className="mt-1 text-sm text-[#616161]">{n.message}</p><p className="mt-2 text-xs text-[#757575]">{formatDateTime(n.createdAt)}</p></div>{!n.isRead && <Button size="sm" variant="ghost" onClick={() => void api.markRead(n.id)}>Mark read</Button>}</div></Card>)}</div>}
  </div>
}
