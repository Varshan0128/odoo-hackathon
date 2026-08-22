import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useData } from '@/lib/store'
export function PendingRequests() { const requests = useData().leaveRequests.filter((request) => request.status === 'Pending').slice(0, 4); return <Card><CardHeader><CardTitle>Pending requests</CardTitle></CardHeader><CardContent><div className="space-y-3">{requests.map((request) => <div key={request.id} className="flex justify-between text-sm"><span>{request.employeeName}</span><span>{request.days} days</span></div>)}{!requests.length && <p className="text-sm text-slate-500">No pending requests.</p>}<Link className="text-sm text-[var(--color-primary)]" to="/leave">View leave management</Link></div></CardContent></Card> }
