import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useData } from '@/lib/store'
export function RecentActivity() { const activity = useData().activity.slice(0, 5); return <Card><CardHeader><CardTitle>Recent activity</CardTitle></CardHeader><CardContent><div className="space-y-3">{activity.map((item) => <p key={item.id} className="text-sm text-[var(--color-ink-muted)]">{item.message}</p>)}</div></CardContent></Card> }
