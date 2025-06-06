import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helper, fullWidth = false, onChange, className = '', ...props }, ref) => {
    const baseSelectClasses = `
      block px-3 py-2 w-full
      rounded-md border border-gray-300
      shadow-sm
      focus:border-primary-500 focus:ring-primary-500
      sm:text-sm
      disabled:cursor-not-allowed disabled:opacity-50
      ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
    `;

    const widthClass = fullWidth ? 'w-full' : '';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

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
        <select
          ref={ref}
          className={baseSelectClasses}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select';