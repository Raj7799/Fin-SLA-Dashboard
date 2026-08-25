import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import { formatMinutesToTime, formatDate, formatVariance } from '../../utils/formatters';

export default function LoadEndTimeChart({
  records = [],
  isLoading = false,
  onPointClick
}) {
  // Extract and sort the last 40 executions chronologically to plot completion times
  const chartData = React.useMemo(() => {
    const sorted = [...records]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-40); // Keep last 40 points
    return sorted.map(r => ({
      ...r,
      // X-axis needs a coordinate (numeric or category). We can use a readable short date
      dateDisplay: r.date.substring(5), // "MM-DD"
      // Y-axis: actual end time in minutes
      endTime: r.endTimeMinutes,
      color: r.status === 'Met' ? '#10b981' : '#f43f5e'
    }));
  }, [records]);

  // Custom Y-axis tick formatter
  const formatYAxisTick = (tick) => {
    const hrs = Math.floor(tick / 60);
    const mins = tick % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${displayHrs}:${String(mins).padStart(2, '0')} ${ampm}`;
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-navy-950 border border-brand-navy-700/80 p-3 rounded-lg shadow-xl text-left select-none text-xs">
          <p className="font-bold text-gray-200 mb-1.5">Execution: {data.id}</p>
          <div className="space-y-1 font-medium">
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-400">Date:</span>
              <span className="text-gray-300">{formatDate(data.date)}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-400">Completion Time:</span>
              <span className="text-gray-200 font-bold">{formatMinutesToTime(data.endTimeMinutes)}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-400">SLA Cutoff:</span>
              <span className="text-gray-300">{formatMinutesToTime(data.slaCutoff)}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-400">Variance:</span>
              <span className={`font-bold ${data.varianceMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formatVariance(data.varianceMinutes)}
              </span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-400">Source:</span>
              <span className="text-gray-300">{data.source} ({data.slaRule})</span>
            </p>
          </div>
          {onPointClick && (
            <p className="text-[10px] text-blue-400 font-semibold mt-2 animate-pulse-subtle">
              Click node to view full details
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleScatterClick = (node) => {
    if (node && onPointClick) {
      onPointClick(node);
    }
  };

  return (
    <ChartCard
      title="Daily Load End Time"
      subtitle="Actual completion times vs. cutoff deadlines. (EST timezone)"
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart
          margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="dateDisplay"
            name="Date"
            stroke="#9ca3af"
            tick={{ fontSize: 9, fill: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis
            dataKey="endTime"
            name="End Time"
            stroke="#9ca3af"
            tick={{ fontSize: 9, fill: '#9ca3af' }}
            tickFormatter={formatYAxisTick}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
            domain={[360, 660]} // 6:00 AM (360m) to 11:00 AM (660m)
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#4b5563' }} />
          
          {/* Reference Line for 8:00 AM Cutoff */}
          <ReferenceLine
            y={480}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: '8:00 AM Cutoff',
              fill: '#f43f5e',
              fontSize: 9,
              position: 'top',
              style: { fontWeight: 600 }
            }}
          />

          <Scatter
            name="Executions"
            data={chartData}
            fill="#2563eb"
            onClick={(e) => handleScatterClick(e)}
            className="cursor-pointer"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
