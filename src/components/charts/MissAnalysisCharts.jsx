import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line
} from 'recharts';
import ChartCard from './ChartCard';
import { useTheme } from '../../context/ThemeContext';

export default function MissAnalysisCharts({
  filteredRecords = [],
  isLoading = false,
  onCategoryFilter
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Theme aware color variables for charts
  const gridColor = isDark ? '#1f2937' : '#e2e8f0';
  const textColor = isDark ? '#9ca3af' : '#475569';
  const borderAxis = isDark ? '#374151' : '#cbd5e1';

  // Filter for missed records
  const missedRecords = useMemo(() => {
    return filteredRecords.filter(r => r.status === 'Missed');
  }, [filteredRecords]);

  // Compute groupings and counts reactive to filtered records
  const chartData = useMemo(() => {
    const byCategory = {};
    const byLayer = {};
    const byTeam = {};
    const bySolution = {};
    const byRca = { 'Yes': 0, 'No': 0 };

    // Metal layers mapping to align with screenshots
    const layerNames = {
      'Ingestion': 'Bronze',
      'Transformation': 'Gold',
      'Reporting': 'Silver',
      'Unassigned': 'Pending'
    };

    missedRecords.forEach(r => {
      const cat = r.issueCategory || 'Pending Review';
      const layRaw = r.executionLayer || 'Unassigned';
      const lay = layerNames[layRaw] || layRaw;
      const team = r.responsibleTeam || 'Unassigned';
      const sol = r.solutionStatus || 'Investigating';
      const rca = r.rcaStatus === 'Completed' ? 'Yes' : 'No';

      byCategory[cat] = (byCategory[cat] || 0) + 1;
      byLayer[lay] = (byLayer[lay] || 0) + 1;
      byTeam[team] = (byTeam[team] || 0) + 1;
      bySolution[sol] = (bySolution[sol] || 0) + 1;
      byRca[rca]++;
    });

    const toSortedArray = (obj) => {
      return Object.entries(obj).map(([name, value]) => ({ name, value }));
    };

    return {
      byCategory: toSortedArray(byCategory),
      byLayer: toSortedArray(byLayer),
      byTeam: toSortedArray(byTeam),
      bySolution: toSortedArray(bySolution),
      byRca: toSortedArray(byRca)
    };
  }, [missedRecords]);

  // Color Palettes matching the screenshots
  const colorsCategory = ['#f43f5e', '#ef4444', '#f43f5e', '#fda4af'];
  const colorsLayer = ['#d97706', '#94a3b8', '#b45309', '#475569']; // Gold, Silver, Bronze, Pending
  const colorsTeam = ['#2563eb', '#1d4ed8', '#1e40af', '#3b82f6'];
  const colorsSolution = ['#10b981', '#d97706', '#8b5cf6', '#6b7280']; // Green for Fixed, Orange/Amber for Workaround
  const colorsRca = ['#10b981', '#f43f5e']; // Yes (Green), No (Red)

  // 1. Render Horizontal Bar Charts (Issue Category, Responsible Team)
  const renderHorizontalBarChart = (data, dimension, title, subtitle, fillColors) => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
          <div className="bg-white dark:bg-brand-navy-950 border border-gray-200 dark:border-brand-navy-700/80 p-2.5 rounded-lg shadow-xl text-left select-none text-xs">
            <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{item.name}</p>
            <p className="font-medium text-rose-500 dark:text-rose-400">
              SLA Misses: <span className="font-extrabold">{item.value}</span>
            </p>
            <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold mt-1 animate-pulse-subtle">
              Click bar to filter details
            </p>
          </div>
        );
      }
      return null;
    };

    const handleBarClick = (state) => {
      if (state && state.activePayload && onCategoryFilter) {
        const clickedData = state.activePayload[0].payload;
        // Map back 'Gold/Silver/Bronze' to technical layer key if filtering by layer
        let filterValue = clickedData.name;
        if (dimension === 'executionLayer') {
          const revMap = { 'Bronze': 'Ingestion', 'Gold': 'Transformation', 'Silver': 'Reporting', 'Pending': 'Unassigned' };
          filterValue = revMap[clickedData.name] || clickedData.name;
        }
        onCategoryFilter(dimension, filterValue);
      }
    };

    return (
      <ChartCard
        title={title}
        subtitle={subtitle}
        isLoading={isLoading}
        isEmpty={sortedData.length === 0}
        emptyMessage="No SLA misses logged in this scope."
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
            onClick={handleBarClick}
            className="cursor-pointer"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              stroke={textColor}
              tick={{ fontSize: 9, fill: textColor }}
              axisLine={{ stroke: borderAxis }}
              tickLine={{ stroke: borderAxis }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={textColor}
              tick={{ fontSize: 9, fill: textColor }}
              axisLine={{ stroke: borderAxis }}
              tickLine={{ stroke: borderAxis }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(244, 63, 94, 0.02)' : 'rgba(0, 0, 0, 0.01)' }} />
            <Bar dataKey="value" name="Misses" radius={[0, 4, 4, 0]} maxBarSize={16}>
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

  // 2. Render Doughnut/Pie Charts (Execution Layer, Solution Status, RCA Status)
  const renderDoughnutChart = (data, title, subtitle, fillColors) => {
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
          <div className="bg-white dark:bg-brand-navy-950 border border-gray-200 dark:border-brand-navy-700/80 p-2 rounded-lg shadow-xl text-left text-xs select-none">
            <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              Count: <span className="font-black">{item.value}</span>
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <ChartCard
        title={title}
        subtitle={subtitle}
        isLoading={isLoading}
        isEmpty={data.length === 0}
        emptyMessage="No diagnostic data available."
      >
        <ResponsiveContainer width="100%" height={220}>
          <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Pie
              data={data}
              cx="50%"
              cy="42%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={fillColors[index % fillColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 9, color: textColor, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    );
  };

  // 3. Render cross-tabulation density matrix table
  const renderMatrixGrid = () => {
    const categories = ['Code Issue', 'CTM Platform Issue', 'Pending Review'];
    const layers = ['Bronze', 'Gold', 'Silver', 'Pending'];

    // Grouping
    const matrix = {};
    categories.forEach(cat => {
      matrix[cat] = {};
      layers.forEach(lay => {
        matrix[cat][lay] = 0;
      });
    });

    const layerNames = {
      'Ingestion': 'Bronze',
      'Transformation': 'Gold',
      'Reporting': 'Silver',
      'Unassigned': 'Pending'
    };

    missedRecords.forEach(r => {
      // Normalizing categories to match screenshot labels
      let cat = r.issueCategory || 'Pending Review';
      if (cat === 'Code Bug') cat = 'Code Issue';
      
      const layRaw = r.executionLayer || 'Unassigned';
      const lay = layerNames[layRaw] || layRaw;

      if (matrix[cat] && matrix[cat][lay] !== undefined) {
        matrix[cat][lay]++;
      }
    });

    let maxCount = 1;
    categories.forEach(cat => {
      layers.forEach(lay => {
        if (matrix[cat][lay] > maxCount) maxCount = matrix[cat][lay];
      });
    });

    return (
      <ChartCard
        title="Issue Category by Execution Layer"
        subtitle="Incident heat-map matrix by software layer"
        isLoading={isLoading}
        isEmpty={missedRecords.length === 0}
      >
        <div className="overflow-x-auto w-full pt-1.5 select-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-brand-navy-850">
                <th className="py-2.5 px-3 text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase text-[9px]">Category</th>
                {layers.map(l => (
                  <th key={l} className="py-2.5 px-2 text-gray-500 dark:text-gray-400 font-semibold text-center tracking-wider text-[9px]">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat} className="border-b border-gray-100 dark:border-brand-navy-850/50 hover:bg-gray-100/30 dark:hover:bg-brand-navy-900/20 transition-colors">
                  <td className="py-3 px-3 font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[125px]" title={cat}>{cat}</td>
                  {layers.map(lay => {
                    const count = matrix[cat][lay];
                    const ratio = count / maxCount;
                    // Blue-density background shade proportional to count
                    const bgStyle = count > 0 
                      ? { backgroundColor: `rgba(37, 99, 235, ${0.15 + ratio * 0.72})`, color: '#ffffff' }
                      : { color: isDark ? '#4b5563' : '#cbd5e1' };
                    return (
                      <td key={lay} className="p-1 text-center">
                        <div 
                          className="mx-auto w-9 h-7 rounded flex items-center justify-center font-bold text-[10px] transition-all"
                          style={bgStyle}
                        >
                          {count}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    );
  };

  // 4. Render Monthly Line Trend chart
  const renderMonthlyTrendChart = () => {
    // Unique months in sorted order
    const months = ['March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026'];
    const categories = ['Code Issue', 'CTM Platform Issue', 'Pending Review'];

    const trendMap = {};
    months.forEach(m => {
      trendMap[m] = { month: m.split(' ')[0] }; // March 2026 -> March
      categories.forEach(cat => {
        trendMap[m][cat] = 0;
      });
    });

    missedRecords.forEach(r => {
      const d = new Date(r.date);
      const mName = d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      
      let cat = r.issueCategory || 'Pending Review';
      if (cat === 'Code Bug') cat = 'Code Issue';

      if (trendMap[mName] && trendMap[mName][cat] !== undefined) {
        trendMap[mName][cat]++;
      }
    });

    const data = Object.values(trendMap);
    const trendColors = ['#f43f5e', '#3b82f6', '#f59e0b'];

    return (
      <ChartCard
        title="Monthly Trend by Issue Category"
        subtitle="Monthly frequency of missed runs by RCA categories"
        isLoading={isLoading}
        isEmpty={missedRecords.length === 0}
      >
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={data} margin={{ top: 15, right: 20, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke={textColor} tick={{ fontSize: 9, fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fontSize: 9, fill: textColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ 
                background: isDark ? '#05070c' : '#ffffff', 
                borderColor: isDark ? '#1f2937' : '#e2e8f0', 
                color: isDark ? '#f3f4f6' : '#1f2937',
                borderRadius: '8px', 
                fontSize: 11 
              }}
              itemStyle={{ fontSize: 11 }}
            />
            <Legend
              iconType="line"
              wrapperStyle={{ fontSize: 9, color: textColor, paddingTop: 10 }}
            />
            {categories.map((cat, idx) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={trendColors[idx]}
                strokeWidth={2}
                dot={{ r: 3.5 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Row 1: Horizontal Bar, Doughnut, Horizontal Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {renderHorizontalBarChart(
          chartData.byCategory,
          'issueCategory',
          'SLA Misses by Issue Category',
          'Categorized by root-cause issues (Click to filter)',
          colorsCategory
        )}

        {renderDoughnutChart(
          chartData.byLayer,
          'Execution Layer Where Issues Occurred',
          'Analytic breakdown by infrastructure layer',
          colorsLayer
        )}

        {renderHorizontalBarChart(
          chartData.byTeam,
          'responsibleTeam',
          'SLA Misses by Responsible Team',
          'Attributed by operational ownership (Click to filter)',
          colorsTeam
        )}

      </div>

      {/* Row 2: Doughnut, Doughnut, Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {renderDoughnutChart(
          chartData.bySolution,
          'Solution Status',
          'Resolution progress of missed SLA actions',
          colorsSolution
        )}

        {renderDoughnutChart(
          chartData.byRca,
          'RCA Provided Status',
          'Completion state of Root Cause Analysis',
          colorsRca
        )}

        {renderMatrixGrid()}

      </div>

      {/* Row 3: Line Chart */}
      <div className="grid grid-cols-1 gap-6">
        {renderMonthlyTrendChart()}
      </div>

    </div>
  );
}
