import { formatCurrency } from '@/utils/format'
import type { SalaryStructure } from '@/types'
export function SalaryInformation({ salary }: { salary?: SalaryStructure }) { return <section><h2 className="font-semibold">Salary information</h2><p className="mt-2 text-sm text-slate-500">{salary ? formatCurrency(salary.netSalary) : 'Salary information unavailable'}</p></section> }
