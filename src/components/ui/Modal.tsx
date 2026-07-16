import { ReactNode } from 'react'

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-md shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-surface-border">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl font-bold">&times;</button>
        </div>
        <div className="p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
