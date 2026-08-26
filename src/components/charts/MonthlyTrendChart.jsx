import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import { formatPercentage } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export default function MonthlyTrendChart({
  data = [],
  isLoading = false
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#1f2937' : '#e2e8f0';
  const textColor = isDark ? '#9ca3af' : '#475569';
  const borderAxis = isDark ? '#374151' : '#cbd5e1';

  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      displayMonth: item.month.replace(' 2026', " '26")
    }));
  }, [data]);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const targetGap = data.compliance - 95;
      const gapSign = targetGap >= 0 ? '+' : '';
      
      return (
        <div className="bg-white dark:bg-brand-navy-950 border border-gray-200 dark:border-brand-navy-700/80 p-3 rounded-lg shadow-xl text-left select-none text-xs">
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-1.5">{data.month}</p>
          <div className="space-y-1 font-medium">
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">SLA Compliance:</span>
              <span className={`font-bold ${data.compliance >= 95 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatPercentage(data.compliance)}
              </span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">Target Threshold:</span>
              <span className="text-gray-700 dark:text-gray-300 font-bold">95.0%</span>
            </p>
            <p className="flex justify-between items-center gap-6">
              <span className="text-gray-500 dark:text-gray-400">Target Gap:</span>
              <span className={`font-bold ${targetGap >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {gapSign}{targetGap.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom dot rendering based on compliance threshold
  const RenderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;
    const isMet = payload.compliance >= 95;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={isMet ? '#10b981' : '#f43f5e'}
        stroke={isDark ? '#0b0f19' : '#ffffff'}
        strokeWidth={1.5}
        className="transition-transform duration-200 hover:scale-125 cursor-pointer"
      />
    );
  };

  return (
    <ChartCard
      title="Monthly SLA Trend"
      subtitle="SLA compliance trajectory vs. 95.0% target"
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
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
            domain={[85, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Target Reference Line */}
          <ReferenceLine
            y={95}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{
              value: '95% SLA Target',
              fill: '#f59e0b',
              fontSize: 10,
              position: 'top',
              style: { fontWeight: 600, letterSpacing: '0.05em' }
            }}
          />
          
          <Line
            type="monotone"
            dataKey="compliance"
            name="SLA Compliance"
            stroke="#2563eb"
            strokeWidth={3}
            dot={<RenderCustomDot />}
            activeDot={{ r: 7, strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
