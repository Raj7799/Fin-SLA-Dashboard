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
import { useTheme } from '../../context/ThemeContext';

export default function MonthlyPerformanceChart({
  data = [],
  isLoading = false,
  onBarClick
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#1f2937' : '#e2e8f0';
  const textColor = isDark ? '#9ca3af' : '#475569';
  const borderAxis = isDark ? '#374151' : '#cbd5e1';

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
        <div className="bg-white dark:bg-brand-navy-950 border border-gray-200 dark:border-brand-navy-700/80 p-3 rounded-lg shadow-xl text-left select-none text-xs">
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-1.5">{data.month}</p>
          <div className="space-y-1.5 font-medium">
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">Total Runs:</span>
              <span className="text-gray-800 dark:text-gray-200 font-bold">{data.total}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-emerald-500 dark:text-emerald-400">SLA Met:</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-bold">{data.Met}</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-rose-500 dark:text-rose-400">SLA Missed:</span>
              <span className="text-rose-500 dark:text-rose-400 font-bold">{data.Missed}</span>
            </p>
            <div className="border-t border-gray-200 dark:border-brand-navy-800 my-1 pt-1 flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Compliance:</span>
              <span className={`font-bold ${data.compliance >= 95 ? 'text-emerald-500' : 'text-rose-500'}`}>
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
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="displayMonth"
            stroke={textColor}
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={{ stroke: borderAxis }}
            tickLine={{ stroke: borderAxis }}
          />
          <YAxis
            stroke={textColor}
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={{ stroke: borderAxis }}
            tickLine={{ stroke: borderAxis }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            iconSize={10}
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: textColor }}
          />
          <Bar dataKey="Met" name="SLA Met" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={45} />
          <Bar dataKey="Missed" name="SLA Missed" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
