import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  FolderDot,
  FileSearch2,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

import Button from '../components/ui/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import StatusIndicator from '../components/common/StatusIndicator';

// Charts
import MonthlyPerformanceChart from '../components/charts/MonthlyPerformanceChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import DailyStatusChart from '../components/charts/DailyStatusChart';
import LoadEndTimeChart from '../components/charts/LoadEndTimeChart';

// Utils
import {
  filterRecords,
  calculateMetrics,
  calculateOraclePlanningCompliance,
  calculateCurrentMonthCompliance,
  getMonthlyPerformance
} from '../utils/slaCalculations';
import {
  formatMinutesToTime,
  formatVariance,
  formatDate,
  formatNumber,
  formatPercentage
} from '../utils/formatters';

export default function DashboardPage({
  records = [],
  isLoading = false,
  onRefresh,
  searchQuery,
  setSearchQuery
}) {
  // 1. Local Page State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    startDate: '2026-03-02',
    endDate: '2026-08-14',
    year: 'All',
    subdomain: 'All',
    slaStatus: 'All',
    source: 'All'
  });

  // Unique filter options gathered from records
  const uniqueSubdomains = useMemo(() => ['All', ...new Set(records.map(r => r.subdomain))], [records]);
  const uniqueSources = useMemo(() => ['All', ...new Set(records.map(r => r.source))], [records]);
  
  // Apply filters and search query
  const filteredRecords = useMemo(() => {
    return filterRecords(records, { ...filters, searchQuery });
  }, [records, filters, searchQuery]);

  // Calculate Metrics from filtered records
  const metrics = useMemo(() => calculateMetrics(filteredRecords), [filteredRecords]);
  
  // KPI 3: Current Month Compliance
  const currentMonthCompliance = useMemo(() => calculateCurrentMonthCompliance(filteredRecords), [filteredRecords]);
  
  // KPI 4: Oracle Planning SLA compliance
  const oraclePlanningCompliance = useMemo(() => calculateOraclePlanningCompliance(filteredRecords), [filteredRecords]);

  // Chart Groupings
  const monthlyPerformance = useMemo(() => getMonthlyPerformance(filteredRecords), [filteredRecords]);

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      year: 'All',
      subdomain: 'All',
      slaStatus: 'All',
      source: 'All'
    });
    setSearchQuery('');
  };

  const handleRecordInspect = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-120px)] relative">
      
      {/* ── Left Collapsible Filter Pane ── */}
      {isFilterCollapsed ? (
        /* iPhone Assistive Touch Concentric Circle Floating Button */
        <button 
          onClick={() => setIsFilterCollapsed(false)}
          className="fixed left-4 md:left-[86px] top-[28%] z-45 w-12 h-12 rounded-full bg-gray-500/25 dark:bg-black/35 border-2 border-white/20 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 group"
          title="Show Scope Filters"
        >
          <div className="absolute inset-1.5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/60 dark:bg-white/45 border border-white/30 flex items-center justify-center shadow-md">
              <SlidersHorizontal size={11} className="text-gray-900 dark:text-gray-900 animate-pulse-subtle group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </button>
      ) : (
        /* Fully Expanded Sidebar */
        <aside className="w-full lg:w-[260px] flex-shrink-0 p-5 bg-brand-navy-950/45 backdrop-blur-xl border border-brand-navy-850 rounded-2xl flex flex-col justify-between shadow-2xl relative z-10 self-start">
          <div className="space-y-6">
            
            {/* Title & Toggle */}
            <div className="flex items-center justify-between pb-4.5 border-b border-brand-navy-850 select-none">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={16} className="text-blue-500 animate-pulse-subtle" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Scope filters</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Refine dashboard view</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFilterCollapsed(true)} 
                className="p-1 rounded bg-brand-navy-900 hover:bg-brand-navy-800 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                title="Collapse Filters"
              >
                <ChevronRight className="rotate-180" size={13} />
              </button>
            </div>

            {/* Date range inputs */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 select-none">Date range</span>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full bg-brand-navy-950/80 border border-brand-navy-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
                />
                <span className="text-[10px] text-gray-500 text-center select-none font-bold uppercase">to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-brand-navy-950/80 border border-brand-navy-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
                />
              </div>
            </div>

            {/* Year dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 select-none">Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="w-full bg-brand-navy-950/80 border border-brand-navy-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer transition-all [color-scheme:dark]"
              >
                <option value="All">All</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Subdomain dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 select-none">Subdomain</label>
              <select
                value={filters.subdomain}
                onChange={(e) => setFilters(prev => ({ ...prev, subdomain: e.target.value }))}
                className="w-full bg-brand-navy-950/80 border border-brand-navy-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer transition-all [color-scheme:dark]"
              >
                {uniqueSubdomains.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Data Source dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 select-none">Data Source</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                className="w-full bg-brand-navy-950/80 border border-brand-navy-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer transition-all [color-scheme:dark]"
              >
                {uniqueSources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>

            {/* SLA Status Radio Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 select-none">SLA status</span>
              <div className="space-y-2 bg-brand-navy-950/50 p-3 rounded-lg border border-brand-navy-850">
                {['All', 'Met', 'Missed'].map((status) => (
                  <label key={status} className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-300 font-medium hover:text-white transition-colors">
                    <input
                      type="radio"
                      name="slaStatusRadio"
                      value={status}
                      checked={filters.slaStatus === status}
                      onChange={() => setFilters(prev => ({ ...prev, slaStatus: status }))}
                      className="accent-blue-500 cursor-pointer w-3.5 h-3.5"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>

        {/* Clear Filters Button at the bottom (only in expanded mode) */}
        {!isFilterCollapsed && (
          <div className="pt-4 border-t border-brand-navy-850 mt-6">
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all cursor-pointer shadow-md shadow-rose-950/20"
            >
              <RotateCw size={12} />
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </aside>
      )}

      {/* ── Right Content Area ── */}
      <div className="flex-1 min-w-0 space-y-6">

        {/* 1. KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 select-none">
          
          {/* KPI 1: Total Executions */}
          <div className="bg-brand-navy-950/40 backdrop-blur-md border border-brand-navy-850 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300 card-3d">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Executions</p>
                <h3 className="text-3xl font-black text-white mt-2 font-heading">{formatNumber(metrics.total)}</h3>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-brand-navy-800 text-gray-400 border border-brand-navy-700 tracking-wider">Scope</span>
            </div>
            <div className="mt-5 space-y-2.5">
              <div className="w-full bg-brand-navy-850 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.total > 0 ? (metrics.met / metrics.total) * 100 : 0}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                <span className="text-blue-400 font-bold">{formatNumber(metrics.met)} met</span>
                <span className="mx-1.5 text-gray-600">·</span>
                <span className="text-rose-400 font-bold">{formatNumber(metrics.missed)} missed</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Overall SLA Compliance */}
          <div className="bg-brand-navy-950/40 backdrop-blur-md border border-brand-navy-850 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300 card-3d">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall SLA Compliance</p>
                <h3 className={`text-3xl font-black mt-2 font-heading ${metrics.compliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercentage(metrics.compliance)}
                </h3>
              </div>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider ${
                metrics.compliance >= 95 
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25' 
                  : 'bg-rose-950/40 text-rose-400 border border-rose-500/25'
              }`}>
                {metrics.compliance >= 95 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-5 space-y-2.5">
              <div className="w-full bg-brand-navy-850 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${metrics.compliance >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(metrics.compliance, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                {metrics.compliance >= 95 ? (
                  <span className="text-emerald-400 font-semibold">Target of 95% met</span>
                ) : (
                  <span>Target gap: <span className="text-rose-400 font-bold">-{(95 - metrics.compliance).toFixed(1)} percentage points</span></span>
                )}
              </div>
            </div>
          </div>

          {/* KPI 3: Current Month SLA Compliance */}
          <div className="bg-brand-navy-950/40 backdrop-blur-md border border-brand-navy-850 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300 card-3d">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Month SLA Compliance</p>
                <h3 className={`text-3xl font-black mt-2 font-heading ${
                  currentMonthCompliance >= 95 ? 'text-emerald-400' : currentMonthCompliance >= 92 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {formatPercentage(currentMonthCompliance)}
                </h3>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-brand-navy-800 text-gray-400 border border-brand-navy-700 tracking-wider">Scope</span>
            </div>
            <div className="mt-5 space-y-2.5">
              <div className="w-full bg-brand-navy-850 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentMonthCompliance >= 95 ? 'bg-emerald-500' : currentMonthCompliance >= 92 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(currentMonthCompliance, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                <span>August 2026, month-to-date</span>
              </div>
            </div>
          </div>

          {/* KPI 4: Oracle Planning Data SLA */}
          <div className="bg-brand-navy-950/40 backdrop-blur-md border border-brand-navy-850 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300 card-3d">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Oracle Planning Data SLA</p>
                <h3 className={`text-3xl font-black mt-2 font-heading ${oraclePlanningCompliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercentage(oraclePlanningCompliance)}
                </h3>
              </div>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider ${
                oraclePlanningCompliance >= 95 
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25' 
                  : 'bg-rose-950/40 text-rose-400 border border-rose-500/25'
              }`}>
                {oraclePlanningCompliance >= 95 ? 'On target' : 'Below target'}
              </span>
            </div>
            <div className="mt-5 space-y-2.5">
              <div className="w-full bg-brand-navy-850 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${oraclePlanningCompliance >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(oraclePlanningCompliance, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                <span>Day 1 and WD1–WD3 rules</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2. SLA Performance Charts Workspace */}
        <div className="space-y-6">
          
          {/* Monthly Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MonthlyPerformanceChart
              data={monthlyPerformance}
              isLoading={isLoading}
            />
            <MonthlyTrendChart
              data={monthlyPerformance}
              isLoading={isLoading}
            />
          </div>
          
          {/* Daily Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DailyStatusChart
              records={filteredRecords}
              isLoading={isLoading}
              onRecordClick={handleRecordInspect}
            />
            <LoadEndTimeChart
              records={filteredRecords}
              isLoading={isLoading}
              onPointClick={handleRecordInspect}
            />
          </div>

        </div>

      </div>

      {/* ── 3. Execution Detail Inspector Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Execution Details — ${selectedRecord?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            
            {/* Status indicator banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between select-none ${
              selectedRecord.status === 'Met'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <div className="flex items-center gap-2">
                <StatusIndicator status={selectedRecord.status} />
                <span className="text-sm font-bold">Execution SLA {selectedRecord.status}</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-85">
                Variance: {formatVariance(selectedRecord.varianceMinutes)}
              </span>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Execution ID</p>
                <p className="text-gray-200 font-bold font-mono">{selectedRecord.id}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Execution Date</p>
                <p className="text-gray-200 font-bold">{formatDate(selectedRecord.date)}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Data Source</p>
                <p className="text-gray-200 font-bold">{selectedRecord.source}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Subdomain</p>
                <p className="text-gray-200 font-bold">{selectedRecord.subdomain}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Load Type</p>
                <p className="text-gray-200 font-bold">{selectedRecord.loadType}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">SLA Evaluation Rule</p>
                <p className="text-gray-200 font-bold">{selectedRecord.slaRule}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Target Cutoff Deadline</p>
                <p className="text-gray-200 font-bold">{formatMinutesToTime(selectedRecord.slaCutoff, true)}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Actual Completion Time</p>
                <p className="text-gray-200 font-bold">{formatMinutesToTime(selectedRecord.endTimeMinutes, true)}</p>
              </div>
            </div>

            {/* Diagnostics section (only for missed SLAs) */}
            {selectedRecord.status === 'Missed' && (
              <div className="pt-4 border-t border-brand-navy-800">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Root Cause Diagnosis</h4>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Issue Category</p>
                    <Badge variant={selectedRecord.issueCategory === 'Pending Review' ? 'amber' : 'red'}>
                      {selectedRecord.issueCategory || 'Pending Review'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Execution Layer</p>
                    <Badge variant="blue">{selectedRecord.executionLayer || 'Unassigned'}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Responsible Team</p>
                    <span className="text-gray-200 font-bold">{selectedRecord.responsibleTeam || 'Unassigned'}</span>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">RCA Incident Status</p>
                    <Badge variant={selectedRecord.rcaStatus === 'Completed' ? 'green' : 'amber'}>
                      {selectedRecord.rcaStatus || 'Not Started'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Operational Resolution Status</p>
                    <Badge variant={selectedRecord.solutionStatus === 'Permanent Fix' ? 'green' : 'purple'}>
                      {selectedRecord.solutionStatus || 'Investigating'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            
            {/* Modal footer */}
            <div className="flex justify-end pt-4 border-t border-brand-navy-800">
              <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Dismiss Inspector
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
