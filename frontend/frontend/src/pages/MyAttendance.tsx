import { useState } from 'react'
import { LogIn, LogOut as LogOutIcon } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'
import { SkeletonTable } from '@/components/ui/Skeleton'

const statusConfig: Record<AttendanceStatus, { tone: 'success' | 'danger' | 'warning' | 'info'; label: string }> = {
  present: { tone: 'success', label: 'Present' },
  late: { tone: 'warning', label: 'Late' },
  absent: { tone: 'danger', label: 'Absent' },
  'half-day': { tone: 'warning', label: 'Half-day' },
  leave: { tone: 'info', label: 'Leave' },
}

export function MyAttendance() {
  const { user } = useAuth()
  const { checkIn, checkOut, todayAttendanceFor, weeklyAttendanceFor, loading, error } = useData()
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)

  if (!user) return null

  const today = todayAttendanceFor(user.employeeId)
  const weekly = weeklyAttendanceFor(user.employeeId)

  const updateAttendance = async (action: 'in' | 'out') => {
    setBusy(true)
    try {
      if (action === 'in') {
        await checkIn()
        toast('Checked in for today.')
      } else {
        await checkOut()
        toast('Checked out. See you tomorrow.')
      }
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : 'Unable to update attendance.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader title="My Attendance" description="Track your daily check-ins and review your recent history." />

      <Card className="mb-5">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              {!today?.checkIn ? "You haven't checked in yet" : !today?.checkOut ? `Checked in — ${today.checkIn}` : 'Day complete'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              {!today?.checkIn
                ? 'Mark your attendance to start the day.'
                : !today?.checkOut
                ? "Check out when you're done for the day."
                : `${today.checkIn} – ${today.checkOut}`}
            </p>
          </div>
          {!today?.checkIn ? (
            <Button
              onClick={() => { void updateAttendance('in') }}
              loading={busy}
            >
              <LogIn className="size-4" /> Check in
            </Button>
          ) : !today?.checkOut ? (
            <Button
              variant="secondary"
              onClick={() => { void updateAttendance('out') }}
              loading={busy}
            >
              <LogOutIcon className="size-4" /> Check out
            </Button>
          ) : (
            <Badge tone="success">Complete</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <EmptyState title="Unable to load attendance" description={error} />
          ) : weekly.length === 0 ? (
            <EmptyState title="No records yet" description="Your attendance history will appear here." />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Check in</Th>
                  <Th>Check out</Th>
                  <Th>Duration</Th>
                </tr>
              </Thead>
              <tbody>
                {weekly.map((r) => {
                  const cfg = statusConfig[r.status]
                  return (
                    <Tr key={r.id}>
                      <Td>{formatDate(r.date)}</Td>
                      <Td>
                        <Badge tone={cfg.tone}>{cfg.label}</Badge>
                      </Td>
                      <Td className="text-[var(--color-ink-muted)]">{r.checkIn ?? '—'}</Td>
                      <Td className="text-[var(--color-ink-muted)]">{r.checkOut ?? '—'}</Td>
                      <Td className="text-[var(--color-ink-muted)]">{r.workingDuration ?? '—'}</Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
