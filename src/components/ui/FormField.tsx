import { useId } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'

interface FormFieldProps {
  field: AnyFieldApi
  label: string
  type?: string
}

export function FormField({
  field, label, type = 'text'
}: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hasError = !!field.state.meta.errors?.length

  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</label>
      <input
        id={id}
        type={type}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e: any) => field.handleChange(e.target.value)}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="w-full px-3 py-2 text-sm border border-surface-border bg-surface-base rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-shadow text-text-primary placeholder:text-text-muted"
      />
      {hasError && (
        <em id={errorId} className="text-status-danger text-xs mt-1 block">
          {field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message || 'Invalid input').join(', ')}
        </em>
      )}
    </div>
  )
}
