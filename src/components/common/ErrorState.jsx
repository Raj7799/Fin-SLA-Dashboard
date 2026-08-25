import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';
import Button from '../ui/Button';

export default function ErrorState({
  title = 'Unable to load dashboard data',
  description = 'Something went wrong while preparing the dashboard metrics. Please check your data connection or try refreshing the dashboard.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-rose-500/20 rounded-xl bg-rose-500/5 ${className}`}>
      <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 mb-4 shadow-sm">
        <AlertCircle size={24} className="stroke-[1.5]" />
      </div>
      <h4 className="text-base font-semibold text-rose-300 mb-1 select-none">
        {title}
      </h4>
      <p className="text-xs text-gray-400 max-w-sm mb-5 leading-relaxed select-none">
        {description}
      </p>
      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          className="border-rose-500/30 hover:bg-rose-500/10 text-rose-300 hover:text-rose-200"
          icon={<RotateCw size={14} />}
          onClick={onRetry}
        >
          Retry Load
        </Button>
      )}
    </div>
  );
}
