import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded font-header font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm border border-primary-light',
    secondary: 'bg-surface-active hover:bg-surface-active/80 text-text-primary shadow-sm border border-surface-border',
    outline: 'bg-transparent hover:bg-surface-active text-text-secondary border border-surface-border',
    destructive: 'bg-status-error hover:bg-status-error/90 text-white shadow-sm border border-status-error',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button 
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  )
}
