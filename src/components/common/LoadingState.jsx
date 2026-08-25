import React from 'react';

export default function LoadingState({
  type = 'table', // 'kpi' | 'chart' | 'table' | 'page'
  className = ''
}) {
  if (type === 'page') {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[50vh] gap-4 ${className}`}>
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-brand-navy-800 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-400 select-none animate-pulse-subtle">
          Loading dashboard environment...
        </p>
      </div>
    );
  }

  if (type === 'kpi') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-brand-navy-900 border border-brand-navy-850 p-5 rounded-xl flex flex-col gap-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-brand-navy-700 rounded"></div>
              <div className="h-6 w-6 bg-brand-navy-700 rounded-lg"></div>
            </div>
            <div className="h-8 w-20 bg-brand-navy-700 rounded"></div>
            <div className="h-2 w-full bg-brand-navy-800 rounded"></div>
            <div className="h-3 w-32 bg-brand-navy-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        {[1, 2].map((i) => (
          <div key={i} className="bg-brand-navy-900 border border-brand-navy-850 p-5 rounded-xl flex flex-col gap-4 min-h-[300px] animate-pulse">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-40 bg-brand-navy-700 rounded"></div>
              <div className="h-3 w-64 bg-brand-navy-700 rounded"></div>
            </div>
            <div className="flex-1 bg-brand-navy-950/40 rounded-lg border border-brand-navy-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-navy-850 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Table skeleton
  return (
    <div className={`w-full bg-brand-navy-900 border border-brand-navy-850 rounded-xl p-5 flex flex-col gap-4 animate-pulse ${className}`}>
      <div className="flex justify-between items-center">
        <div className="h-4 w-48 bg-brand-navy-700 rounded"></div>
        <div className="h-8 w-24 bg-brand-navy-750 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-4 py-2 border-b border-brand-navy-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 bg-brand-navy-700 rounded"></div>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-5 gap-4 py-2">
            {[1, 2, 3, 4, 5].map((col) => (
              <div key={col} className="h-3 bg-brand-navy-800 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
