import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  /** Show a leading icon */
  icon?: React.ReactNode
  isLoading?: boolean
}

const VARIANT = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}

const SIZE = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-2 text-sm gap-2',
  lg: 'px-4 py-2.5 text-base gap-2',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(
        'btn',
        VARIANT[variant],
        SIZE[size],
        (disabled || isLoading) && 'opacity-50 pointer-events-none',
        className,
      ))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading
        ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        : icon
      }
      {children}
    </button>
  )
}
