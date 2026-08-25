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
  X
} from 'lucide-react';

import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import DatePicker from '../components/ui/DatePicker';
import DataTable from '../components/ui/DataTable';

import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import StatusIndicator from '../components/common/StatusIndicator';

// Charts
import MonthlyPerformanceChart from '../components/charts/MonthlyPerformanceChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import DailyStatusChart from '../components/charts/DailyStatusChart';
import LoadEndTimeChart from '../components/charts/LoadEndTimeChart';
import MissAnalysisCharts from '../components/charts/MissAnalysisCharts';

// Utils
import {
  filterRecords,
  calculateMetrics,
  calculateOraclePlanningCompliance,
  calculateCurrentMonthCompliance,
  getMonthlyPerformance,
  getMissAnalysis,
  getDailyStatusTrend
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
  const [activeTab, setActiveTab] = useState('sla-details'); // 'sla-details' | 'miss-analysis' | 'miss-reasons'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
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
  
  // KPI 3: Current Month Compliance (calculated from all records to stay consistent with target, or filtered)
  const currentMonthCompliance = useMemo(() => calculateCurrentMonthCompliance(filteredRecords), [filteredRecords]);
  
  // KPI 4: Oracle Planning SLA compliance
  const oraclePlanningCompliance = useMemo(() => calculateOraclePlanningCompliance(filteredRecords), [filteredRecords]);

  // Chart Groupings
  const monthlyPerformance = useMemo(() => getMonthlyPerformance(filteredRecords), [filteredRecords]);
  const missAnalysis = useMemo(() => getMissAnalysis(filteredRecords), [filteredRecords]);

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

  // Switch tab and apply category filter if clicked from diagnostic charts
  const handleCategoryFilter = (dimension, categoryValue) => {
    setFilters(prev => ({
      ...prev,
      [dimension]: categoryValue,
      slaStatus: 'Missed' // Looking at missed records
    }));
    setActiveTab('miss-reasons');
  };

  // Table Columns Definition
  const columns = [
    { header: 'Execution ID', accessor: 'id', sortable: true, render: (row) => (
        <span className="font-mono text-blue-400 group-hover:underline">{row.id}</span>
      )
    },
    { header: 'Date', accessor: 'date', sortable: true, render: (row) => formatDate(row.date, true) },
    { header: 'Source', accessor: 'source', sortable: true },
    { header: 'SLA Rule', accessor: 'slaRule', sortable: true },
    { header: 'Status', accessor: 'status', sortable: true, render: (row) => (
        <Badge variant={row.status === 'Met' ? 'green' : 'red'}>{row.status}</Badge>
      )
    },
    { header: 'Variance', accessor: 'varianceMinutes', sortable: true, render: (row) => (
        <span className={`font-semibold ${row.varianceMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          {formatVariance(row.varianceMinutes)}
        </span>
      )
    },
    { header: 'Category', accessor: 'issueCategory', sortable: true, render: (row) => (
        row.issueCategory ? <Badge variant="amber">{row.issueCategory}</Badge> : <span className="text-gray-600">—</span>
      )
    },
    { header: 'Responsible Team', accessor: 'responsibleTeam', sortable: true, render: (row) => (
        row.responsibleTeam ? <span className="text-xs font-semibold text-gray-400">{row.responsibleTeam}</span> : <span className="text-gray-600">—</span>
      )
    },
    { header: 'Solution Status', accessor: 'solutionStatus', sortable: true, render: (row) => (
        row.solutionStatus ? (
          <Badge variant={row.solutionStatus === 'Permanent Fix' ? 'green' : 'purple'}>
            {row.solutionStatus}
          </Badge>
        ) : <span className="text-gray-600">—</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Pane */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-navy-800/80 pb-5 select-none">
        <div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Performance Intelligence</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1 font-heading">
            Compliance Performance Control
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Displaying metrics for <span className="text-gray-300 font-semibold">{filteredRecords.length}</span> eligible records in current scope.
          </p>
        </div>
        
        {/* Date scope tracker */}
        <div className="flex items-center gap-3">
          <Badge variant="blue" className="py-1">Active Scope: {filters.year === 'All' ? 'All Years' : filters.year}</Badge>
          <Button size="sm" variant="outline" onClick={onRefresh} isLoading={isLoading} icon={<RotateCw size={12} />}>
            Force Recalculate
          </Button>
        </div>
      </div>

      {/* 2. Advanced Filter Panel */}
      <div className="bg-brand-navy-950/20 border border-brand-navy-850 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-navy-850 pb-2.5 select-none">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
            <SlidersHorizontal size={14} className="text-blue-500" />
            <span>Dashboard Scoping Filters</span>
          </div>
          {(filters.startDate || filters.endDate || filters.year !== 'All' || filters.subdomain !== 'All' || filters.slaStatus !== 'All' || filters.source !== 'All' || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X size={12} />
              <span>Clear Filter Scope</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <DatePicker
            label="Start Date"
            id="start-date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          />
          
          <DatePicker
            label="End Date"
            id="end-date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
          />
          
          <Select
            label="Reporting Year"
            id="filter-year"
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            options={['All', '2026']}
          />
          
          <Select
            label="Subdomain"
            id="filter-subdomain"
            value={filters.subdomain}
            onChange={(e) => setFilters(prev => ({ ...prev, subdomain: e.target.value }))}
            options={uniqueSubdomains}
          />
          
          <Select
            label="SLA Compliance"
            id="filter-status"
            value={filters.slaStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, slaStatus: e.target.value }))}
            options={[{ value: 'All', label: 'All Executions' }, { value: 'Met', label: 'SLA Met' }, { value: 'Missed', label: 'SLA Missed' }]}
          />
          
          <Select
            label="Data Source"
            id="filter-source"
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            options={uniqueSources}
          />
        </div>
      </div>

      {/* 3. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Executions */}
        <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-5 rounded-xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Executions</p>
              <h3 className="text-2xl font-black text-white mt-2 font-heading">{formatNumber(metrics.total)}</h3>
            </div>
            <div className="p-2 bg-blue-600/10 rounded-lg text-blue-400 border border-blue-500/10">
              <FolderDot size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-navy-850/80 flex items-center justify-between text-xs select-none">
            <span className="text-emerald-400 font-bold">{formatNumber(metrics.met)} Met</span>
            <span className="text-gray-500">|</span>
            <span className="text-rose-400 font-bold">{formatNumber(metrics.missed)} Missed</span>
          </div>
        </div>

        {/* KPI 2: Overall Compliance */}
        <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-5 rounded-xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall Compliance</p>
              <h3 className={`text-2xl font-black mt-2 font-heading ${metrics.compliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatPercentage(metrics.compliance)}
              </h3>
            </div>
            <Badge variant={metrics.compliance >= 95 ? 'green' : 'red'}>
              {metrics.compliance >= 95 ? 'On Target' : 'Below Target'}
            </Badge>
          </div>
          <div className="mt-4 space-y-2">
            {/* Progress bar */}
            <div className="w-full bg-brand-navy-850 h-2 rounded-full relative">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${metrics.compliance >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(metrics.compliance, 100)}%` }}
              />
              {/* Target 95% marker */}
              <div className="absolute top-0 bottom-0 left-[95%] w-0.5 bg-amber-500/80" title="95% Target threshold" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 select-none">
              <span>SLA Target: 95%</span>
              <span className="font-semibold">{metrics.compliance >= 95 ? 'Met target' : 'Gap: -' + (95 - metrics.compliance).toFixed(1) + '%'}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Current Month Compliance */}
        <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-5 rounded-xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Month Compliance</p>
              <h3 className={`text-2xl font-black mt-2 font-heading ${
                currentMonthCompliance >= 95 ? 'text-emerald-400' : currentMonthCompliance >= 92 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {formatPercentage(currentMonthCompliance)}
              </h3>
            </div>
            <Badge variant={currentMonthCompliance >= 95 ? 'green' : currentMonthCompliance >= 92 ? 'amber' : 'red'}>
              {currentMonthCompliance >= 95 ? 'Healthy' : currentMonthCompliance >= 92 ? 'Warning' : 'Critical'}
            </Badge>
          </div>
          <div className="mt-4 space-y-2">
            {/* Progress bar */}
            <div className="w-full bg-brand-navy-850 h-2 rounded-full relative">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentMonthCompliance >= 95 ? 'bg-emerald-500' : currentMonthCompliance >= 92 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(currentMonthCompliance, 100)}%` }}
              />
              <div className="absolute top-0 bottom-0 left-[95%] w-0.5 bg-amber-500/80" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 select-none">
              <span>Month-to-Date (Aug)</span>
              <span>Target: 95%</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Oracle Planning SLA */}
        <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-5 rounded-xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-brand-navy-700/60 transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Oracle Planning SLA</p>
              <h3 className={`text-2xl font-black mt-2 font-heading ${oraclePlanningCompliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatPercentage(oraclePlanningCompliance)}
              </h3>
            </div>
            <Badge variant={oraclePlanningCompliance >= 95 ? 'green' : 'red'}>
              {oraclePlanningCompliance >= 95 ? 'On Target' : 'Below Target'}
            </Badge>
          </div>
          <div className="mt-4 space-y-2">
            <div className="w-full bg-brand-navy-850 h-2 rounded-full relative">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${oraclePlanningCompliance >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(oraclePlanningCompliance, 100)}%` }}
              />
              <div className="absolute top-0 bottom-0 left-[95%] w-0.5 bg-amber-500/80" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 select-none">
              <span className="truncate">Day 1 & WD1–WD3 rules</span>
              <span>Target: 95%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Segmented Control Sub-navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-brand-navy-950/40 p-2 border border-brand-navy-850 rounded-xl select-none">
        
        {/* Navigation buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('sla-details')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'sla-details'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10'
                : 'hover:bg-brand-navy-900 text-gray-400 hover:text-gray-200'
            }`}
            aria-pressed={activeTab === 'sla-details'}
          >
            <Layers size={14} />
            <span>SLA Performance Details</span>
          </button>
          
          <button
            onClick={() => setActiveTab('miss-analysis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'miss-analysis'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10'
                : 'hover:bg-brand-navy-900 text-gray-400 hover:text-gray-200'
            }`}
            aria-pressed={activeTab === 'miss-analysis'}
          >
            <AlertTriangle size={14} />
            <span>SLA Miss Analysis</span>
          </button>
          
          <button
            onClick={() => setActiveTab('miss-reasons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'miss-reasons'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10'
                : 'hover:bg-brand-navy-900 text-gray-400 hover:text-gray-200'
            }`}
            aria-pressed={activeTab === 'miss-reasons'}
          >
            <FileSearch2 size={14} />
            <span>SLA Miss Reason View</span>
          </button>
        </div>

        {/* Quick Statistics Tag */}
        <div className="text-[10px] text-gray-400 font-semibold px-3 uppercase tracking-wider text-right">
          Filtered: <span className="text-gray-200 font-bold">{filteredRecords.length}</span> Runs /{' '}
          <span className="text-rose-400 font-bold">{metrics.missed}</span> Exceptions
        </div>
      </div>

      {/* 5. Dynamically Rendered Workspaces */}
      <div className="transition-all duration-300">
        
        {/* TAB 1: SLA Details Charts */}
        {activeTab === 'sla-details' && (
          <div className="space-y-6">
            
            {/* Monthly Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyPerformanceChart
                data={monthlyPerformance}
                isLoading={isLoading}
                onBarClick={(monthName) => {
                  setFilters(prev => ({ ...prev, startDate: '', endDate: '', year: 'All', slaStatus: 'Missed' }));
                  // Switch tab and search/filter by that month
                  setActiveTab('miss-reasons');
                }}
              />
              <MonthlyTrendChart
                data={monthlyPerformance}
                isLoading={isLoading}
              />
            </div>
            
            {/* Daily Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        )}

        {/* TAB 2: Diagnostic RCA Miss Analysis */}
        {activeTab === 'miss-analysis' && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-navy-950/20 border border-brand-navy-850 rounded-xl select-none">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Root-Cause Diagnostic Workspace</h3>
              <p className="text-[10px] text-gray-500 mt-1">
                Diagnostic analytics showing attributions for <span className="text-rose-400 font-semibold">{metrics.missed}</span> missed SLAs in active scope. Click chart bars to drill down.
              </p>
            </div>
            <MissAnalysisCharts
              analysisData={missAnalysis}
              isLoading={isLoading}
              onCategoryFilter={handleCategoryFilter}
            />
          </div>
        )}

        {/* TAB 3: Exceptions / Miss Reasons Table */}
        {activeTab === 'miss-reasons' && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-navy-950/20 border border-brand-navy-850 rounded-xl select-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">SLA Incident Resolution Log</h3>
                <p className="text-[10px] text-gray-500 mt-1">
                  Investigation database for exceptions. Select a row to inspect full RCA details.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold px-2.5 py-1 rounded-full">
                  {filteredRecords.filter(r => r.status === 'Missed').length} Missed Runs
                </span>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredRecords}
              onRowClick={handleRecordInspect}
              emptyState={
                <EmptyState
                  title="No SLA exceptions matches your search"
                  description="Try resetting your active filters or clear search query to view all incidents."
                  onActionClick={handleClearFilters}
                  actionText="Reset Filters"
                />
              }
            />
          </div>
        )}

      </div>

      {/* 6. Execution Detail Inspector Modal */}
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
                    <Badge variant="amber">{selectedRecord.issueCategory}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Execution Layer</p>
                    <Badge variant="blue">{selectedRecord.executionLayer}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Responsible Team</p>
                    <span className="text-gray-200 font-bold">{selectedRecord.responsibleTeam}</span>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">RCA Incident Status</p>
                    <Badge variant={selectedRecord.rcaStatus === 'Completed' ? 'green' : 'amber'}>
                      {selectedRecord.rcaStatus}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Operational Resolution Status</p>
                    <Badge variant={selectedRecord.solutionStatus === 'Permanent Fix' ? 'green' : 'purple'}>
                      {selectedRecord.solutionStatus}
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
