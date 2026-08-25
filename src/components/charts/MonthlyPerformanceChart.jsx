import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import { formatPercentage } from '../../utils/formatters';

export default function MonthlyPerformanceChart({
  data = [],
  isLoading = false,
  onBarClick
}) {
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      // Shorten month label for readability (e.g. "August 2026" -> "Aug 26")
      displayMonth: item.month.replace(' 2026', " '26")
    }));
  }, [data]);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-navy-950 border border-brand-navy-700/80 p-3 rounded-lg shadow-xl text-left select-none text-xs">
          <p className="font-bold text-gray-200 mb-1.5">{data.month}</p>
          <div className="space-y-1.5 font-medium">
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-400">Total Runs:</span>
              <span className="text-gray-200 font-bold">{data.total}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-emerald-400">SLA Met:</span>
              <span className="text-emerald-400 font-bold">{data.Met}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-rose-400">SLA Missed:</span>
              <span className="text-rose-400 font-bold">{data.Missed}</span>
            </p>
            <div className="border-t border-brand-navy-800 my-1 pt-1 flex justify-between items-center gap-6">
              <span className="text-gray-400 font-semibold">Compliance:</span>
              <span className={`font-bold ${data.compliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatPercentage(data.compliance)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (state) => {
    if (state && state.activePayload && onBarClick) {
      const clickedData = state.activePayload[0].payload;
      onBarClick(clickedData.month);
    }
  };

  return (
    <ChartCard
      title="Monthly SLA Performance"
      subtitle="Execution volume and outcome tracking by month (Click bar to inspect missed runs)"
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          onClick={handleChartClick}
          className="cursor-pointer"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="displayMonth"
            stroke="#9ca3af"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            iconSize={10}
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: '#f3f4f6' }}
          />
          <Bar dataKey="Met" name="SLA Met" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={45} />
          <Bar dataKey="Missed" name="SLA Missed" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
