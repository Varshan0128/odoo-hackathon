import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { useData } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { EmployeeStatus } from '@/types'

const statusTone: Record<EmployeeStatus, 'success' | 'info' | 'neutral'> = {
  Active: 'success',
  'On Leave': 'info',
  Inactive: 'neutral',
}

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'leave', label: 'Leave' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'documents', label: 'Documents' },
]

export function EmployeeProfile({ forceEmployeeId }: { forceEmployeeId?: string } = {}) {
  const { employeeId: routeEmployeeId } = useParams()
  const employeeId = forceEmployeeId ?? routeEmployeeId
  const navigate = useNavigate()
  const { employees, attendance, leaveRequests, salaries, updateEmployee } = useData()
  const { user } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)

  const employee = employees.find((e) => e.employeeId === employeeId)
  const isSelf = user?.employeeId === employeeId
  const canEditAll = user?.role === 'admin'

  const [form, setForm] = useState({ phone: employee?.phone ?? '', address: employee?.address ?? '' })

  if (!employee) {
    return (
      <EmptyState
        title="Employee not found"
        description="This profile may have been removed."
        action={
          <Button size="sm" onClick={() => navigate('/employees')}>
            Back to directory
          </Button>
        }
      />
    )
  }

  const myAttendance = attendance.filter((a) => a.employeeId === employee.employeeId).sort((a, b) => (a.date < b.date ? 1 : -1))
  const myLeave = leaveRequests.filter((r) => r.employeeId === employee.employeeId)
  const mySalary = salaries.find((s) => s.employeeId === employee.employeeId)
  const canEditContact = canEditAll || isSelf

  return (
    <div>
      {!forceEmployeeId && (
        <button
          onClick={() => navigate('/employees')}
          className="mb-3 flex items-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="size-3.5" /> Back to employees
        </button>
      )}

      <Card className="mb-5">
        <CardContent className="flex flex-col gap-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={employee.name} color={employee.avatarColor} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">{employee.name}</h1>
                <Badge tone={statusTone[employee.status]}>{employee.status}</Badge>
              </div>
              <p className="text-sm text-[var(--color-ink-muted)]">
                {employee.position} · {employee.department} · {employee.employeeId}
              </p>
            </div>
          </div>
          {canEditContact && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (editing) {
                  updateEmployee(employee.employeeId, { phone: form.phone, address: form.address })
                  toast('Profile updated.')
                }
                setEditing((v) => !v)
              }}
            >
              <Pencil className="size-3.5" /> {editing ? 'Save changes' : 'Edit contact info'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Detail icon={Mail} label="Email" value={employee.email} />
              {editing ? (
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} label="Phone" />
              ) : (
                <Detail icon={Phone} label="Phone" value={employee.phone || 'Not provided'} />
              )}
              {editing ? (
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} label="Address" />
              ) : (
                <Detail icon={MapPin} label="Address" value={employee.address || 'Not provided'} />
              )}
              <Detail icon={Calendar} label="Joined" value={formatDate(employee.joinDate)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Job details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Detail label="Employee ID" value={employee.employeeId} />
              <Detail label="Department" value={employee.department} />
              <Detail label="Position" value={employee.position} />
              <Detail label="Access role" value={employee.role === 'admin' ? 'HR / Admin' : 'Employee'} />
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'attendance' && (
        <Card>
          <CardContent className="pt-5">
            {myAttendance.length === 0 ? (
              <EmptyState title="No attendance recorded" description="Records will appear once check-ins begin." />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Check in</Th>
                    <Th>Check out</Th>
                  </tr>
                </Thead>
                <tbody>
                  {myAttendance.map((a) => (
                    <Tr key={a.id}>
                      <Td>{formatDate(a.date)}</Td>
                      <Td>
                        <AttendanceBadge status={a.status} />
                      </Td>
                      <Td className="text-[var(--color-ink-muted)]">{a.checkIn ?? '—'}</Td>
                      <Td className="text-[var(--color-ink-muted)]">{a.checkOut ?? '—'}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'leave' && (
        <Card>
          <CardContent className="pt-5">
            {myLeave.length === 0 ? (
              <EmptyState title="No leave requests" description="This employee hasn't applied for leave yet." />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Type</Th>
                    <Th>Dates</Th>
                    <Th>Days</Th>
                    <Th>Status</Th>
                  </tr>
                </Thead>
                <tbody>
                  {myLeave.map((r) => (
                    <Tr key={r.id}>
                      <Td>{r.type}</Td>
                      <Td className="text-[var(--color-ink-muted)]">
                        {formatDate(r.startDate)} – {formatDate(r.endDate)}
                      </Td>
                      <Td>{r.days}</Td>
                      <Td>
                        <Badge tone={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>
                          {r.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'payroll' && (
        <Card>
          <CardContent className="pt-5">
            {!mySalary ? (
              <EmptyState title="Payroll not configured" description="Set up a salary structure for this employee." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <SalaryStat label="Basic" value={mySalary.basic} />
                <SalaryStat label="HRA" value={mySalary.hra} />
                <SalaryStat label="Allowances" value={mySalary.allowances} />
                <SalaryStat label="Deductions" value={-mySalary.deductions} negative />
                <div className="col-span-2 sm:col-span-4">
                  <div className="mt-2 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] p-4">
                    <p className="text-xs font-medium text-[var(--color-primary)]">Net salary</p>
                    <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-primary)]">
                      {formatCurrency(mySalary.netSalary)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'documents' && (
        <Card>
          <CardContent className="pt-5">
            <EmptyState title="No documents uploaded" description="Offer letters, ID proofs, and policies will appear here." />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Detail({ icon: Icon, label, value }: { icon?: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-[var(--color-ink-faint)]" />}
      <div>
        <p className="text-xs text-[var(--color-ink-muted)]">{label}</p>
        <p className="text-[var(--color-ink)]">{value}</p>
      </div>
    </div>
  )
}

function SalaryStat({ label, value, negative }: { label: string; value: number; negative?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-ink-muted)]">{label}</p>
      <p className={`font-medium ${negative ? 'text-[var(--color-danger)]' : 'text-[var(--color-ink)]'}`}>
        {negative ? '-' : ''}
        {formatCurrency(Math.abs(value))}
      </p>
    </div>
  )
}

function AttendanceBadge({ status }: { status: 'present' | 'absent' | 'half-day' | 'leave' }) {
  const map = {
    present: { tone: 'success' as const, label: 'Present' },
    absent: { tone: 'danger' as const, label: 'Absent' },
    'half-day': { tone: 'warning' as const, label: 'Half-day' },
    leave: { tone: 'info' as const, label: 'Leave' },
  }
  const cfg = map[status]
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>
}
