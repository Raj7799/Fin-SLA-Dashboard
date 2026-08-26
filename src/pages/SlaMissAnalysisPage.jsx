import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronRight,
  RotateCw
} from 'lucide-react';

import MissAnalysisCharts from '../components/charts/MissAnalysisCharts';
import { filterRecords } from '../utils/slaCalculations';

export default function SlaMissAnalysisPage({
  records = [],
  isLoading = false,
  onRefresh,
  searchQuery,
  setSearchQuery
}) {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    startDate: '2026-03-02',
    endDate: '2026-08-14',
    year: 'All',
    subdomain: 'All',
    slaStatus: 'Missed', // Default to Missed for Miss Analysis
    source: 'All'
  });

  // Unique filter options gathered from records
  const uniqueSubdomains = useMemo(() => ['All', ...new Set(records.map(r => r.subdomain))], [records]);
  const uniqueSources = useMemo(() => ['All', ...new Set(records.map(r => r.source))], [records]);
  
  // Apply filters
  const filteredRecords = useMemo(() => {
    return filterRecords(records, { ...filters, searchQuery });
  }, [records, filters, searchQuery]);

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      year: 'All',
      subdomain: 'All',
      slaStatus: 'Missed',
      source: 'All'
    });
    setSearchQuery('');
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
            
            {/* Title & Collapse Toggle */}
            <div className="flex items-center justify-between pb-4.5 border-b border-brand-navy-850 select-none">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={16} className="text-blue-500 animate-pulse-subtle" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Scope filters</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Refine analysis view</p>
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
                      name="slaStatusRadioAnalysis"
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

        {/* Clear Filters Button */}
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

      {/* ── Right Content Area (RCA Diagnostic Charts) ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <MissAnalysisCharts
          filteredRecords={filteredRecords}
          isLoading={isLoading}
        />
      </div>

    </div>
  );
}
