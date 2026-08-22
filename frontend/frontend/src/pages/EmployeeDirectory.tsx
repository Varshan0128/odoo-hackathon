import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tr, Th, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import type { Employee, EmployeeStatus } from '@/types'
import { formatDate } from '@/lib/utils'

const statusTone: Record<EmployeeStatus, 'success' | 'info' | 'neutral'> = {
  Active: 'success',
  'On Leave': 'info',
  Inactive: 'neutral',
}

export function EmployeeDirectory() {
  const { employees, addEmployee } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')
  const [addOpen, setAddOpen] = useState(false)

  const departments = useMemo(() => ['All', ...new Set(employees.map((e) => e.department))], [employees])

  const filtered = employees.filter((e) => {
    const matchesQuery =
      e.name.toLowerCase().includes(query.toLowerCase()) || e.employeeId.toLowerCase().includes(query.toLowerCase())
    const matchesDept = dept === 'All' || e.department === dept
    return matchesQuery && matchesDept
  })

  return (
    <div>
      <PageHeader
        title="Employees"
        description={`${employees.length} people across the organization.`}
        action={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4" /> Add employee
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <Input placeholder="Search by name or ID" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={dept} onChange={(e) => setDept(e.target.value)} className="sm:w-48">
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No employees found" description="Try a different search term or filter." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {filtered.map((e) => (
              <Tr key={e.id} className="cursor-pointer" onClick={() => navigate(`/employees/${e.employeeId}`)}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={e.name} color={e.avatarColor} size="sm" />
                    <div>
                      <p className="font-medium text-[var(--color-ink)]">{e.name}</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">{e.employeeId}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-[var(--color-ink-muted)]">{e.department}</Td>
                <Td className="text-[var(--color-ink-muted)]">{e.position}</Td>
                <Td className="text-[var(--color-ink-muted)]">{formatDate(e.joinDate)}</Td>
                <Td>
                  <Badge tone={statusTone[e.status]}>{e.status}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <AddEmployeeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(e) => {
          addEmployee(e)
          toast(`${e.name} was added.`)
          setAddOpen(false)
        }}
      />
    </div>
  )
}

function AddEmployeeModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (e: Omit<Employee, 'id'>) => void
}) {
  const [form, setForm] = useState({ name: '', employeeId: '', email: '', department: '', position: '' })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add employee"
      description="Create a profile placeholder. Full onboarding will connect to the backend next."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!form.name || !form.employeeId || !form.email) return
              onAdd({
                ...form,
                role: 'employee',
                avatarColor: '#3F6A93',
                status: 'Active',
                phone: '',
                address: '',
                joinDate: new Date().toISOString().slice(0, 10),
              })
              setForm({ name: '', employeeId: '', email: '', department: '', position: '' })
            }}
          >
            Add employee
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
        <Input label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        <Input label="Work email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
    </Modal>
  )
}
