import { PageHeader } from '@/components/ui/PageHeader'
import { DocumentsSection } from '@/components/profile/DocumentsSection'
export function Documents() { return <><PageHeader title="Documents" description="Access your employee documents." /><div className="rounded-lg border border-[var(--color-border)] bg-white p-5"><DocumentsSection /></div></> }
export default Documents
