import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 inline-flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-amber-700 text-white hover:bg-amber-800 disabled:bg-slate-400',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="inline-block animate-spin">⏳</span>}
      {children}
    </button>
  );
}
