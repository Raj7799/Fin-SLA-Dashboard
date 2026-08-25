import React, { useMemo } from 'react';
import MonthlyPerformanceChart from '../components/charts/MonthlyPerformanceChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import LoadEndTimeChart from '../components/charts/LoadEndTimeChart';

import Badge from '../components/common/Badge';
import { getMonthlyPerformance } from '../utils/slaCalculations';
import { formatPercentage, formatNumber } from '../utils/formatters';

export default function SlaPerformancePage({
  records = [],
  isLoading = false
}) {
  const monthlyPerformance = useMemo(() => getMonthlyPerformance(records), [records]);

  // Aggregate stats
  const performanceStats = useMemo(() => {
    const total = records.length;
    const met = records.filter(r => r.status === 'Met').length;
    const missed = total - met;
    const avgCompliance = total > 0 ? (met / total) * 105 : 0; // scaled
    
    // Find best and worst months
    if (monthlyPerformance.length === 0) {
      return { total, met, missed, compliance: 0, bestMonth: 'N/A', worstMonth: 'N/A' };
    }
    const sorted = [...monthlyPerformance].sort((a, b) => b.compliance - a.compliance);
    return {
      total,
      met,
      missed,
      compliance: total > 0 ? (met / total) * 100 : 0,
      bestMonth: `${sorted[0].month} (${formatPercentage(sorted[0].compliance)})`,
      worstMonth: `${sorted[sorted.length - 1].month} (${formatPercentage(sorted[sorted.length - 1].compliance)})`
    };
  }, [records, monthlyPerformance]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-brand-navy-800 pb-5 select-none">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Historical Intelligence</span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 font-heading">Historical Performance Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">Audit execution performance, trends, and timezone metrics across multiple periods.</p>
      </div>

      {/* Comparative KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
        <div className="bg-brand-navy-950/20 border border-brand-navy-850 p-5 rounded-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average SLA Compliance</p>
          <h3 className={`text-2xl font-black mt-2 font-heading ${performanceStats.compliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(performanceStats.compliance)}
          </h3>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">Weighted average across March to August 2026</p>
        </div>

        <div className="bg-brand-navy-950/20 border border-brand-navy-850 p-5 rounded-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Performing Period</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-2.5 font-heading truncate">{performanceStats.bestMonth}</h3>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">Highest met SLA execution ratio</p>
        </div>

        <div className="bg-brand-navy-950/20 border border-brand-navy-850 p-5 rounded-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lowest Performing Period</p>
          <h3 className="text-xl font-bold text-rose-400 mt-2.5 font-heading truncate">{performanceStats.worstMonth}</h3>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">Needs operational workflow improvements</p>
        </div>
      </div>

      {/* Main Historical Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyPerformanceChart
          data={monthlyPerformance}
          isLoading={isLoading}
        />
        <MonthlyTrendChart
          data={monthlyPerformance}
          isLoading={isLoading}
        />
      </div>

      {/* Scatter plot timeline */}
      <div>
        <LoadEndTimeChart
          records={records}
          isLoading={isLoading}
        />
      </div>

    </div>
  );
}
