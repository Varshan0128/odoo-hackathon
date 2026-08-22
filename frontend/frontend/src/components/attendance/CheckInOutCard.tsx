import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
export function CheckInOutCard() { const { user } = useAuth(); const { todayAttendanceFor, checkIn, checkOut } = useData(); if (!user) return null; const record = todayAttendanceFor(user.employeeId); return <Card><CardHeader><CardTitle>Today&apos;s attendance</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-slate-500">{record?.checkIn ? `Checked in at ${record.checkIn}` : 'Not checked in yet'}</p><div className="flex gap-2"><Button onClick={() => checkIn(user.employeeId)} disabled={!!record?.checkIn}>Check in</Button><Button variant="secondary" onClick={() => checkOut(user.employeeId)} disabled={!record?.checkIn || !!record?.checkOut}>Check out</Button></div></CardContent></Card> }
