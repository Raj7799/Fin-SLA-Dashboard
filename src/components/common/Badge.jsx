import React from 'react';

export default function Badge({
  children,
  variant = 'gray', // 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'purple'
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wide';
  
  const variants = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/5',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-sm shadow-rose-500/5',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/5',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm shadow-blue-500/5',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-sm shadow-purple-500/5',
    gray: 'bg-brand-navy-700/50 text-gray-400 border-brand-navy-600/50'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
