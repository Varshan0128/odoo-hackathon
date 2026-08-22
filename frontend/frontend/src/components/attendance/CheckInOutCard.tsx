import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

export function CheckInOutCard() {
  const { user } = useAuth()
  const { todayAttendanceFor, checkIn, checkOut } = useData()
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  if (!user) return null
  const record = todayAttendanceFor(user.employeeId)

  const perform = async (action: 'in' | 'out') => {
    setBusy(true)
    try {
      if (action === 'in') {
        await checkIn()
        toast('Checked in for today.')
      } else {
        await checkOut()
        toast('Checked out. See you tomorrow.')
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to update attendance.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Today&apos;s attendance</CardTitle></CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
          {record?.checkIn ? 'Checked in at ' + record.checkIn : 'Not checked in yet'}
        </p>
        <div className="flex gap-2">
          <Button onClick={() => { void perform('in') }} loading={busy && !record?.checkIn} disabled={Boolean(record?.checkIn)}>
            Check in
          </Button>
          <Button
            variant="secondary"
            onClick={() => { void perform('out') }}
            loading={busy && Boolean(record?.checkIn)}
            disabled={!record?.checkIn || Boolean(record?.checkOut)}
          >
            Check out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
