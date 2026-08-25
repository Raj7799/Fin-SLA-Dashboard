import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, Eye } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Select from '../components/ui/Select';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import StatusIndicator from '../components/common/StatusIndicator';

import { formatDate, formatMinutesToTime, formatVariance } from '../utils/formatters';

export default function ExceptionsPage({
  records = [],
  isLoading = false
}) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [filters, setFilters] = useState({
    team: 'All',
    category: 'All',
    layer: 'All'
  });

  // Extract only missed records for analysis
  const missedRecords = useMemo(() => records.filter(r => r.status === 'Missed'), [records]);

  // Extract unique filter keys
  const uniqueTeams = useMemo(() => ['All', ...new Set(missedRecords.map(r => r.responsibleTeam).filter(Boolean))], [missedRecords]);
  const uniqueCategories = useMemo(() => ['All', ...new Set(missedRecords.map(r => r.issueCategory).filter(Boolean))], [missedRecords]);
  const uniqueLayers = useMemo(() => ['All', ...new Set(missedRecords.map(r => r.executionLayer).filter(Boolean))], [missedRecords]);

  // Filter missed records
  const filteredExceptions = useMemo(() => {
    return missedRecords.filter(r => {
      if (filters.team !== 'All' && r.responsibleTeam !== filters.team) return false;
      if (filters.category !== 'All' && r.issueCategory !== filters.category) return false;
      if (filters.layer !== 'All' && r.executionLayer !== filters.layer) return false;
      
      if (search) {
        const q = search.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchRule = r.slaRule.toLowerCase().includes(q);
        const matchSource = r.source.toLowerCase().includes(q);
        const matchTeam = r.responsibleTeam && r.responsibleTeam.toLowerCase().includes(q);
        const matchCategory = r.issueCategory && r.issueCategory.toLowerCase().includes(q);
        
        if (!matchId && !matchRule && !matchSource && !matchTeam && !matchCategory) return false;
      }
      return true;
    });
  }, [missedRecords, filters, search]);

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({ team: 'All', category: 'All', layer: 'All' });
    setSearch('');
  };

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true, render: (row) => <span className="font-mono text-blue-400 group-hover:underline">{row.id}</span> },
    { header: 'Date', accessor: 'date', sortable: true, render: (row) => formatDate(row.date, true) },
    { header: 'Source', accessor: 'source', sortable: true },
    { header: 'Rule', accessor: 'slaRule', sortable: true },
    { header: 'Variance', accessor: 'varianceMinutes', sortable: true, render: (row) => (
        <span className="font-bold text-rose-400">+{row.varianceMinutes} min</span>
      )
    },
    { header: 'Issue Category', accessor: 'issueCategory', sortable: true, render: (row) => <Badge variant="red">{row.issueCategory}</Badge> },
    { header: 'Execution Layer', accessor: 'executionLayer', sortable: true, render: (row) => <Badge variant="blue">{row.executionLayer}</Badge> },
    { header: 'Responsible Team', accessor: 'responsibleTeam', sortable: true },
    { header: 'Solution Status', accessor: 'solutionStatus', sortable: true, render: (row) => (
        <Badge variant={row.solutionStatus === 'Permanent Fix' ? 'green' : 'purple'}>{row.solutionStatus}</Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-brand-navy-800 pb-5 select-none">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Operational Incidents</span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 font-heading">SLA Exceptions Workspace</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review, analyze, and track resolution statuses for all <span className="text-rose-400 font-semibold">{filteredExceptions.length}</span> missed SLA operations.
        </p>
      </div>

      {/* Exception Filtering & Search */}
      <div className="bg-brand-navy-950/20 border border-brand-navy-850 p-5 rounded-xl flex flex-col md:flex-row items-end gap-4 shadow-sm select-none">
        
        {/* Search */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Incidents</label>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by ID, team, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-brand-navy-950 border border-brand-navy-700 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Responsible Team"
            id="filter-team"
            value={filters.team}
            onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
            options={uniqueTeams}
          />
          
          <Select
            label="Issue Category"
            id="filter-category"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            options={uniqueCategories}
          />
          
          <Select
            label="Execution Layer"
            id="filter-layer"
            value={filters.layer}
            onChange={(e) => setFilters(prev => ({ ...prev, layer: e.target.value }))}
            options={uniqueLayers}
          />
        </div>
      </div>

      {/* Exceptions Table */}
      <DataTable
        columns={columns}
        data={filteredExceptions}
        onRowClick={handleRowClick}
        emptyState={
          <EmptyState
            title="No exceptions match active scope"
            description="Try resetting your diagnostic filters to search the full exception log."
            onActionClick={handleClearFilters}
            actionText="Reset Filters"
          />
        }
      />

      {/* Record Inspector Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Exceptions Inspector — ${selectedRecord?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <StatusIndicator status="Missed" />
                <span className="text-sm font-bold">Execution SLA Missed</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Variance: +{selectedRecord.varianceMinutes} mins
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
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Target Cutoff Deadline</p>
                <p className="text-gray-200 font-bold">{formatMinutesToTime(selectedRecord.slaCutoff, true)}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Actual Completion Time</p>
                <p className="text-gray-200 font-bold">{formatMinutesToTime(selectedRecord.endTimeMinutes, true)}</p>
              </div>
            </div>

            {/* Incident diagnostic */}
            <div className="pt-4 border-t border-brand-navy-800">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Diagnostic Log</h4>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
                <div>
                  <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Issue Category</p>
                  <Badge variant="red">{selectedRecord.issueCategory}</Badge>
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
                  <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Resolution Status</p>
                  <Badge variant={selectedRecord.solutionStatus === 'Permanent Fix' ? 'green' : 'purple'}>
                    {selectedRecord.solutionStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-brand-navy-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-brand-navy-800 hover:bg-brand-navy-700 text-gray-300 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
