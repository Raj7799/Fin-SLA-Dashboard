import React, { useState } from 'react';
import { FileSpreadsheet, Eye, Download, FileText, CheckCircle2, RotateCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Badge from '../components/common/Badge';
import mockReports from '../data/mockReports.json';
import { formatPercentage, formatDate, formatNumber } from '../utils/formatters';

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [period, setPeriod] = useState('August 2026');
  const [type, setType] = useState('Monthly Summary');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setGeneratedReport(null);

    // Simulate PDF/Excel compilation
    setTimeout(() => {
      setIsGenerating(false);
      
      const newReportId = `REP-${Date.now().toString().substring(8)}`;
      const matchesPeriod = reports.find(r => r.period === period && r.type === type);
      
      const compliance = matchesPeriod ? matchesPeriod.compliance : 95.2;
      const totalExecutions = matchesPeriod ? matchesPeriod.executionsCount : 280;
      
      const newReport = {
        id: newReportId,
        name: `${period} ${type} Report`,
        period,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Ready',
        type,
        executionsCount: totalExecutions,
        compliance
      };

      setGeneratedReport(newReport);
      // Append to the list of reports
      setReports(prev => [newReport, ...prev]);
    }, 1500);
  };

  const handleDownload = (reportName) => {
    alert(`Initiating download for: ${reportName}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-brand-navy-800 pb-5 select-none">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Compliance Reporting</span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 font-heading">Operational Reports</h1>
        <p className="text-xs text-gray-400 mt-1">Compile financial SLA compliance audits, download metrics, and examine historical logs.</p>
      </div>

      {/* Selectors Panel */}
      <div className="bg-brand-navy-950/20 border border-brand-navy-850 p-5 rounded-xl flex flex-col md:flex-row items-end gap-4 shadow-sm select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          <Select
            label="Reporting Period"
            id="report-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={['August 2026', 'July 2026', 'June 2026', 'May 2026', 'Q2 2026']}
          />
          
          <Select
            label="Report Layout Type"
            id="report-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={['Monthly Summary', 'Diagnostic Report', 'Exception RCA Log']}
          />
        </div>

        <Button
          onClick={handleGenerateReport}
          isLoading={isGenerating}
          icon={<FileSpreadsheet size={16} />}
          className="w-full md:w-auto px-6"
        >
          Compile Report
        </Button>
      </div>

      {/* Summary Preview (renders on generation success) */}
      {generatedReport && (
        <div className="bg-brand-navy-950/30 border border-emerald-500/20 rounded-xl p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-brand-navy-800 pb-3 select-none">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Report Compiled Successfully</h3>
            </div>
            <Badge variant="green">ID: {generatedReport.id}</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2 select-none">
            <div className="bg-brand-navy-950/40 p-4 rounded-lg border border-brand-navy-850">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Report Title</p>
              <p className="text-xs text-gray-200 font-semibold mt-1 truncate">{generatedReport.name}</p>
            </div>
            <div className="bg-brand-navy-950/40 p-4 rounded-lg border border-brand-navy-850">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Runs Audited</p>
              <p className="text-sm text-gray-200 font-bold mt-1">{formatNumber(generatedReport.executionsCount)} Executions</p>
            </div>
            <div className="bg-brand-navy-950/40 p-4 rounded-lg border border-brand-navy-850">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SLA Target</p>
              <p className="text-sm text-gray-200 font-bold mt-1">95.0% Compliance</p>
            </div>
            <div className="bg-brand-navy-950/40 p-4 rounded-lg border border-brand-navy-850">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Compliance Rate</p>
              <p className={`text-sm font-extrabold mt-1 ${generatedReport.compliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatPercentage(generatedReport.compliance)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(generatedReport.name)}
              icon={<Download size={14} />}
            >
              Download Excel Sheet
            </Button>
          </div>
        </div>
      )}

      {/* Recent Generated Reports Table */}
      <div className="bg-brand-navy-950/40 border border-brand-navy-800/80 rounded-xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-brand-navy-800 select-none">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Recent Report History</h3>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-brand-navy-800 text-left">
            <thead>
              <tr className="bg-brand-navy-900/60 select-none">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Compiled Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy-850">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-brand-navy-900/20 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-gray-200 font-semibold flex items-center gap-2.5">
                    <FileText size={16} className="text-blue-500" />
                    <span>{rep.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{rep.period}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{formatDate(rep.generatedDate)}</td>
                  <td className={`px-6 py-4 text-xs font-bold ${rep.compliance >= 95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPercentage(rep.compliance)}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <Badge variant="green">{rep.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownload(rep.name)}
                      className="p-1.5 rounded-lg border border-brand-navy-750 hover:border-brand-navy-600 bg-brand-navy-950 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                      title="Download Sheet"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
