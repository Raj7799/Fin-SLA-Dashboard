import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 tracking-wide uppercase select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-gray-500 flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-brand-navy-950 border border-brand-navy-700 rounded-lg py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-400 mt-1 select-none animate-pulse-subtle">
          {error}
        </p>
      )}
    </div>
  );
}
