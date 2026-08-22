import { Card, CardContent } from '@/components/ui/Card'
import type { LeaveRequest } from '@/types'
export function LeaveRequestCard({ request }: { request: LeaveRequest }) { return <Card><CardContent><div className="flex justify-between"><strong>{request.type} leave</strong><span>{request.days} days</span></div><p className="mt-2 text-sm text-slate-500">{request.startDate} – {request.endDate}</p></CardContent></Card> }
