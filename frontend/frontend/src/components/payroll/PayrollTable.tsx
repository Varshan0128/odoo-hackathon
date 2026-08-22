import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { formatCurrency } from '@/utils/format'
import type { SalaryStructure } from '@/types'
export function PayrollTable({ salaries }: { salaries: SalaryStructure[] }) { return <Table><Thead><Tr><Th>Employee ID</Th><Th>Basic</Th><Th>Deductions</Th><Th>Net salary</Th></Tr></Thead><tbody>{salaries.map((salary) => <Tr key={salary.employeeId}><Td>{salary.employeeId}</Td><Td>{formatCurrency(salary.basic)}</Td><Td>{formatCurrency(salary.deductions)}</Td><Td>{formatCurrency(salary.netSalary)}</Td></Tr>)}</tbody></Table> }
