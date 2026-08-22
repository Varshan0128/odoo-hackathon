import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ToastProvider } from '@/components/ui/Toast'
import { DataProvider } from '@/lib/store'
import { AuthProvider } from '@/lib/auth'
import { RedirectIfAuthed, RequireAuth } from '@/routes/guards'
import { SignIn } from '@/pages/auth/Login'
import { SignUp } from '@/pages/auth/Signup'
import { Dashboard } from '@/pages/Dashboard'
import { Attendance } from '@/pages/Attendance'
import { EmployeeDirectory } from '@/pages/EmployeeDirectory'
import { EmployeeProfile } from '@/pages/EmployeeProfile'
import { MyLeave } from '@/pages/MyLeave'
import './styles/globals.css'
import './styles/theme.css'

function App() {
  return <DataProvider><AuthProvider><ToastProvider><Routes>
    <Route path="/signin" element={<RedirectIfAuthed><SignIn /></RedirectIfAuthed>} />
    <Route path="/signup" element={<RedirectIfAuthed><SignUp /></RedirectIfAuthed>} />
    <Route element={<RequireAuth><AppShell /></RequireAuth>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/employees" element={<EmployeeDirectory />} />
      <Route path="/employees/:employeeId" element={<EmployeeProfile />} />
      <Route path="/leave" element={<MyLeave />} />
      <Route path="/profile" element={<EmployeeProfile />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></ToastProvider></AuthProvider></DataProvider>
}

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>)
