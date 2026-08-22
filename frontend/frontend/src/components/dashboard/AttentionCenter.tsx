import { useEffect, useMemo, useState } from 'react'
import { Check, EyeOff, RefreshCw } from 'lucide-react'
import { exceptionService } from '@/services/exception.service'
import type { HrException, ExceptionSeverity } from '@/types/exception'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'

const tone = (severity: ExceptionSeverity) => severity === 'URGENT' ? 'danger' : severity === 'ATTENTION' ? 'warning' : 'neutral'

export function AttentionCenter() {
  const [items, setItems] = useState<HrException[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const load = async () => { setLoading(true); try { setItems(await exceptionService.list()) } catch (error) { toast(error instanceof Error ? error.message : 'Unable to load exceptions.', 'error') } finally { setLoading(false) } }
  useEffect(() => { void load() }, [])
  const visible = useMemo(() => items.filter((item) => { const type = item.type || ''; return filter === 'All' || item.severity === filter || (filter === 'Leave' && type.startsWith('LEAVE_')) || (filter === 'Attendance' && type === 'ATTENDANCE_ANOMALY') || (filter === 'Profile' && type === 'PROFILE_DATA_QUALITY') || (filter === 'Payroll' && type === 'PAYROLL_CHANGE') }), [items, filter])
  const action = async (id: string, kind: 'review' | 'dismiss') => { try { const result = kind === 'review' ? await exceptionService.review(id) : await exceptionService.dismiss(id); setItems((current) => current.map((item) => item.id === id ? result.exception : item)) } catch (error) { toast(error instanceof Error ? error.message : 'Unable to update exception.', 'error') } }
  return <Card className="mt-5"><CardHeader><div><CardTitle>Attention center</CardTitle><p className="mt-1 text-xs text-[var(--color-ink-muted)]">Evidence-based exceptions requiring HR review.</p></div><Button variant="ghost" size="sm" onClick={() => { void load() }}><RefreshCw className="size-4" /> Refresh</Button></CardHeader><CardContent>
    <div className="mb-4 flex flex-wrap gap-2">{['All', 'URGENT', 'ATTENTION', 'WATCH', 'Attendance', 'Leave', 'Profile', 'Payroll'].map((item) => <button key={item} onClick={() => setFilter(item)} className={'rounded-full border px-2.5 py-1 text-xs ' + (filter === item ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-ink-muted)]')}>{item}</button>)}</div>
    {loading ? <p className="text-sm text-[var(--color-ink-muted)]">Evaluating current HR data…</p> : !visible.length ? <EmptyState title="Nothing needs attention" description="No open exceptions match this filter." /> : <div className="space-y-3">{visible.map((item) => { const type = item.type || 'HR_EXCEPTION'; return <div key={item.id} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Badge tone={tone(item.severity)}>{item.severity}</Badge><span className="text-xs text-[var(--color-ink-faint)]">{type.replaceAll('_', ' ')}</span></div><p className="mt-2 text-sm font-medium text-[var(--color-ink)]">{item.title}</p><p className="mt-1 text-sm text-[var(--color-ink-muted)]">{item.aiExplanation || item.summary}</p>{item.evidence && <p className="mt-2 text-xs text-[var(--color-ink-faint)]">Evidence: {Object.entries(item.evidence).map(([key, value]) => `${key}: ${String(value)}`).join(' · ')}</p>}</div><div className="flex shrink-0 gap-2"><Button size="sm" variant="secondary" onClick={() => { void action(item.id, 'review') }}><Check className="size-3.5" /> Review</Button><Button size="sm" variant="ghost" onClick={() => { void action(item.id, 'dismiss') }}><EyeOff className="size-3.5" /> Dismiss</Button></div></div></div> })}</div>}
  </CardContent></Card>
}
