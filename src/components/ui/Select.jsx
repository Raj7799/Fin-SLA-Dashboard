import React from 'react';

export default function Select({
  label,
  id,
  options = [], // [{ value: 'x', label: 'X' }] or ['x', 'y']
  error,
  className = '',
  placeholder,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 tracking-wide uppercase select-none">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full bg-brand-navy-950 border border-brand-navy-700 rounded-lg py-2 pl-3 pr-8 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
          }`}
          {...props}
        >
          {placeholder && <option value="All">{placeholder}</option>}
          {options.map((opt, idx) => {
            const isObj = typeof opt === 'object';
            const value = isObj ? opt.value : opt;
            const text = isObj ? opt.label : opt;
            return (
              <option key={idx} value={value} className="bg-brand-navy-900 text-gray-200">
                {text}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-rose-400 mt-1 select-none">
          {error}
        </p>
      )}
    </div>
  );
}
