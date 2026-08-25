import React from 'react';

export default function DatePicker({
  label,
  id,
  error,
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
      <input
        id={id}
        type="date"
        className={`w-full bg-brand-navy-950 border border-brand-navy-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark] cursor-pointer ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400 mt-1 select-none">
          {error}
        </p>
      )}
    </div>
  );
}
