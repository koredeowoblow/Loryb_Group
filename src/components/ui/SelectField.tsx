
interface SelectFieldProps {
  field: any
  label: string
  options: { label: string; value: string }[]
}

export function SelectField({ field, label, options }: SelectFieldProps) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</label>
      <select
        name={field.name}
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e: any) => field.handleChange(e.target.value)}
        className="w-full px-3 py-2 border border-surface-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {field.state.meta.errors ? (
        <em className="text-status-error text-xs mt-1 block">{field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message || 'Invalid input').join(', ')}</em>
      ) : null}
    </div>
  )
}
