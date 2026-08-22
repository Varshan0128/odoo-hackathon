import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import type { SalaryStructure } from '@/types'
export function SalaryCard({ salary }: { salary: SalaryStructure }) { return <Card><CardHeader><CardTitle>Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{formatCurrency(salary.netSalary)}</p><p className="text-sm text-slate-500">Net monthly salary</p></CardContent></Card> }
