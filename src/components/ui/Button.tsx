import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-primary-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
  };
  
  // Loading state
  const loadingState = isLoading ? 'relative !text-transparent' : '';
  
  // Full width
  const widthClass = fullWidth ? 'w-full' : '';

  // Loading class - Moved before usage
  const loadingClass = isLoading ? 'cursor-not-allowed' : '';
  
  // Combine classes
  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${loadingClass}
    ${widthClass}
    ${className}
  `;

  return (
    <button 
      className={classes} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      {leftIcon && <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{rightIcon}</span>}
    </button>
  );
};