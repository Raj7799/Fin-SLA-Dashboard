/**
 * Filter records based on active user filters.
 */
export function filterRecords(records, filters) {
  return records.filter(record => {
    // Date Range Filter
    if (filters.startDate && record.date < filters.startDate) return false;
    if (filters.endDate && record.date > filters.endDate) return false;
    
    // Year Filter
    if (filters.year && filters.year !== 'All') {
      const recordYear = new Date(record.date).getUTCFullYear().toString();
      if (recordYear !== filters.year) return false;
    }
    
    // Subdomain Filter
    if (filters.subdomain && filters.subdomain !== 'All') {
      if (record.subdomain !== filters.subdomain) return false;
    }
    
    // SLA Status Filter
    if (filters.slaStatus && filters.slaStatus !== 'All') {
      if (record.status !== filters.slaStatus) return false;
    }
    
    // Source Filter
    if (filters.source && filters.source !== 'All') {
      if (record.source !== filters.source) return false;
    }
    
    // Search query (matches execution ID or rules/teams)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchId = record.id.toLowerCase().includes(q);
      const matchRule = record.slaRule.toLowerCase().includes(q);
      const matchSource = record.source.toLowerCase().includes(q);
      const matchTeam = record.responsibleTeam && record.responsibleTeam.toLowerCase().includes(q);
      const matchCategory = record.issueCategory && record.issueCategory.toLowerCase().includes(q);
      
      if (!matchId && !matchRule && !matchSource && !matchTeam && !matchCategory) return false;
    }
    
    return true;
  });
}

/**
 * Basic Metrics
 */
export function calculateMetrics(filteredRecords) {
  const total = filteredRecords.length;
  const met = filteredRecords.filter(r => r.status === 'Met').length;
  const missed = total - met;
  const compliance = total > 0 ? (met / total) * 100 : 0;
  
  return { total, met, missed, compliance };
}

/**
 * Calculate compliance specifically for Oracle Planning records.
 */
export function calculateOraclePlanningCompliance(records) {
  const oracleRecords = records.filter(r => r.source === 'Oracle Planning');
  const metrics = calculateMetrics(oracleRecords);
  return metrics.compliance;
}

/**
 * Calculate compliance specifically for the current month in the data set.
 * In our generated dataset, August 2026 is the latest month (current month).
 */
export function calculateCurrentMonthCompliance(records) {
  // Find the maximum date in the dataset to determine the current month
  if (records.length === 0) return 0;
  
  const dates = records.map(r => new Date(r.date));
  const maxDate = new Date(Math.max(...dates));
  const maxMonth = maxDate.getUTCMonth();
  const maxYear = maxDate.getUTCFullYear();
  
  const currentMonthRecords = records.filter(r => {
    const d = new Date(r.date);
    return d.getUTCMonth() === maxMonth && d.getUTCFullYear() === maxYear;
  });
  
  const metrics = calculateMetrics(currentMonthRecords);
  return metrics.compliance;
}

/**
 * Group data by Month for stacked bar charts.
 * Format output for Recharts: [{ month: 'March 2026', Met: 80, Missed: 5 }]
 */
export function getMonthlyPerformance(records) {
  const monthsMap = {};
  
  // Sort records by date to process chronologically
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
  
  sortedRecords.forEach(r => {
    const d = new Date(r.date);
    const monthName = d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    
    if (!monthsMap[monthName]) {
      monthsMap[monthName] = { month: monthName, Met: 0, Missed: 0, total: 0 };
    }
    
    if (r.status === 'Met') {
      monthsMap[monthName].Met += 1;
    } else if (r.status === 'Missed') {
      monthsMap[monthName].Missed += 1;
    }
    monthsMap[monthName].total += 1;
  });
  
  return Object.values(monthsMap).map(m => ({
    ...m,
    compliance: m.total > 0 ? (m.Met / m.total) * 100 : 0
  }));
}

/**
 * Group misses by different dimensions (Issue Category, Layer, Team, RCA Status, Solution Status).
 */
export function getMissAnalysis(records) {
  const missedRecords = records.filter(r => r.status === 'Missed');
  
  const byCategory = {};
  const byLayer = {};
  const byTeam = {};
  const byRcaStatus = {};
  const bySolutionStatus = {};
  
  missedRecords.forEach(r => {
    const cat = r.issueCategory || 'Unassigned';
    const lay = r.executionLayer || 'Unassigned';
    const team = r.responsibleTeam || 'Unassigned';
    const rca = r.rcaStatus || 'Not Started';
    const sol = r.solutionStatus || 'Investigating';
    
    byCategory[cat] = (byCategory[cat] || 0) + 1;
    byLayer[lay] = (byLayer[lay] || 0) + 1;
    byTeam[team] = (byTeam[team] || 0) + 1;
    byRcaStatus[rca] = (byRcaStatus[rca] || 0) + 1;
    bySolutionStatus[sol] = (bySolutionStatus[sol] || 0) + 1;
  });
  
  const mapToChartData = (obj, nameKey = 'name') => {
    return Object.entries(obj).map(([key, val]) => ({
      [nameKey]: key,
      value: val
    }));
  };
  
  return {
    byCategory: mapToChartData(byCategory),
    byLayer: mapToChartData(byLayer),
    byTeam: mapToChartData(byTeam),
    byRcaStatus: mapToChartData(byRcaStatus),
    bySolutionStatus: mapToChartData(bySolutionStatus)
  };
}

/**
 * Daily SLA Trend: Group met and missed status by date.
 */
export function getDailyStatusTrend(records) {
  const dailyMap = {};
  
  records.forEach(r => {
    const date = r.date;
    if (!dailyMap[date]) {
      dailyMap[date] = { date, Met: 0, Missed: 0 };
    }
    if (r.status === 'Met') {
      dailyMap[date].Met += 1;
    } else {
      dailyMap[date].Missed += 1;
    }
  });
  
  return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
}
