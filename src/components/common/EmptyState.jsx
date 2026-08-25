import React from 'react';
import { Database } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your filters or search term to see more results.',
  icon: Icon = Database,
  actionText,
  onActionClick,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-navy-700/60 rounded-xl bg-brand-navy-950/10 ${className}`}>
      <div className="p-3 bg-brand-navy-900/80 rounded-xl border border-brand-navy-700/40 text-gray-500 mb-4 shadow-inner">
        <Icon size={24} className="stroke-[1.5]" />
      </div>
      <h4 className="text-base font-semibold text-gray-300 mb-1 select-none">
        {title}
      </h4>
      <p className="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed select-none">
        {description}
      </p>
      {actionText && onActionClick && (
        <Button size="sm" variant="outline" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
