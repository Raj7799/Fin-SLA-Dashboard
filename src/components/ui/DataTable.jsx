import React, { useState, useMemo } from 'react';

export default function DataTable({
  columns = [], // [{ header: 'Header', accessor: 'prop', sortable: true, render: (row) => cellHtml }]
  data = [],
  onRowClick,
  emptyState,
  rowsPerPage = 10,
  className = ''
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Handle header click for sorting
  const handleSort = (key, sortable) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data client-side
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    const sorted = [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal - bVal;
    });

    if (sortConfig.direction === 'desc') {
      sorted.reverse();
    }
    return sorted;
  }, [data, sortConfig]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;

  return (
    <div className={`flex flex-col w-full bg-brand-navy-950/40 border border-brand-navy-700/60 rounded-xl overflow-hidden shadow-xl ${className}`}>
      
      {/* Table Area */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-brand-navy-800 text-left border-collapse">
          <thead>
            <tr className="bg-brand-navy-900/60">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col.accessor, col.sortable)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none ${
                    col.sortable ? 'cursor-pointer hover:text-gray-200 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortConfig.key === col.accessor && (
                      <span>
                        {sortConfig.direction === 'asc' ? (
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </span>
                    )}
                    {col.sortable && sortConfig.key !== col.accessor && (
                      <span className="opacity-0 hover:opacity-100 text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy-850 bg-brand-navy-950/20">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group border-brand-navy-800 transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer hover:bg-brand-navy-900/40' : ''
                  }`}
                >
                  {columns.map((col, colIdx) => {
                    const value = row[col.accessor];
                    return (
                      <td key={colIdx} className="px-6 py-3.5 text-sm text-gray-300 font-medium whitespace-nowrap">
                        {col.render ? col.render(row) : value !== null && value !== undefined ? String(value) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="text-gray-500 text-sm">No records found.</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-brand-navy-800/80 bg-brand-navy-900/30 select-none">
          <div className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-300">{Math.min((currentPage - 1) * rowsPerPage + 1, data.length)}</span> to{' '}
            <span className="font-semibold text-gray-300">{Math.min(currentPage * rowsPerPage, data.length)}</span> of{' '}
            <span className="font-semibold text-gray-300">{data.length}</span> records
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-navy-700 bg-brand-navy-950 hover:bg-brand-navy-800 disabled:opacity-30 disabled:hover:bg-brand-navy-950 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-xs text-gray-400 px-2">
              Page <span className="font-semibold text-gray-300">{currentPage}</span> of{' '}
              <span className="font-semibold text-gray-300">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-brand-navy-700 bg-brand-navy-950 hover:bg-brand-navy-800 disabled:opacity-30 disabled:hover:bg-brand-navy-950 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
