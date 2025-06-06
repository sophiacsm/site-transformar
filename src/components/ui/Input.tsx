import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, leftIcon, rightIcon, helper, className = '', ...props }, ref) => {
    const baseInputClasses = `
      block px-4 py-2 w-full
      rounded-md border border-gray-300 
      shadow-sm 
      focus:border-primary-500 focus:ring-primary-500 
      sm:text-sm
      disabled:cursor-not-allowed disabled:opacity-50
      ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
    `;

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={baseInputClasses}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
        
        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';