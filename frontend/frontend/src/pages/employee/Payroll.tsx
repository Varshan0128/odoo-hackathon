import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/utils'

export function Payroll() {
  const { user } = useAuth()
  const { salaries, loading, error } = useData()
  const salary = salaries.find((record) => record.employeeId === user?.employeeId)

  return (
    <div>
      <PageHeader title="My payroll" description="Your current salary structure, provided by HR." />
      {loading ? <Skeleton className="h-72" /> : error ? (
        <EmptyState title="Unable to load payroll" description={error} />
      ) : !salary ? (
        <EmptyState title="Payroll not set up yet" description="Your HR team has not published a salary structure for you." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Salary breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <PayRow label="Basic salary" value={salary.basic} />
              <PayRow label="House rent allowance" value={salary.hra} />
              <PayRow label="Other allowances" value={salary.allowances} />
              <PayRow label="Deductions" value={-salary.deductions} deduction />
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="font-medium text-[var(--color-ink)]">Net salary</span>
                <span className="text-xl font-semibold text-[var(--color-primary)]">{formatCurrency(salary.netSalary)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Current period</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[var(--color-ink)]">{formatDate(salary.lastRevised)}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Salary structure effective date</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function PayRow({ label, value, deduction }: { label: string; value: number; deduction?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-ink-muted)]">{label}</span>
      <span className={deduction ? 'font-medium text-[var(--color-danger)]' : 'font-medium text-[var(--color-ink)]'}>{deduction ? '−' : ''}{formatCurrency(Math.abs(value))}</span>
    </div>
  )
}

export default Payroll
