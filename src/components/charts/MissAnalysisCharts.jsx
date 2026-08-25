import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';

export default function MissAnalysisCharts({
  analysisData = {},
  isLoading = false,
  onCategoryFilter // Callback when user clicks a category (dimension, name)
}) {
  const { byCategory = [], byLayer = [], byTeam = [] } = analysisData;

  // Render a single vertical/horizontal bar chart
  const renderHorizontalBarChart = (data, dimension, title, subtitle, fillColors) => {
    // Sort data from highest to lowest misses
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Custom Tooltip component
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
          <div className="bg-brand-navy-950 border border-brand-navy-700/80 p-2.5 rounded-lg shadow-xl text-left select-none text-xs">
            <p className="font-bold text-gray-200 mb-1">{item.name}</p>
            <p className="font-medium text-rose-400">
              SLA Misses: <span className="font-extrabold">{item.value}</span>
            </p>
            <p className="text-[10px] text-blue-400 font-semibold mt-1.5 animate-pulse-subtle">
              Click bar to filter exceptions
            </p>
          </div>
        );
      }
      return null;
    };

    const handleBarClick = (state) => {
      if (state && state.activePayload && onCategoryFilter) {
        const clickedData = state.activePayload[0].payload;
        onCategoryFilter(dimension, clickedData.name);
      }
    };

    return (
      <ChartCard
        title={title}
        subtitle={subtitle}
        isLoading={isLoading}
        isEmpty={sortedData.length === 0}
        emptyMessage="No SLA misses recorded for this selection."
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
            onClick={handleBarClick}
            className="cursor-pointer"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
            <XAxis
              type="number"
              stroke="#9ca3af"
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
              width={85}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.03)' }} />
            
            <Bar dataKey="value" name="Misses" radius={[0, 4, 4, 0]} maxBarSize={18}>
              {sortedData.map((entry, index) => {
                const color = fillColors[index % fillColors.length];
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    );
  };

  // Color Palettes
  const colorsCategory = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6'];
  const colorsLayer = ['#3b82f6', '#06b6d4', '#14b8a6'];
  const colorsTeam = ['#f59e0b', '#f97316', '#ef4444', '#84cc16'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Misses by Issue Category */}
      {renderHorizontalBarChart(
        byCategory,
        'issueCategory',
        'Misses by Issue Category',
        'Distribution of exceptions by category (Click to filter)',
        colorsCategory
      )}

      {/* 2. Misses by Execution Layer */}
      {renderHorizontalBarChart(
        byLayer,
        'executionLayer',
        'Misses by Execution Layer',
        'Incidents categorized by software layer (Click to filter)',
        colorsLayer
      )}

      {/* 3. Misses by Responsible Team */}
      {renderHorizontalBarChart(
        byTeam,
        'responsibleTeam',
        'Misses by Responsible Team',
        'Attribution of SLA misses by team (Click to filter)',
        colorsTeam
      )}

    </div>
  );
}
