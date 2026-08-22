import { PageHeader } from '@/components/ui/PageHeader'
import { PayrollTable } from '@/components/payroll/PayrollTable'
import { useData } from '@/lib/store'
export function Payroll() { return <><PageHeader title="Payroll" description="Review salary structures and monthly payroll." /><PayrollTable salaries={useData().salaries} /></> }
export default Payroll
