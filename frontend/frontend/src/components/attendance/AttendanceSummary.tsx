import { StatCard } from '@/components/dashboard/StatCard'
import { useData } from '@/lib/store'
export function AttendanceSummary() { const records = useData().attendance; return <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Present" value={records.filter((r) => r.status === 'present').length} /><StatCard label="Absent" value={records.filter((r) => r.status === 'absent').length} /><StatCard label="On leave" value={records.filter((r) => r.status === 'leave').length} /></div> }
