import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { useData } from '@/lib/store'
export function Documents() { const { employees } = useData(); return <><PageHeader title="Documents" description="Organization documents and employee document access." /><Card><CardContent><p className="text-sm text-slate-500">Document workspace for {employees.length} employees is ready for backend-managed files.</p></CardContent></Card></> }
export default Documents
