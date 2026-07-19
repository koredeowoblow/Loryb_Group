import { ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  /** Optional subtitle shown below the title */
  description?: string
  children: ReactNode
  /** 'sm' = 448px | 'md' = 560px (default) | 'lg' = 720px | 'xl' = 900px */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Slot for footer actions (Cancel / Save buttons) */
  footer?: ReactNode
}

const SIZE_CLASS = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Trap focus inside modal
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={clsx(
          'relative z-10 w-full flex flex-col bg-surface-overlay rounded-none sm:rounded-lg shadow-lg',
          'border border-surface-border outline-none',
          'max-h-[95dvh] sm:max-h-[90dvh]',
          SIZE_CLASS[size],
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-surface-border shrink-0">
          <div>
            <h2
              id="modal-title"
              className="text-md font-semibold text-text-primary"
            >
              {title}
            </h2>
            {description && (
              <p className="text-xs text-text-muted mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost p-1 rounded-sm mt-0.5 shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t border-surface-border bg-surface-active/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
