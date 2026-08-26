import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Database,
  TrendingUp,
  Activity,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SlaLiveTrackerPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State for exactly 13 data sources distributed:
  // - 6 Bronze cards (< 75%)
  // - 5 Silver cards (>= 75% & < 90%)
  // - 2 Gold cards (>= 90%)
  const [sources, setSources] = useState([
    // Gold Tiers (2)
    { id: 1, name: 'FDH-ADF Pipeline Sync', compliance: 96.4, status: 'Online', lastSync: 'Just now', target: 95.0, runtime: '12m' },
    { id: 2, name: 'Control-M Batch Scheduler', compliance: 92.1, status: 'Online', lastSync: 'Just now', target: 92.0, runtime: '8m' },
    
    // Silver Tiers (5)
    { id: 3, name: 'FDH-Snowflake Lakehouse', compliance: 88.5, status: 'Online', lastSync: '1m ago', target: 95.0, runtime: '24m' },
    { id: 4, name: 'Streamlit Analytics Portal', compliance: 81.7, status: 'Online', lastSync: '2m ago', target: 90.0, runtime: '4m' },
    { id: 5, name: 'Commercial Deals Refiner', compliance: 78.9, status: 'Online', lastSync: '4m ago', target: 85.0, runtime: '15m' },
    { id: 6, name: 'Audit Log Consolidator', compliance: 85.2, status: 'Online', lastSync: '3m ago', target: 90.0, runtime: '18m' },
    { id: 7, name: 'Tax Calculation Engine', compliance: 87.1, status: 'Online', lastSync: 'Just now', target: 95.0, runtime: '9m' },
    
    // Bronze Tiers (6)
    { id: 8, name: 'Oracle SOA Integration Gateway', compliance: 68.2, status: 'Warning', lastSync: '3m ago', target: 90.0, runtime: '32m' },
    { id: 9, name: 'Kafka Real-Time Streams', compliance: 54.0, status: 'Critical', lastSync: '5m ago', target: 80.0, runtime: '1.2s' },
    { id: 10, name: 'Billing Ingestion Pipeline', compliance: 61.5, status: 'Warning', lastSync: '7m ago', target: 95.0, runtime: '45m' },
    { id: 11, name: 'SAP Ledger Extraction Feed', compliance: 71.8, status: 'Warning', lastSync: '2m ago', target: 90.0, runtime: '60m' },
    { id: 12, name: 'Salesforce CRM Inbound Queue', compliance: 48.3, status: 'Critical', lastSync: '12m ago', target: 85.0, runtime: '2m' },
    { id: 13, name: 'Customer Feedback Lake Loader', compliance: 59.4, status: 'Warning', lastSync: '8m ago', target: 80.0, runtime: '14m' }
  ]);

  // Track expanded state for more detail on each card
  const [expandedCards, setExpandedCards] = useState({});
  const [isSimulating, setIsSimulating] = useState(true);

  // Fluctuations for live simulator
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSources(prev => prev.map(s => {
        const delta = (Math.random() - 0.5) * 0.6;
        let newCompliance = Math.max(30, Math.min(100, parseFloat((s.compliance + delta).toFixed(1))));

        let newStatus = 'Online';
        if (newCompliance < 75) newStatus = 'Warning';
        if (newCompliance < 60) newStatus = 'Critical';

        return {
          ...s,
          compliance: newCompliance,
          status: newStatus,
          lastSync: 'Just now'
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dynamic separation of feeds based on compliance
  const bronzeFeeds = sources.filter(s => s.compliance < 75);
  const silverFeeds = sources.filter(s => s.compliance >= 75 && s.compliance < 90);
  const goldFeeds = sources.filter(s => s.compliance >= 90);

  // Compute total rows based on the max column count (which is Bronze = 6)
  const totalRows = Math.max(bronzeFeeds.length, silverFeeds.length, goldFeeds.length, 6);

  const getMedallionDetails = (compliance) => {
    if (compliance >= 90) {
      return {
        label: 'Gold Tier',
        color: '#eab308',
        bgGradient: 'from-amber-500/10 to-amber-500/20',
        textClass: 'text-amber-500 dark:text-amber-400 font-extrabold',
        badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      };
    } else if (compliance >= 75) {
      return {
        label: 'Silver Tier',
        color: '#94a3b8',
        bgGradient: 'from-slate-500/10 to-slate-500/20',
        textClass: 'text-slate-500 dark:text-slate-300 font-extrabold',
        badgeClass: 'bg-slate-500/10 text-slate-400 dark:text-slate-300 border-slate-500/20'
      };
    } else {
      return {
        label: 'Bronze Tier',
        color: '#b45309',
        bgGradient: 'from-orange-500/10 to-orange-500/20',
        textClass: 'text-orange-600 dark:text-orange-500 font-bold',
        badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20'
      };
    }
  };

  // Render individual minimal card
  const renderSourceCard = (src) => {
    const isExpanded = !!expandedCards[src.id];
    const medallion = getMedallionDetails(src.compliance);

    return (
      <div 
        className={`bg-white/70 dark:bg-[#0b0f19]/45 border border-gray-200/60 dark:border-brand-navy-850 rounded-xl p-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md hover:border-blue-500/20 w-full ${
          isExpanded ? 'ring-1 ring-blue-500/15' : ''
        }`}
      >
        {/* Minimal View */}
        <div className="flex items-center justify-between select-none">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <Database size={11} className="text-gray-400 flex-shrink-0" />
              <h4 className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate font-heading">{src.name}</h4>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold border ${medallion.badgeClass}`}>
                {medallion.label}
              </span>
              <span className={`text-[7px] font-extrabold flex items-center gap-1 ${
                src.status === 'Online' ? 'text-emerald-500' : src.status === 'Warning' ? 'text-amber-500' : 'text-rose-500'
              }`}>
                <span className={`h-1 w-1 rounded-full ${
                  src.status === 'Online' ? 'bg-emerald-500' : src.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                }`} />
                {src.compliance.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Details Toggle Button */}
          <button 
            onClick={() => toggleExpand(src.id)}
            className="p-1 rounded-lg bg-gray-100/50 hover:bg-gray-100 dark:bg-brand-navy-900/60 dark:hover:bg-brand-navy-800/80 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer flex-shrink-0"
            title={isExpanded ? "Show Less" : "More Details"}
          >
            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>

        {/* Detailed Expanded View */}
        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-brand-navy-850/60 space-y-3 animate-fade-in select-none">
            
            {/* Battery UI */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] text-gray-400 font-semibold">
                <span>Battery fill</span>
                <span style={{ color: medallion.color }}>SLA compliance</span>
              </div>
              <div className="relative w-full h-7 bg-gray-50 dark:bg-brand-navy-950/70 border border-gray-300 dark:border-brand-navy-700/60 rounded-lg p-0.5 flex items-center shadow-inner">
                {/* Milestone Indicators */}
                <div className="absolute left-[75%] top-0 bottom-0 w-px border-l border-dashed border-gray-400 dark:border-brand-navy-700/60 z-20" title="Silver threshold (75%)" />
                <div className="absolute left-[90%] top-0 bottom-0 w-px border-l border-dashed border-gray-400 dark:border-brand-navy-700/60 z-20" title="Gold threshold (90%)" />
                
                {/* Fluid */}
                <div 
                  className="h-full rounded-md transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ 
                    width: `${src.compliance}%`,
                    backgroundColor: medallion.color,
                    boxShadow: `0 0 10px ${medallion.color}25`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen" style={{ animationDuration: '3s' }} />
                </div>
                {/* Tip */}
                <div className="absolute -right-2 top-1.5 w-1 h-3 bg-gray-300 dark:bg-brand-navy-700 border-t border-r border-b border-gray-300 dark:border-brand-navy-700 rounded-r" />
              </div>
            </div>

            {/* Parameter Details */}
            <div className="grid grid-cols-2 gap-1.5 bg-gray-50/50 dark:bg-brand-navy-950/40 p-2 rounded-lg border border-gray-100 dark:border-brand-navy-850/30 text-[8px]">
              <div>
                <span className="text-gray-400 dark:text-gray-500 block font-medium">SLA TARGET</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{src.target.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-gray-500 block font-medium">SYNC TIMER</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{src.lastSync}</span>
              </div>
              <div className="mt-0.5">
                <span className="text-gray-400 dark:text-gray-500 block font-medium">AVG RUNTIME</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{src.runtime}</span>
              </div>
              <div className="mt-0.5">
                <span className="text-gray-400 dark:text-gray-500 block font-medium">KPI INDEX</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold flex items-center gap-1">
                  <TrendingUp size={8} className="text-emerald-500" />
                  Stable
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  };

  // Render dummy placeholder slot to maintain visual balance and grid alignment
  const renderPlaceholder = (type) => {
    return (
      <div className="border border-dashed border-gray-300/60 dark:border-brand-navy-850/60 bg-gray-50/5 dark:bg-brand-navy-950/10 rounded-xl p-3.5 flex items-center justify-center h-[52px] select-none text-[8px] text-gray-400 dark:text-gray-500 font-medium w-full">
        <span>Inactive {type} Node</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Keyframes style block for animated dashed arrows */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flowDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .flow-arrow-path {
          stroke-dasharray: 6, 4;
          animation: flowDash 1.2s linear infinite;
        }
      `}} />
      
      {/* ── Page Header / Control Banner ── */}
      <div className="bg-white/60 dark:bg-brand-navy-950/40 border border-gray-200/50 dark:border-brand-navy-850 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-md select-none">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 font-heading uppercase tracking-wide">Live SLA Medallion Pipeline</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Real-time medallion pipeline tracking (Bronze ── Silver ── Gold)</p>
          </div>
        </div>

        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
            isSimulating
              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/25'
          }`}
        >
          <Zap size={13} className={isSimulating ? 'animate-bounce' : ''} />
          <span>{isSimulating ? 'Pause Live Sync' : 'Resume Live Sync'}</span>
        </button>
      </div>

      {/* ── Desktop Category Headers Row with Long Animated Arrows ── */}
      <div className="hidden lg:flex items-center justify-between gap-2 px-4 select-none">
        
        {/* Bronze Box */}
        <div className="w-[190px] p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500 animate-pulse-subtle" size={14} />
            <div>
              <h3 className="text-[10px] font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider font-heading">Bronze Level</h3>
              <p className="text-[7px] text-gray-400">Ingestion (&lt;75%)</p>
            </div>
          </div>
          <span className="text-[8px] font-black bg-orange-500/15 border border-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full">
            {bronzeFeeds.length}
          </span>
        </div>

        {/* Long Arrow 1: Bronze -> Silver */}
        <div className="flex-1 flex items-center justify-center px-4">
          <svg className="w-full h-4 text-orange-500/70" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M 0 10 L 98 10 M 92 5 L 98 10 L 92 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flow-arrow-path" />
          </svg>
        </div>

        {/* Silver Box */}
        <div className="w-[190px] p-2.5 bg-slate-500/10 border border-slate-500/20 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="text-slate-400 animate-pulse-subtle" size={14} />
            <div>
              <h3 className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-heading">Silver Level</h3>
              <p className="text-[7px] text-gray-400">Validation (75%-90%)</p>
            </div>
          </div>
          <span className="text-[8px] font-black bg-slate-500/15 border border-slate-500/20 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full">
            {silverFeeds.length}
          </span>
        </div>

        {/* Long Arrow 2: Silver -> Gold */}
        <div className="flex-1 flex items-center justify-center px-4">
          <svg className="w-full h-4 text-slate-400" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M 0 10 L 98 10 M 92 5 L 98 10 L 92 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flow-arrow-path" />
          </svg>
        </div>

        {/* Gold Box */}
        <div className="w-[190px] p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-amber-500 animate-pulse-subtle" size={14} />
            <div>
              <h3 className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-heading">Gold Level</h3>
              <p className="text-[7px] text-gray-400">Operations (&gt;90%)</p>
            </div>
          </div>
          <span className="text-[8px] font-black bg-amber-500/15 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
            {goldFeeds.length}
          </span>
        </div>

      </div>

      {/* ── Rows of Feeds connected by Long Arrows (Desktop layout) ── */}
      <div className="space-y-4">
        
        {Array.from({ length: totalRows }).map((_, rowIndex) => {
          const bronzeFeed = bronzeFeeds[rowIndex];
          const silverFeed = silverFeeds[rowIndex];
          const goldFeed = goldFeeds[rowIndex];

          return (
            <div key={rowIndex} className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0 px-4">
              
              {/* Column 1: Bronze Feed */}
              <div className="w-full lg:w-[190px] flex justify-center flex-shrink-0">
                {bronzeFeed ? renderSourceCard(bronzeFeed) : renderPlaceholder('Bronze')}
              </div>

              {/* Arrow 1: Bronze -> Silver */}
              <div className="w-full lg:flex-1 flex items-center justify-center px-4 my-2 lg:my-0">
                <svg className="w-16 lg:w-full h-4 text-orange-500/50" viewBox="0 0 100 20" preserveAspectRatio={rowIndex < Math.max(bronzeFeeds.length, silverFeeds.length) ? 'none' : 'none'}>
                  <path d="M 0 10 L 98 10 M 92 5 L 98 10 L 92 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flow-arrow-path" />
                </svg>
              </div>

              {/* Column 2: Silver Feed */}
              <div className="w-full lg:w-[190px] flex justify-center flex-shrink-0">
                {silverFeed ? renderSourceCard(silverFeed) : renderPlaceholder('Silver')}
              </div>

              {/* Arrow 2: Silver -> Gold */}
              <div className="w-full lg:flex-1 flex items-center justify-center px-4 my-2 lg:my-0">
                <svg className="w-16 lg:w-full h-4 text-slate-400" viewBox="0 0 100 20" preserveAspectRatio={rowIndex < Math.max(silverFeeds.length, goldFeeds.length) ? 'none' : 'none'}>
                  <path d="M 0 10 L 98 10 M 92 5 L 98 10 L 92 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flow-arrow-path" />
                </svg>
              </div>

              {/* Column 3: Gold Feed */}
              <div className="w-full lg:w-[190px] flex justify-center flex-shrink-0">
                {goldFeed ? renderSourceCard(goldFeed) : renderPlaceholder('Gold')}
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
