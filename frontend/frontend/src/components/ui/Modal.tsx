import { type ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-popover)] animate-[modalIn_150ms_ease-out]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-[var(--color-ink)]">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-sunken)]"
          >
            <X className="size-4" />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
      <style>{`@keyframes modalIn { from { opacity: 0; transform: translateY(4px) scale(0.98); } to { opacity: 1; transform: none; } }`}</style>
    </div>,
    document.body
  )
}
