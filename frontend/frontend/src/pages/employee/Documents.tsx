import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { useData } from '@/lib/store'
import { formatDate } from '@/lib/utils'

export function Documents() {
  const { documents, loading, error } = useData()
  return (
    <div>
      <PageHeader title="My documents" description="Documents shared with your Dayflow account." />
      <Card>
        <CardContent className="pt-5">
          {loading ? <SkeletonTable rows={4} /> : error ? (
            <EmptyState title="Unable to load documents" description={error} />
          ) : documents.length === 0 ? (
            <EmptyState icon={FileText} title="No documents available" description="Documents shared by HR will appear here." />
          ) : (
            <div className="space-y-2">
              {documents.map((document) => (
                <a key={document.id} href={document.url} className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-sm hover:bg-[var(--color-surface-sunken)]">
                  <span><span className="block font-medium text-[var(--color-ink)]">{document.name}</span><span className="block text-xs text-[var(--color-ink-muted)]">{document.mimeType || 'Document'}</span></span>
                  <span className="text-xs text-[var(--color-ink-muted)]">{formatDate(document.createdAt)}</span>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Documents
