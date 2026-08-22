import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Search, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { leaveService } from '@/services/leave.service'
import type { LeaveRequest, LeaveStatus } from '@/types'

const tabs: { value: LeaveStatus | 'All'; label: string }[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'All', label: 'All' },
]

export function AdminLeaveApproval() {
  const { employees, approveLeave, rejectLeave, loading: employeesLoading, error: employeesError } = useData()
  const { toast } = useToast()
  const [tab, setTab] = useState<LeaveStatus | 'All'>('Pending')
  const [query, setQuery] = useState('')
  const [employeeId, setEmployeeId] = useState('All')
  const [reviewing, setReviewing] = useState<LeaveRequest | null>(null)
  const [action, setAction] = useState<'Approve' | 'Reject' | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [requestsError, setRequestsError] = useState('')

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true)
    setRequestsError('')
    try {
      const result = await leaveService.list({
        status: tab,
        employeeId: employeeId === 'All' ? undefined : employeeId,
        search: query.trim() || undefined,
      })
      setRequests(result)
    } catch (requestError) {
      setRequests([])
      setRequestsError(requestError instanceof Error ? requestError.message : 'Unable to load leave requests.')
    } finally {
      setRequestsLoading(false)
    }
  }, [employeeId, query, tab])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRequests() }, 200)
    return () => window.clearTimeout(timer)
  }, [loadRequests])

  const openReview = (request: LeaveRequest, nextAction: 'Approve' | 'Reject') => {
    setReviewing(request)
    setAction(nextAction)
    setComment('')
  }

  const confirmReview = async () => {
    if (!reviewing || !action) return
    setSubmitting(true)
    try {
      if (action === 'Approve') {
        await approveLeave(reviewing.id, comment || undefined)
        toast(reviewing.employeeName + '\'s leave was approved.')
      } else {
        await rejectLeave(reviewing.id, comment || undefined)
        toast(reviewing.employeeName + '\'s leave was rejected.', 'info')
      }
      await loadRequests()
      setReviewing(null)
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : 'Unable to review this leave request.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Leave Management" description="Review, approve, or reject employee leave requests." />
      <Tabs tabs={tabs} value={tab} onChange={(value) => setTab(value as LeaveStatus | 'All')} className="mb-5" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search employee, type, or department" />
        </div>
        <Select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} className="sm:w-56">
          <option value="All">All employees</option>
          {employees.map((employee) => <option key={employee.id} value={employee.employeeId}>{employee.name}</option>)}
        </Select>
      </div>

      <Card>
        <CardContent className="pt-5">
          {employeesLoading || requestsLoading ? <SkeletonTable rows={6} /> : employeesError || requestsError ? (
            <EmptyState title="Unable to load leave requests" description={employeesError || requestsError} />
          ) : requests.length === 0 ? (
            <EmptyState title={'No ' + tab.toLowerCase() + ' requests'} description="Requests matching this filter will appear here." />
          ) : (
            <Table>
              <Thead><tr><Th>Employee</Th><Th>Type</Th><Th>Dates</Th><Th>Applied on</Th><Th>Status</Th><Th>Action</Th></tr></Thead>
              <tbody>
                {requests.map((request) => (
                  <Tr key={request.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={request.employeeName} size="sm" />
                        <div><p className="font-medium text-[var(--color-ink)]">{request.employeeName}</p><p className="text-xs text-[var(--color-ink-muted)]">{request.department}</p></div>
                      </div>
                    </Td>
                    <Td>{request.type}</Td>
                    <Td className="text-[var(--color-ink-muted)]">{formatDate(request.startDate)} – {formatDate(request.endDate)} ({request.days}d)</Td>
                    <Td className="text-[var(--color-ink-muted)]">{formatDate(request.appliedOn)}</Td>
                    <Td><Badge tone={request.status === 'Approved' ? 'success' : request.status === 'Rejected' ? 'danger' : 'warning'}>{request.status}</Badge></Td>
                    <Td>
                      {request.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openReview(request, 'Approve')}><CheckCircle2 className="size-3.5" /> Approve</Button>
                          <Button size="sm" variant="ghost" onClick={() => openReview(request, 'Reject')}><XCircle className="size-3.5" /> Reject</Button>
                        </div>
                      ) : <span className="text-xs text-[var(--color-ink-faint)]">{request.comment || '—'}</span>}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={Boolean(reviewing)}
        onClose={() => setReviewing(null)}
        title={(action || 'Review') + ' leave request'}
        description={reviewing ? reviewing.employeeName + ' · ' + reviewing.type + ' · ' + formatDate(reviewing.startDate) + ' – ' + formatDate(reviewing.endDate) : undefined}
        footer={<><Button variant="secondary" onClick={() => setReviewing(null)} disabled={submitting}>Cancel</Button><Button variant={action === 'Reject' ? 'danger' : 'primary'} onClick={() => { void confirmReview() }} loading={submitting}>Confirm {(action || '').toLowerCase()}</Button></>}
      >
        {reviewing?.remarks && <p className="mb-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] p-3 text-sm text-[var(--color-ink-muted)]">{reviewing.remarks}</p>}
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-[var(--color-ink)]">Comment (optional)</span>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Visible to the employee" className="rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:outline-none focus-visible:border-[var(--color-primary)]" />
        </label>
      </Modal>
    </div>
  )
}
