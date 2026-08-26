import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No chart data available for the selected filters.',
  className = '',
  headerAction
}) {
  return (
    <div className={`bg-white/65 dark:bg-[#0b0f19]/45 border border-gray-200/60 dark:border-brand-navy-850 p-5 rounded-2xl shadow-md backdrop-blur-md flex flex-col min-h-[350px] transition-all duration-300 hover:shadow-lg hover:border-blue-500/20 dark:hover:border-blue-500/10 ${className}`}>
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-5 select-none">
        <div>
          <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 tracking-wide uppercase font-heading">{title}</h3>
          {subtitle && <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Body Area */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg className="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">Recalculating dataset...</span>
          </div>
        ) : isEmpty ? (
          <div className="text-center p-6 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full border border-dashed border-brand-navy-700 flex items-center justify-center text-gray-500 mb-3 shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 max-w-xs">{emptyMessage}</p>
          </div>
        ) : (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
