import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SlaPerformancePage from './pages/SlaPerformancePage';
import ExceptionsPage from './pages/ExceptionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import mockData from './data/mockDashboardData.json';

export default function App() {
  // 1. Auth & Router State
  const [currentUser, setCurrentUser] = useState(() => {
    // Check if session exists in memory (optional)
    return null;
  });
  
  const [activePage, setActivePage] = useState('dashboard');
  
  // 2. Data State
  const [records, setRecords] = useState(mockData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  
  // 3. Search query (propagates between Topbar and Pages)
  const [searchQuery, setSearchQuery] = useState('');

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('dashboard');
    setSearchQuery('');
  };

  // Refresh handler (simulate database fetch/calculations)
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      // Simulate slight variance in data or calculations
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  // Login success callback
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActivePage('dashboard');
  };

  // 4. Render Gateway
  if (!currentUser) {
    return (
      <ThemeProvider>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  // Render active page component inside Layout
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            records={records}
            isLoading={isRefreshing}
            onRefresh={handleRefresh}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'sla-performance':
        return (
          <SlaPerformancePage
            records={records}
            isLoading={isRefreshing}
          />
        );
      case 'exceptions':
        return (
          <ExceptionsPage
            records={records}
            isLoading={isRefreshing}
          />
        );
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            records={records}
            isLoading={isRefreshing}
            onRefresh={handleRefresh}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <AppLayout
        activePage={activePage}
        setActivePage={setActivePage}
        user={currentUser}
        onLogout={handleLogout}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        {renderActivePage()}
      </AppLayout>
    </ThemeProvider>
  );
}
