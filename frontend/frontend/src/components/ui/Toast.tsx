import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

type ToastTone = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const icons: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const toneClasses: Record<ToastTone, string> = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  info: 'text-[var(--color-info)]',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now()
    setItems((prev) => [...prev, { id, message, tone }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          {items.map((item) => {
            const Icon = icons[item.tone]
            return (
              <div
                key={item.id}
                role="status"
                className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-popover)] animate-[toastIn_180ms_ease-out]"
              >
                <Icon className={cn('size-4 shrink-0', toneClasses[item.tone])} />
                <span className="text-sm text-[var(--color-ink)]">{item.message}</span>
                <button
                  aria-label="Dismiss notification"
                  onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
                  className="ml-1 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body
      )}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
