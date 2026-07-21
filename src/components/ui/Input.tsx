import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isCheckboxOrRadio = type === 'checkbox' || type === 'radio';

    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          isCheckboxOrRadio
            ? 'w-4 h-4 text-primary rounded cursor-pointer border-surface-border accent-primary'
            : 'px-3 py-2 text-sm border border-surface-border rounded-sm bg-surface-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
