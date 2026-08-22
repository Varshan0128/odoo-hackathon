import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { Table, Td, Th, Thead, Tr } from '@/components/ui/Table'
import { useData } from '@/lib/store'
import { formatDate } from '@/lib/utils'

export function Documents() {
  const { documents, loading, error } = useData()
  return (
    <div>
      <PageHeader title="Documents" description="Documents currently stored in the Dayflow backend." />
      <Card>
        <CardContent className="pt-5">
          {loading ? <SkeletonTable rows={5} /> : error ? (
            <EmptyState title="Unable to load documents" description={error} />
          ) : documents.length === 0 ? (
            <EmptyState icon={FileText} title="No documents available" description="The current backend has no persisted documents to display." />
          ) : (
            <Table>
              <Thead><tr><Th>Document</Th><Th>Employee</Th><Th>Created</Th><Th></Th></tr></Thead>
              <tbody>
                {documents.map((document) => (
                  <Tr key={document.id}>
                    <Td><p className="font-medium">{document.name}</p><p className="text-xs text-[var(--color-ink-muted)]">{document.mimeType || 'Document'}</p></Td>
                    <Td>{document.fullName || 'Organization'}</Td>
                    <Td>{formatDate(document.createdAt)}</Td>
                    <Td><a href={document.url} className="text-sm font-medium text-[var(--color-primary)] hover:underline">Open</a></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Documents
