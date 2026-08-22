import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardContent } from '@/components/ui/Card'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { useData } from '@/lib/store'
import { attendanceService } from '@/services/attendance.service'
import { formatDate } from '@/lib/utils'
import type { AttendanceRecord, AttendanceStatus } from '@/types'

const statusConfig: Record<AttendanceStatus, { tone: 'success' | 'danger' | 'warning' | 'info'; label: string }> = {
  present: { tone: 'success', label: 'Present' },
  late: { tone: 'warning', label: 'Late' },
  absent: { tone: 'danger', label: 'Absent' },
  'half-day': { tone: 'warning', label: 'Half-day' },
  leave: { tone: 'info', label: 'Leave' },
}

function dateInIndia() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== 'literal') result[part.type] = part.value
      return result
    }, {})
  return parts.year + '-' + parts.month + '-' + parts.day
}

export function AdminAttendance() {
  const { employees, loading: employeesLoading, error: employeesError } = useData()
  const [query, setQuery] = useState('')
  const [date, setDate] = useState(dateInIndia)
  const [status, setStatus] = useState<'All' | AttendanceStatus>('All')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(true)
  const [recordsError, setRecordsError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      setRecordsLoading(true)
      setRecordsError('')
      try {
        const response = await attendanceService.list({ date })
        if (active) setRecords(response)
      } catch (requestError) {
        if (active) {
          setRecords([])
          setRecordsError(requestError instanceof Error ? requestError.message : 'Unable to load attendance.')
        }
      } finally {
        if (active) setRecordsLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [date])

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return employees
      .filter((employee) => !normalizedQuery || (employee.name + ' ' + employee.employeeId + ' ' + employee.department).toLowerCase().includes(normalizedQuery))
      .map((employee) => ({
        employee,
        record: records.find((entry) => entry.employeeId === employee.employeeId),
      }))
      .filter(({ record }) => status === 'All' || record?.status === status)
  }, [employees, query, records, status])

  const summary = useMemo(() => {
    const dayRecords = records
    return {
      present: dayRecords.filter((record) => record.status === 'present').length,
      absent: dayRecords.filter((record) => record.status === 'absent').length,
      leave: dayRecords.filter((record) => record.status === 'leave').length,
      halfDay: dayRecords.filter((record) => record.status === 'half-day').length,
    }
  }, [records])

  return (
    <div>
      <PageHeader title="Attendance" description="Monitor database-backed daily attendance across the organization." />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryChip label="Present" value={summary.present} tone="success" />
        <SummaryChip label="Absent" value={summary.absent} tone="danger" />
        <SummaryChip label="Half-day" value={summary.halfDay} tone="warning" />
        <SummaryChip label="On leave" value={summary.leave} tone="info" />
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <Input placeholder="Search employee" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" />
        </div>
        <Input aria-label="Attendance date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-48" />
        <Select value={status} onChange={(event) => setStatus(event.target.value as 'All' | AttendanceStatus)} className="sm:w-40">
          <option value="All">All statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="half-day">Half-day</option>
          <option value="leave">On leave</option>
        </Select>
      </div>

      {employeesLoading || recordsLoading ? <SkeletonTable rows={6} /> : employeesError || recordsError ? (
        <EmptyState title="Unable to load attendance" description={employeesError || recordsError} />
      ) : rows.length === 0 ? (
        <EmptyState title="No attendance records found" description="Try a different date, filter, or search term." />
      ) : (
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Department</Th><Th>Status</Th><Th>Check in</Th><Th>Check out</Th><Th>Duration</Th></tr></Thead>
          <tbody>
            {rows.map(({ employee, record }) => (
              <Tr key={employee.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={employee.name} color={employee.avatarColor} size="sm" />
                    <div><p className="font-medium text-[var(--color-ink)]">{employee.name}</p><p className="text-xs text-[var(--color-ink-muted)]">{employee.employeeId}</p></div>
                  </div>
                </Td>
                <Td className="text-[var(--color-ink-muted)]">{employee.department}</Td>
                <Td>{record ? <Badge tone={statusConfig[record.status].tone}>{statusConfig[record.status].label}</Badge> : <Badge tone="neutral">Not marked</Badge>}</Td>
                <Td className="text-[var(--color-ink-muted)]">{record?.checkIn ?? '—'}</Td>
                <Td className="text-[var(--color-ink-muted)]">{record?.checkOut ?? '—'}</Td>
                <Td className="text-[var(--color-ink-muted)]">{record?.workingDuration ?? '—'}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
      <p className="mt-3 text-xs text-[var(--color-ink-faint)]">Viewing records for {formatDate(date)}.</p>
    </div>
  )
}

function SummaryChip({ label, value, tone }: { label: string; value: number; tone: 'success' | 'danger' | 'warning' | 'info' }) {
  const dotClass = { success: 'bg-[var(--color-success)]', danger: 'bg-[var(--color-danger)]', warning: 'bg-[var(--color-warning)]', info: 'bg-[var(--color-info)]' }[tone]
  return <Card><CardContent className="flex items-center justify-between py-3.5"><span className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]"><span className={'size-2 rounded-full ' + dotClass} />{label}</span><span className="text-lg font-semibold text-[var(--color-ink)]">{value}</span></CardContent></Card>
}
