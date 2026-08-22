import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import type { LeaveType } from '@/types'

const leaveTypes: LeaveType[] = ['Paid', 'Sick', 'Unpaid']

export function MyLeave() {
  const { user } = useAuth()
  const { leaveRequests, applyLeave } = useData()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: 'Paid' as LeaveType, startDate: '', endDate: '', remarks: '' })
  const [error, setError] = useState('')

  if (!user) return null

  const mine = leaveRequests.filter((r) => r.employeeId === user.employeeId).sort((a, b) => (a.appliedOn < b.appliedOn ? 1 : -1))

  const submit = () => {
    if (!form.startDate || !form.endDate) {
      setError('Choose a start and end date.')
      return
    }
    if (form.endDate < form.startDate) {
      setError('End date cannot be before the start date.')
      return
    }
    applyLeave({
      employeeId: user.employeeId,
      employeeName: user.name,
      department: user.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      remarks: form.remarks,
    })
    toast('Leave request submitted for review.')
    setOpen(false)
    setForm({ type: 'Paid', startDate: '', endDate: '', remarks: '' })
    setError('')
  }

  return (
    <div>
      <PageHeader
        title="My Leave"
        description="Apply for time off and track the status of your requests."
        action={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Apply for leave
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-5">
          {mine.length === 0 ? (
            <EmptyState
              title="No leave requests yet"
              description="Apply for leave and it will show up here with its status."
              action={
                <Button size="sm" onClick={() => setOpen(true)}>
                  Apply for leave
                </Button>
              }
            />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Type</Th>
                  <Th>Dates</Th>
                  <Th>Days</Th>
                  <Th>Remarks</Th>
                  <Th>Status</Th>
                </tr>
              </Thead>
              <tbody>
                {mine.map((r) => (
                  <Tr key={r.id}>
                    <Td>{r.type}</Td>
                    <Td className="text-[var(--color-ink-muted)]">
                      {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    </Td>
                    <Td>{r.days}</Td>
                    <Td className="max-w-[220px] truncate text-[var(--color-ink-muted)]">{r.remarks || '—'}</Td>
                    <Td>
                      <div>
                        <Badge tone={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>
                          {r.status}
                        </Badge>
                        {r.comment && <p className="mt-1 text-xs text-[var(--color-ink-faint)]">{r.comment}</p>}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Apply for leave"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Submit request</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select label="Leave type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LeaveType })}>
            {leaveTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <Input label="End date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--color-ink)]">Remarks (optional)</label>
            <textarea
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              rows={3}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:outline-none focus-visible:border-[var(--color-primary)]"
              placeholder="Add any context for HR"
            />
          </div>
          {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
        </div>
      </Modal>
    </div>
  )
}
