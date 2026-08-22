import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  UserCog,
  UserPlus,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { AttentionCenter } from '@/components/dashboard/AttentionCenter'

const chartColors = {
  present: 'var(--color-primary-soft)',
  leave: 'var(--color-ink-faint)',
  absent: 'var(--color-danger)',
}

function activityVisual(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('leave')) return { icon: FileText, tone: 'var(--color-info)', background: 'var(--color-info-soft)' }
  if (normalized.includes('payroll')) return { icon: Wallet, tone: 'var(--color-warning)', background: 'var(--color-warning-soft)' }
  if (normalized.includes('checked')) return { icon: Clock3, tone: 'var(--color-ink-muted)', background: 'var(--color-surface-sunken)' }
  if (normalized.includes('approved')) return { icon: CheckCircle2, tone: 'var(--color-success)', background: 'var(--color-success-soft)' }
  return { icon: UserCog, tone: 'var(--color-ink-muted)', background: 'var(--color-surface-sunken)' }
}

export function AdminDashboard() {
  const { user } = useAuth()
  const { dashboard, leaveRequests, loading, error, reloadDashboard, approveLeave, rejectLeave } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [period, setPeriod] = useState<'This week' | 'Last week'>('This week')
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const pendingRequests = leaveRequests.filter((request) => request.status === 'Pending').slice(0, 4)
  const data = dashboard

  const choosePeriod = async (nextPeriod: 'This week' | 'Last week') => {
    setPeriod(nextPeriod)
    try {
      await reloadDashboard(nextPeriod === 'This week' ? 'this_week' : 'last_week')
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : 'Unable to refresh attendance.', 'error')
    }
  }

  const decide = async (id: string, decision: 'approve' | 'reject') => {
    setReviewingId(id)
    try {
      if (decision === 'approve') {
        const request = await approveLeave(id)
        toast(request.employeeName + '\'s leave was approved.')
      } else {
        const request = await rejectLeave(id)
        toast(request.employeeName + '\'s leave was rejected.', 'info')
      }
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : 'Unable to review this leave request.', 'error')
    } finally {
      setReviewingId(null)
    }
  }

  const leaveDistribution = [
    { name: 'Approved', value: data?.leaveDistribution.approved ?? 0, color: 'var(--color-info)' },
    { name: 'Pending', value: data?.leaveDistribution.pending ?? 0, color: 'var(--color-primary-soft)' },
    { name: 'Rejected', value: data?.leaveDistribution.rejected ?? 0, color: 'var(--color-danger)' },
  ]
  const leaveTotal = leaveDistribution.reduce((total, item) => total + item.value, 0) || 1

  return (
    <div>
      <PageHeader
        title={'Good day, ' + (user?.name.split(' ')[0] || 'there') + '.'}
        description="Here is the current state of your workforce."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/employees')}><UserPlus className="size-4" /> Add employee</Button>
            <Button size="sm" onClick={() => navigate('/leave')}><ClipboardCheck className="size-4" /> Review leave</Button>
          </div>
        }
      />

      {loading && !data ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>
      ) : error && !data ? (
        <EmptyState title="Unable to load the dashboard" description={error} action={<Button onClick={() => { void reloadDashboard('this_week') }}>Try again</Button>} />
      ) : (
        <>
          <AttentionCenter />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard label="Total employees" value={data?.metrics.totalEmployees ?? 0} icon={Users} tone="neutral" trend="Active directory records" />
            <KpiCard label="Present today" value={data?.metrics.presentToday ?? 0} icon={CalendarCheck} tone="success" trend="Recorded attendance today" />
            <KpiCard label="On leave" value={data?.metrics.onLeaveToday ?? 0} icon={CalendarClock} tone="info" trend="Approved leave today" />
            <KpiCard label="Pending requests" value={data?.metrics.pendingRequests ?? 0} icon={Clock3} tone="warning" trend="Awaiting review" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Attendance overview</CardTitle>
                <div className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-0.5 text-xs">
                  {(['This week', 'Last week'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => { void choosePeriod(option) }}
                      className={'rounded-[5px] px-2.5 py-1 font-medium transition-colors ' + (period === option ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-ink-muted)]')}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {data?.attendanceSeries.length ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.attendanceSeries} barGap={4}>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-ink-muted)' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-ink-muted)' }} width={28} />
                        <Tooltip cursor={{ fill: 'var(--color-surface-sunken)' }} contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }} />
                        <Bar dataKey="present" stackId="attendance" fill={chartColors.present} />
                        <Bar dataKey="leave" stackId="attendance" fill={chartColors.leave} />
                        <Bar dataKey="absent" stackId="attendance" fill={chartColors.absent} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-ink-muted)]">
                      <Legend color={chartColors.present} label="Present" />
                      <Legend color={chartColors.leave} label="Leave" />
                      <Legend color={chartColors.absent} label="Absent / not marked" />
                    </div>
                  </>
                ) : <EmptyState title="No attendance records" description="Attendance data will appear here as employees check in." />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Leave status</CardTitle></CardHeader>
              <CardContent>
                {leaveTotal > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={leaveDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={68} paddingAngle={3}>
                        {leaveDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="flex h-40 items-center justify-center text-sm text-[var(--color-ink-muted)]">No leave requests yet.</div>}
                <div className="mt-2 space-y-2">
                  {leaveDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[var(--color-ink-muted)]"><span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                      <span className="font-medium text-[var(--color-ink)]">{item.value} <span className="text-xs font-normal text-[var(--color-ink-faint)]">({Math.round(item.value / leaveTotal * 100)}%)</span></span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Pending leave requests</CardTitle><Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>View all</Button></CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <EmptyState title="No pending requests" description="New leave requests will show up here for review." />
                ) : (
                  <div className="space-y-1">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] px-2 py-3 hover:bg-[var(--color-surface-sunken)]/60">
                        <div className="flex items-center gap-3">
                          <Avatar name={request.employeeName} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-[var(--color-ink)]">{request.employeeName}</p>
                            <p className="text-xs text-[var(--color-ink-muted)]">{request.type} · {formatDate(request.startDate)} – {formatDate(request.endDate)} ({request.days}d)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge tone="warning">Pending</Badge>
                          <Button size="sm" variant="secondary" loading={reviewingId === request.id} onClick={() => { void decide(request.id, 'approve') }}><CheckCircle2 className="size-3.5" /> Approve</Button>
                          <Button size="sm" variant="ghost" disabled={reviewingId === request.id} onClick={() => { void decide(request.id, 'reject') }}><XCircle className="size-3.5" /> Reject</Button>
                          <button onClick={() => navigate('/leave?request=' + request.id)} className="rounded-full p-1 text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-sunken)]" aria-label="View request"><ChevronRight className="size-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
              <CardContent>
                {(data?.activity.length ?? 0) === 0 ? <EmptyState title="No recent activity" description="Real activity appears here as work is completed." /> : (
                  <ul className="space-y-3.5">
                    {data?.activity.map((item) => {
                      const visual = activityVisual(item.message)
                      const Icon = visual.icon
                      return (
                        <li key={item.id} className="flex items-start gap-3 text-sm">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)]" style={{ backgroundColor: visual.background, color: visual.tone }}><Icon className="size-3.5" /></span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[var(--color-ink)]">{item.message}</p>
                            <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">{new Date(item.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-5">
            <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <QuickAction icon={UserPlus} label="Add employee" description="Create an employee record" onClick={() => navigate('/employees')} />
              <QuickAction icon={CalendarCheck} label="Attendance" description="Monitor attendance" onClick={() => navigate('/attendance')} />
              <QuickAction icon={ClipboardCheck} label="Review leaves" description="Approve or reject requests" onClick={() => navigate('/leave')} />
              <QuickAction icon={Wallet} label="Payroll" description="Review salary records" onClick={() => navigate('/payroll')} />
              <QuickAction icon={BarChart3} label="Reports" description="View data-backed summaries" onClick={() => navigate('/reports')} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: color }} />{label}</span>
}

function QuickAction({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: typeof UserPlus
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3.5 text-left transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-sunken)]/40">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><Icon className="size-4" /></span>
      <span><span className="block text-[13px] font-medium text-[var(--color-ink)]">{label}</span><span className="block text-[11px] leading-snug text-[var(--color-ink-faint)]">{description}</span></span>
    </button>
  )
}
