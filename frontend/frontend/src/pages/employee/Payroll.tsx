import { PageHeader } from '@/components/ui/PageHeader'
import { PayrollTable } from '@/components/payroll/PayrollTable'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
export function Payroll() { const { user } = useAuth(); const salaries = useData().salaries.filter((salary) => salary.employeeId === user?.employeeId); return <><PageHeader title="My payroll" /><PayrollTable salaries={salaries} /></> }
export default Payroll
