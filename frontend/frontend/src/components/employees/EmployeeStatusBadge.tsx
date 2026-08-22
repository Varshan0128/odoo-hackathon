import { Badge } from '@/components/ui/Badge'
import type { EmployeeStatus } from '@/types'
export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) { const tone = status === 'Active' ? 'success' : status === 'On Leave' ? 'warning' : 'neutral'; return <Badge tone={tone}>{status}</Badge> }
