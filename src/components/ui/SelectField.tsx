import { useId } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'

interface SelectFieldProps {
  field: AnyFieldApi
  label: string
  options: { label: string; value: string }[]
}

export function SelectField({ 
  field, label, options 
}: SelectFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hasError = !!field.state.meta.errors?.length

  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</label>
      <select
        id={id}
        name={field.name}
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e: any) => field.handleChange(e.target.value)}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="w-full px-3 py-2 border border-surface-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError ? (
        <em id={errorId} className="text-status-error text-xs mt-1 block">
          {field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message || 'Invalid input').join(', ')}
        </em>
      ) : null}
    </div>
  )
}
