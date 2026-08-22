import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import type { LeaveRequest, LeaveStatus } from '@/types'

const tabs: { value: LeaveStatus | 'All'; label: string }[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'All', label: 'All' },
]

export function AdminLeaveApproval() {
  const { leaveRequests, approveLeave, rejectLeave } = useData()
  const { toast } = useToast()
  const [tab, setTab] = useState<LeaveStatus | 'All'>('Pending')
  const [reviewing, setReviewing] = useState<LeaveRequest | null>(null)
  const [action, setAction] = useState<'Approve' | 'Reject' | null>(null)
  const [comment, setComment] = useState('')

  const filtered = leaveRequests
    .filter((r) => tab === 'All' || r.status === tab)
    .sort((a, b) => (a.appliedOn < b.appliedOn ? 1 : -1))

  const openReview = (r: LeaveRequest, a: 'Approve' | 'Reject') => {
    setReviewing(r)
    setAction(a)
    setComment('')
  }

  const confirmReview = () => {
    if (!reviewing || !action) return
    if (action === 'Approve') {
      approveLeave(reviewing.id, comment || undefined)
      toast(`${reviewing.employeeName}'s leave was approved.`)
    } else {
      rejectLeave(reviewing.id, comment || undefined)
      toast(`${reviewing.employeeName}'s leave was rejected.`, 'info')
    }
    setReviewing(null)
  }

  return (
    <div>
      <PageHeader title="Leave Management" description="Review, approve, or reject employee leave requests." />

      <Tabs tabs={tabs} value={tab} onChange={(v) => setTab(v as LeaveStatus | 'All')} className="mb-5" />

      <Card>
        <CardContent className="pt-5">
          {filtered.length === 0 ? (
            <EmptyState title={`No ${tab.toLowerCase()} requests`} description="Requests matching this filter will appear here." />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Employee</Th>
                  <Th>Type</Th>
                  <Th>Dates</Th>
                  <Th>Applied on</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </Thead>
              <tbody>
                {filtered.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={r.employeeName} size="sm" />
                        <div>
                          <p className="font-medium text-[var(--color-ink)]">{r.employeeName}</p>
                          <p className="text-xs text-[var(--color-ink-muted)]">{r.department}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>{r.type}</Td>
                    <Td className="text-[var(--color-ink-muted)]">
                      {formatDate(r.startDate)} – {formatDate(r.endDate)} ({r.days}d)
                    </Td>
                    <Td className="text-[var(--color-ink-muted)]">{formatDate(r.appliedOn)}</Td>
                    <Td>
                      <Badge tone={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>
                        {r.status}
                      </Badge>
                    </Td>
                    <Td>
                      {r.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openReview(r, 'Approve')}>
                            <CheckCircle2 className="size-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openReview(r, 'Reject')}>
                            <XCircle className="size-3.5" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-ink-faint)]">{r.comment || '—'}</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        title={`${action} leave request`}
        description={reviewing ? `${reviewing.employeeName} · ${reviewing.type} · ${formatDate(reviewing.startDate)} – ${formatDate(reviewing.endDate)}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReviewing(null)}>
              Cancel
            </Button>
            <Button variant={action === 'Reject' ? 'danger' : 'primary'} onClick={confirmReview}>
              Confirm {action?.toLowerCase()}
            </Button>
          </>
        }
      >
        {reviewing?.remarks && (
          <p className="mb-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] p-3 text-sm text-[var(--color-ink-muted)]">
            "{reviewing.remarks}"
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[var(--color-ink)]">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Visible to the employee"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:outline-none focus-visible:border-[var(--color-primary)]"
          />
        </div>
      </Modal>
    </div>
  )
}
