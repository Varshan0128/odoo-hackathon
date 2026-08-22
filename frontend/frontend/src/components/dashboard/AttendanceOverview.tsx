import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useData } from '@/lib/store'
export function AttendanceOverview() { const { attendance } = useData(); const present = attendance.filter((item) => item.status === 'present').length; return <Card><CardHeader><CardTitle>Attendance overview</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{present}</p><p className="text-sm text-[var(--color-ink-muted)]">present records</p></CardContent></Card> }
