import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { DataProvider } from '@/lib/store'
import { AuthProvider } from '@/lib/auth'
import { AppRoutes } from '@/routes/AppRoutes'
import './styles/globals.css'
import './styles/theme.css'

function App() { return <DataProvider><AuthProvider><ToastProvider><AppRoutes /></ToastProvider></AuthProvider></DataProvider> }

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>)
