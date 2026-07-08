
interface FormFieldProps {
  field: any
  label: string
  type?: string
}

export function FormField({ field, label, type = 'text' }: FormFieldProps) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e: any) => field.handleChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-sm border border-surface-border bg-white rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
      />
      {field.state.meta.errors ? (
        <em className="text-status-error text-xs mt-1 block">{field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message || 'Invalid input').join(', ')}</em>
      ) : null}
    </div>
  )
}
