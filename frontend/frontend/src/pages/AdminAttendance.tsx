import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardContent } from '@/components/ui/Card'
import { useData } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

const statusConfig: Record<AttendanceStatus, { tone: 'success' | 'danger' | 'warning' | 'info'; label: string }> = {
  present: { tone: 'success', label: 'Present' },
  absent: { tone: 'danger', label: 'Absent' },
  'half-day': { tone: 'warning', label: 'Half-day' },
  leave: { tone: 'info', label: 'Leave' },
}

export function AdminAttendance() {
  const { employees, attendance } = useData()
  const [query, setQuery] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const rows = useMemo(() => {
    return employees
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.employeeId.toLowerCase().includes(query.toLowerCase()))
      .map((e) => ({
        employee: e,
        record: attendance.find((a) => a.employeeId === e.employeeId && a.date === date),
      }))
  }, [employees, attendance, query, date])

  const summary = useMemo(() => {
    const dayRecords = attendance.filter((a) => a.date === date)
    return {
      present: dayRecords.filter((a) => a.status === 'present').length,
      absent: dayRecords.filter((a) => a.status === 'absent').length,
      leave: dayRecords.filter((a) => a.status === 'leave').length,
      halfDay: dayRecords.filter((a) => a.status === 'half-day').length,
    }
  }, [attendance, date])

  return (
    <div>
      <PageHeader title="Attendance" description="Monitor daily attendance across the organization." />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryChip label="Present" value={summary.present} tone="success" />
        <SummaryChip label="Absent" value={summary.absent} tone="danger" />
        <SummaryChip label="Half-day" value={summary.halfDay} tone="warning" />
        <SummaryChip label="On leave" value={summary.leave} tone="info" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <Input placeholder="Search employee" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={date} onChange={(e) => setDate(e.target.value)} className="sm:w-48">
          <option value="2026-08-22">Today · 22 Aug</option>
          <option value="2026-08-21">21 Aug</option>
          <option value="2026-08-20">20 Aug</option>
          <option value="2026-08-19">19 Aug</option>
          <option value="2026-08-18">18 Aug</option>
        </Select>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No employees found" description="Try a different search term." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th>Check in</Th>
              <Th>Check out</Th>
            </tr>
          </Thead>
          <tbody>
            {rows.map(({ employee, record }) => (
              <Tr key={employee.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={employee.name} color={employee.avatarColor} size="sm" />
                    <div>
                      <p className="font-medium text-[var(--color-ink)]">{employee.name}</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">{employee.employeeId}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-[var(--color-ink-muted)]">{employee.department}</Td>
                <Td>
                  {record ? (
                    <Badge tone={statusConfig[record.status].tone}>{statusConfig[record.status].label}</Badge>
                  ) : (
                    <Badge tone="neutral">Not marked</Badge>
                  )}
                </Td>
                <Td className="text-[var(--color-ink-muted)]">{record?.checkIn ?? '—'}</Td>
                <Td className="text-[var(--color-ink-muted)]">{record?.checkOut ?? '—'}</Td>
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
  const dotClass = {
    success: 'bg-[var(--color-success)]',
    danger: 'bg-[var(--color-danger)]',
    warning: 'bg-[var(--color-warning)]',
    info: 'bg-[var(--color-info)]',
  }[tone]
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-3.5">
        <span className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
          <span className={`size-2 rounded-full ${dotClass}`} />
          {label}
        </span>
        <span className="text-lg font-semibold text-[var(--color-ink)]">{value}</span>
      </CardContent>
    </Card>
  )
}
