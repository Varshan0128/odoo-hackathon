import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useData } from '@/lib/store'
export function LeaveOverview() { const pending = useData().leaveRequests.filter((request) => request.status === 'Pending').length; return <Card><CardHeader><CardTitle>Leave overview</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{pending}</p><p className="text-sm text-[var(--color-ink-muted)]">pending requests</p></CardContent></Card> }
