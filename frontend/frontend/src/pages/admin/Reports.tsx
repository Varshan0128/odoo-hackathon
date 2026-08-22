import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/utils'
import { reportService, type ReportSummary } from '@/services/report.service'

function todayInIndia() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== 'literal') result[part.type] = part.value
      return result
    }, {})
  return parts.year + '-' + parts.month + '-' + parts.day
}

function weekStart(date: string) {
  const values = date.split('-').map(Number)
  const current = new Date(Date.UTC(values[0], values[1] - 1, values[2]))
  const day = current.getUTCDay()
  current.setUTCDate(current.getUTCDate() + (day === 0 ? -6 : 1 - day))
  return current.toISOString().slice(0, 10)
}

export function Reports() {
  const today = todayInIndia()
  const [startDate, setStartDate] = useState(() => weekStart(today))
  const [endDate, setEndDate] = useState(today)
  const [report, setReport] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setReport(await reportService.summary(startDate, endDate))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load report.')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div>
      <PageHeader title="Reports & analytics" description="Organization metrics calculated from persisted Dayflow records." />
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <Input label="From" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-44" />
        <Input label="To" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-44" />
        <Button onClick={() => { void load() }} loading={loading}>Apply range</Button>
      </div>
      {loading && !report ? <div className="grid gap-5 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36" />)}</div> : error ? (
        <EmptyState title="Unable to load reports" description={error} action={<Button onClick={() => { void load() }}>Retry</Button>} />
      ) : report ? (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <Metric label="Employees" value={String(report.totalEmployees)} />
            <Metric label="Total net payroll" value={formatCurrency(report.totalNetPayroll)} />
            <Metric label="Leave requests" value={String(Object.values(report.leaveDistribution).reduce((total, value) => total + value, 0))} />
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Attendance summary</CardTitle></CardHeader>
              <CardContent>
                {report.attendanceSeries.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={report.attendanceSeries}>
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="present" stackId="attendance" fill="var(--color-primary-soft)" />
                      <Bar dataKey="leave" stackId="attendance" fill="var(--color-ink-faint)" />
                      <Bar dataKey="absent" stackId="attendance" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyState title="No attendance in this range" description="Choose another date range to view attendance data." />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Leave summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Breakdown label="Approved" value={report.leaveDistribution.approved} />
                <Breakdown label="Pending" value={report.leaveDistribution.pending} />
                <Breakdown label="Rejected" value={report.leaveDistribution.rejected} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="py-5"><p className="text-sm text-[var(--color-ink-muted)]">{label}</p><p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{value}</p></CardContent></Card>
}

function Breakdown({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-[var(--color-ink-muted)]">{label}</span><span className="font-semibold text-[var(--color-ink)]">{value}</span></div>
}

export default Reports
