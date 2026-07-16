import { useId } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'

interface DateTimeFieldProps {
  field: AnyFieldApi
  label: string
}

export function DateTimeField({ 
  field, label 
}: DateTimeFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hasError = !!field.state.meta.errors?.length

  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</label>
      <input
        id={id}
        type="datetime-local"
        name={field.name}
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e: any) => field.handleChange(e.target.value)}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="w-full px-2.5 py-1.5 text-sm border border-surface-border bg-surface rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
      />
      {hasError ? (
        <em id={errorId} className="text-status-error text-xs mt-1 block">
          {field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message || 'Invalid input').join(', ')}
        </em>
      ) : null}
    </div>
  )
}
