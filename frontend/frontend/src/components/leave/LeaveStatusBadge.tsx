import { Badge } from '@/components/ui/Badge'
import type { LeaveStatus } from '@/types'
export function LeaveStatusBadge({ status }: { status: LeaveStatus }) { const tone = status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'; return <Badge tone={tone}>{status}</Badge> }
