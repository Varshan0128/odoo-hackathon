import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CalendarCheck,
  CalendarClock,
  Clock3,
  UserPlus,
  ClipboardCheck,
  Wallet,
  CheckCircle2,
  XCircle,
  ChevronRight,
  FileText,
  BarChart3,
  UserCog,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

const weeklyAttendance = [
  { day: 'Mon', present: 112, absent: 6, leave: 10 },
  { day: 'Tue', present: 115, absent: 4, leave: 9 },
  { day: 'Wed', present: 109, absent: 8, leave: 11 },
  { day: 'Thu', present: 118, absent: 3, leave: 7 },
  { day: 'Fri', present: 104, absent: 9, leave: 15 },
]

// Muted, professional palette — no saturated green/purple. All from :root tokens.
const CHART_COLORS = {
  present: 'var(--color-primary-soft)',
  leave: 'var(--color-ink-faint)',
  absent: 'var(--color-danger)',
}

function activityVisual(message: string) {
  const m = message.toLowerCase()
  if (m.includes('sick')) return { icon: FileText, tone: 'var(--color-info)', bg: 'var(--color-info-soft)' }
  if (m.includes('paid leave')) return { icon: Wallet, tone: 'var(--color-warning)', bg: 'var(--color-warning-soft)' }
  if (m.includes('approved')) return { icon: CheckCircle2, tone: 'var(--color-success)', bg: 'var(--color-success-soft)' }
  if (m.includes('checked in')) return { icon: Clock3, tone: 'var(--color-ink-muted)', bg: 'var(--color-surface-sunken)' }
  return { icon: UserCog, tone: 'var(--color-ink-muted)', bg: 'var(--color-surface-sunken)' }
}

export function AdminDashboard() {
  const { user } = useAuth()
  const { employees, attendance, leaveRequests, activity, approveLeave, rejectLeave } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [period, setPeriod] = useState<'This week' | 'Last week'>('This week')

  const todayIso = new Date().toISOString().slice(0, 10)
  const presentToday = attendance.filter((a) => a.date === todayIso && a.status === 'present').length
  const onLeaveToday = attendance.filter((a) => a.date === todayIso && a.status === 'leave').length
  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending').length
  const pendingRequests = leaveRequests.filter((r) => r.status === 'Pending').slice(0, 4)

  const approvedCount = leaveRequests.filter((r) => r.status === 'Approved').length
  const rejectedCount = leaveRequests.filter((r) => r.status === 'Rejected').length
  const totalForDistribution = approvedCount + pendingCount + rejectedCount || 1

  const leaveDistribution = [
    { name: 'Approved', value: approvedCount, color: 'var(--color-info)' },
    { name: 'Pending', value: pendingCount, color: 'var(--color-primary-soft)' },
    { name: 'Rejected', value: rejectedCount, color: 'var(--color-danger)' },
  ]

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name.split(' ')[0]}.`}
        description="Here's what's happening across your workforce today."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/employees')}>
              <UserPlus className="size-4" /> Add employee
            </Button>
            <Button size="sm" onClick={() => navigate('/leave')}>
              <ClipboardCheck className="size-4" /> Review leave
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Employees"
          value={employees.length}
          icon={Users}
          tone="neutral"
          trend="Across 5 departments"
          change={{ direction: 'up', value: '12%', label: 'vs last month' }}
        />
        <KpiCard
          label="Present Today"
          value={presentToday}
          icon={CalendarCheck}
          tone="success"
          trend={`${Math.round((presentToday / Math.max(employees.length, 1)) * 100)}% attendance`}
          change={{ direction: 'up', value: '8%', label: 'vs yesterday' }}
        />
        <KpiCard
          label="On Leave"
          value={onLeaveToday}
          icon={CalendarClock}
          tone="info"
          trend="Today"
          change={{ direction: 'down', value: '3%', label: 'vs yesterday' }}
        />
        <KpiCard
          label="Pending Requests"
          value={pendingCount}
          icon={Clock3}
          tone="warning"
          trend="Awaiting your review"
          change={{ direction: 'flat', value: '—', label: 'no change' }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Attendance overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance overview</CardTitle>
            <div className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-0.5 text-xs">
              {(['This week', 'Last week'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-[5px] px-2.5 py-1 font-medium transition-colors ${
                    period === p ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-ink-muted)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyAttendance} barGap={4}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-ink-muted)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-ink-muted)' }} width={28} />
                <Tooltip
                  cursor={{ fill: 'var(--color-surface-sunken)' }}
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }}
                />
                <Bar dataKey="present" stackId="a" fill={CHART_COLORS.present} radius={[0, 0, 0, 0]} />
                <Bar dataKey="leave" stackId="a" fill={CHART_COLORS.leave} radius={[0, 0, 0, 0]} />
                <Bar dataKey="absent" stackId="a" fill={CHART_COLORS.absent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-ink-muted)]">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: CHART_COLORS.present }} />Present</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: CHART_COLORS.leave }} />Leave</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[var(--color-danger)]" />Absent</span>
            </div>
          </CardContent>
        </Card>

        {/* Leave status */}
        <Card>
          <CardHeader>
            <CardTitle>Leave status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={leaveDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={68} paddingAngle={3}>
                  {leaveDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-2">
              {leaveDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[var(--color-ink-muted)]">
                    <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-medium text-[var(--color-ink)]">{d.value}</span>
                    <span className="text-xs text-[var(--color-ink-faint)]">
                      ({Math.round((d.value / totalForDistribution) * 100)}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Pending leave requests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pending leave requests</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <EmptyState title="No pending requests" description="New leave requests will show up here for review." />
            ) : (
              <div className="space-y-1">
                {pendingRequests.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] px-2 py-3 hover:bg-[var(--color-surface-sunken)]/60"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={r.employeeName} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ink)]">{r.employeeName}</p>
                        <p className="text-xs text-[var(--color-ink-muted)]">
                          {r.type} · {formatDate(r.startDate)} – {formatDate(r.endDate)} ({r.days}d)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="warning">Pending</Badge>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          approveLeave(r.id)
                          toast(`${r.employeeName}'s leave was approved.`)
                        }}
                      >
                        <CheckCircle2 className="size-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          rejectLeave(r.id)
                          toast(`${r.employeeName}'s leave was rejected.`, 'info')
                        }}
                      >
                        <XCircle className="size-3.5" /> Reject
                      </Button>
                      <button
                        onClick={() => navigate(`/leave?request=${r.id}`)}
                        className="rounded-full p-1 text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-ink-muted)]"
                        aria-label="View request"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/activity')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3.5">
              {activity.slice(0, 5).map((item) => {
                const { icon: Icon, tone, bg } = activityVisual(item.message)
                return (
                  <li key={item.id} className="flex items-start gap-3 text-sm">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)]"
                      style={{ backgroundColor: bg, color: tone }}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <p className="text-[var(--color-ink)]">{item.message}</p>
                      <p className="shrink-0 text-xs text-[var(--color-ink-faint)]">
                        {new Date(item.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <QuickAction icon={UserPlus} label="Add employee" desc="Create new employee" onClick={() => navigate('/employees')} />
          <QuickAction icon={CalendarCheck} label="View attendance" desc="Monitor workforce attendance" onClick={() => navigate('/attendance')} />
          <QuickAction icon={ClipboardCheck} label="Review leaves" desc="Approve or reject requests" onClick={() => navigate('/leave')} />
          <QuickAction icon={Wallet} label="Run payroll" desc="Process employee salaries" onClick={() => navigate('/payroll')} />
          <QuickAction icon={BarChart3} label="View reports" desc="Analytics & insights" onClick={() => navigate('/reports')} />
        </CardContent>
      </Card>
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: typeof UserPlus
  label: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3.5 text-left transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-sunken)]/40"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-[var(--color-ink)]">{label}</p>
        <p className="text-[11px] leading-snug text-[var(--color-ink-faint)]">{desc}</p>
      </div>
    </button>
  )
}
