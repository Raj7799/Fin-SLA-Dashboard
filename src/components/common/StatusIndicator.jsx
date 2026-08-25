import React from 'react';

export default function StatusIndicator({
  status, // 'Met' | 'Missed' | 'Warning' | 'Info'
  label,
  className = ''
}) {
  const configs = {
    Met: { color: 'bg-emerald-500 shadow-emerald-500/35', text: 'Met' },
    Missed: { color: 'bg-rose-500 shadow-rose-500/35', text: 'Missed' },
    Warning: { color: 'bg-amber-500 shadow-amber-500/35', text: 'Warning' },
    Info: { color: 'bg-blue-500 shadow-blue-500/35', text: 'Info' }
  };

  const config = configs[status] || configs.Info;
  const displayText = label || config.text;

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className={`h-2 w-2 rounded-full shadow-sm animate-pulse-subtle ${config.color}`} />
      <span className="text-xs font-semibold text-gray-300 tracking-wide">{displayText}</span>
    </div>
  );
}
