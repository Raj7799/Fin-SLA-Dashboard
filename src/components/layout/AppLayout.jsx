import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AnimatedBackground from './AnimatedBackground';
import { useTheme } from '../../context/ThemeContext';

export default function AppLayout({
  children,
  activePage,
  setActivePage,
  user,
  onLogout,
  lastUpdated,
  onRefresh,
  isRefreshing,
  searchQuery,
  setSearchQuery
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{
        background: isDark ? 'var(--bg-surface)' : 'var(--bg-base)',
        color: 'var(--text-primary)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* ── Animated background layer (fixed, behind everything) ── */}
      <AnimatedBackground />

      {/* ── Sidebar ── */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        user={user}
        onLogout={onLogout}
      />

      {/* ── Main content area (above background z-index) ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* Topbar */}
        <Topbar
          activePage={activePage}
          setIsOpenMobile={setIsOpenMobile}
          lastUpdated={lastUpdated}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
