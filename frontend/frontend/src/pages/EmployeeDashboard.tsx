import { useNavigate } from 'react-router-dom'
import { CalendarClock, Wallet, CheckCircle2, LogIn, LogOut as LogOutIcon, FolderOpen } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency, formatDate } from '@/lib/utils'

const leaveToneFor = { Pending: 'warning', Approved: 'success', Rejected: 'danger' } as const

export function EmployeeDashboard() {
  const { user } = useAuth()
  const { leaveRequests, salaries, checkIn, checkOut, todayAttendanceFor } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()

  if (!user) return null

  const today = todayAttendanceFor(user.employeeId)
  const myLeave = leaveRequests.filter((r) => r.employeeId === user.employeeId).slice(0, 3)
  const mySalary = salaries.find((s) => s.employeeId === user.employeeId)

  return (
    <div>
      <PageHeader title={`Good morning, ${user.name.split(' ')[0]}.`} description="Here's what's happening with your workday today." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Check-in card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
              <CheckCircle2 className={today?.checkIn ? 'size-7 text-[var(--color-success)]' : 'size-7 text-[var(--color-primary)]'} />
            </div>
            {!today?.checkIn ? (
              <>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">You haven't checked in yet</p>
                  <p className="mt-1 text-xs text-[var(--color-ink-muted)]">Mark your attendance to start the day.</p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    checkIn(user.employeeId)
                    toast('Checked in for today.')
                  }}
                >
                  <LogIn className="size-4" /> Check in
                </Button>
              </>
            ) : !today?.checkOut ? (
              <>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">Checked in — {today.checkIn}</p>
                  <p className="mt-1 text-xs text-[var(--color-ink-muted)]">Don't forget to check out at the end of the day.</p>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    checkOut(user.employeeId)
                    toast('Checked out. See you tomorrow.')
                  }}
                >
                  <LogOutIcon className="size-4" /> Check out
                </Button>
              </>
            ) : (
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">Day complete</p>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  {today.checkIn} – {today.checkOut}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My leave */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My recent leave requests</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {myLeave.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No leave requests yet"
                description="When you apply for leave, it will appear here."
                action={
                  <Button size="sm" onClick={() => navigate('/leave')}>
                    Apply for leave
                  </Button>
                }
              />
            ) : (
              <div className="space-y-1">
                {myLeave.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-[var(--radius-sm)] px-2 py-2.5 hover:bg-[var(--color-surface-sunken)]/60">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-ink)]">{r.type} leave</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {formatDate(r.startDate)} – {formatDate(r.endDate)} · {r.days} day{r.days > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge tone={leaveToneFor[r.status]}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My payroll</CardTitle>
          </CardHeader>
          <CardContent>
            {mySalary ? (
              <div>
                <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  {formatCurrency(mySalary.netSalary)}
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">Net salary · last revised {formatDate(mySalary.lastRevised)}</p>
                <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => navigate('/payroll')}>
                  <Wallet className="size-4" /> View breakdown
                </Button>
              </div>
            ) : (
              <EmptyState title="Payroll not set up yet" description="Reach out to HR if this looks wrong." />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FolderOpen}
              title="No documents uploaded"
              description="Offer letters, policies, and payslips will appear here once shared by HR."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
