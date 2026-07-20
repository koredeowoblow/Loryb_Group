import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  emphasis?: 'label' | 'normal';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'sm', emphasis = 'label', isLoading, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          // Variants
          {
            'bg-primary text-text-inverse hover:bg-primary-hover shadow-sm border border-primary-light': variant === 'primary',
            'border border-surface-border text-text-secondary hover:bg-surface-active bg-surface-base': variant === 'secondary',
            'bg-transparent hover:bg-surface-active text-text-primary': variant === 'ghost',
            'bg-status-danger hover:bg-status-danger-dark text-text-inverse shadow-sm border border-status-error-dark': variant === 'danger',
          },
          // Sizes (normalized strict scale)
          {
            'px-3 py-2 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
          },
          // Emphasis
          {
            'font-header font-bold uppercase tracking-wider': emphasis === 'label',
            'font-semibold': emphasis === 'normal',
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';
