import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export function ActionButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ActionButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 active:scale-95',
    secondary: 'bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-lg shadow-secondary-200 hover:shadow-xl hover:shadow-secondary-300 active:scale-95',
    success: 'bg-gradient-to-br from-success-400 to-success-600 text-white shadow-lg shadow-success-200 hover:shadow-xl hover:shadow-success-300 active:scale-95',
    danger: 'bg-gradient-to-br from-error-400 to-error-600 text-white shadow-lg shadow-error-200 hover:shadow-xl hover:shadow-error-300 active:scale-95',
    ghost: 'bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 border border-gray-200',
    outline: 'bg-transparent text-primary-600 border-2 border-primary-300 hover:bg-primary-50 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <button
      className={`font-display font-bold transition-all duration-200 ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
