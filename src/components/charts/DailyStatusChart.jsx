import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import { formatDate } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export default function DailyStatusChart({
  records = [],
  isLoading = false,
  onRecordClick
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#9ca3af' : '#475569';
  const borderAxis = isDark ? '#374151' : '#cbd5e1';

  // Take the most recent 50 executions to display as individual bars, sorted chronologically
  const chartData = React.useMemo(() => {
    const sorted = [...records]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-50); // Get latest 50 to avoid overcrowding
    return sorted.map(r => ({
      ...r,
      // Map Met/Missed to a constant height value for uniform bars
      height: 100,
      color: r.status === 'Met' ? '#10b981' : '#f43f5e'
    }));
  }, [records]);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-brand-navy-950 border border-gray-200 dark:border-brand-navy-700/80 p-3 rounded-lg shadow-xl text-left select-none text-xs">
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">ID: {data.id}</p>
          <div className="space-y-1 font-medium">
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">Date:</span>
              <span className="text-gray-800 dark:text-gray-200">{formatDate(data.date)}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">Source:</span>
              <span className="text-gray-800 dark:text-gray-200">{data.source}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">SLA Rule:</span>
              <span className="text-gray-800 dark:text-gray-200">{data.slaRule}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span className={`font-bold ${data.status === 'Met' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {data.status}
              </span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Variance:</span>
              <span className={`font-bold ${data.varianceMinutes > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {data.varianceMinutes > 0 ? `+${data.varianceMinutes}` : data.varianceMinutes} min
              </span>
            </p>
          </div>
          <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold mt-2 animate-pulse-subtle">
            Click bar to inspect execution details
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (state) => {
    if (state && state.activePayload && onRecordClick) {
      const clickedRecord = state.activePayload[0].payload;
      onRecordClick(clickedRecord);
    }
  };

  return (
    <ChartCard
      title="Daily SLA Executions Timeline"
      subtitle={`Chronological strip of the last 50 evaluations. Green = Met, Red = Missed. (Click to inspect)`}
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          onClick={handleBarClick}
          className="cursor-pointer"
        >
          <XAxis
            dataKey="id"
            stroke={textColor}
            tick={{ fontSize: 9, fill: textColor }}
            axisLine={{ stroke: borderAxis }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            hide={true} // Hide YAxis since heights are constant for visual strip
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }} />
          
          <Bar dataKey="height" radius={[3, 3, 3, 3]} maxBarSize={12}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
