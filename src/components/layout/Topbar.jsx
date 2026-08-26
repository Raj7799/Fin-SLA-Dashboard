import React from 'react';
import { Menu, Bell, RefreshCw, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({
  activePage,
  setIsOpenMobile,
  lastUpdated,
  onRefresh,
  isRefreshing,
  searchQuery,
  setSearchQuery
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const getTitles = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'FIN-Commercial SLA Compliance Dashboard', subtitle: 'Real-time SLA compliance monitoring — Financial & Commercial operations' };
      case 'sla-miss-analysis':
        return { title: 'SLA Miss Analysis', subtitle: 'RCA incident diagnostics and root-cause attributions' };
      case 'live-tracker':
        return { title: 'Live SLA Status Tracker', subtitle: 'Real-time medallion level tracking and source compliance percentages' };
      case 'exceptions':
        return { title: 'SLA Exceptions', subtitle: 'Operational exceptions and root-cause investigation workspace' };
      case 'reports':
        return { title: 'Operational Reports', subtitle: 'Generate, preview, and audit compliance logs' };
      case 'settings':
        return { title: 'Dashboard Settings', subtitle: 'Configure date ranges, SLA targets, and system preferences' };
      default:
        return { title: 'Operations Dashboard', subtitle: 'Financial SLA tracking system' };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <header
      className="h-20 sticky top-0 z-20 flex items-center justify-between px-6"
      style={{
        background: 'var(--topbar-bg)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="md:hidden p-1.5 rounded-lg cursor-pointer transition-colors"
          style={{
            border: '1px solid var(--border-default)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="select-none">
          <h2
            className="text-base font-bold tracking-wide leading-none"
            style={{ color: 'var(--text-heading)', fontFamily: 'Outfit, sans-serif' }}
          >
            {title}
          </h2>
          <p
            className="hidden sm:block text-xs mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search + Refresh + Theme Toggle + Bell */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Last Updated */}
        <div className="flex items-center gap-2">
          <span
            className="hidden md:inline-block text-[10px] font-medium select-none"
            style={{ color: 'var(--text-muted)' }}
          >
            Last update: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg cursor-pointer transition-all duration-300"
          style={{
            border: '1px solid var(--border-default)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun size={14} style={{ color: '#fbbf24' }} />
            : <Moon size={14} style={{ color: '#6366f1' }} />
          }
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 rounded-lg cursor-pointer transition-colors"
            style={{
              border: '1px solid var(--border-default)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
            }}
            aria-label="View notifications"
          >
            <Bell size={14} />
          </button>
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
