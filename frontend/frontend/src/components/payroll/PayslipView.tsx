import { formatCurrency } from '@/utils/format'
import type { SalaryStructure } from '@/types'
export function PayslipView({ salary }: { salary: SalaryStructure }) { return <div className="rounded border border-[var(--color-border)] bg-white p-5"><h3 className="font-semibold">Payslip · {salary.employeeId}</h3><dl className="mt-4 grid gap-2 text-sm"><div className="flex justify-between"><dt>Basic</dt><dd>{formatCurrency(salary.basic)}</dd></div><div className="flex justify-between"><dt>Net salary</dt><dd className="font-semibold">{formatCurrency(salary.netSalary)}</dd></div></dl></div> }
