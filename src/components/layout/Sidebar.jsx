import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  isOpenMobile,
  setIsOpenMobile,
  user = {},
  onLogout
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'dashboard',         label: 'Dashboard',         icon: LayoutDashboard },
    { id: 'sla-miss-analysis',  label: 'SLA Miss Analysis',  icon: BarChart3 },
    { id: 'live-tracker',      label: 'Live Status Tracker', icon: Zap, isLive: true },
    { id: 'exceptions',        label: 'Exceptions',        icon: AlertTriangle },
    { id: 'reports',           label: 'Reports',           icon: FileSpreadsheet },
    { id: 'settings',          label: 'Settings',          icon: Settings },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  // Sidebar always stays dark (professional enterprise sidebar stays dark even in light mode,
  // matching Figma references of sidebar-always-dark pattern)
  const sidebarBg    = '#05070c';
  const sidebarBorder = '#111827';

  const sidebarContent = (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        color: '#d1d5db',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Subtle side glow */}
      <div
        className="absolute right-0 top-1/3 w-px h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(37,99,235,0.3), transparent)' }}
      />

      {/* ── Branding Header ── */}
      <div
        className="p-5 flex items-center justify-between select-none"
        style={{ borderBottom: `1px solid ${sidebarBorder}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center font-extrabold text-white text-sm tracking-widest flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            FIN
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white text-sm tracking-wide leading-none truncate"
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                Commercial
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
                style={{ color: '#4b5563' }}>
                SLA Compliance
              </span>
            </div>
          )}
        </div>

        {!isOpenMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg cursor-pointer transition-colors flex-shrink-0"
            style={{
              border: '1px solid #1f2937',
              background: 'rgba(31,41,55,0.4)',
              color: '#6b7280',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#d1d5db'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium select-none cursor-pointer transition-all duration-200 group"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(37,99,235,0.85), rgba(29,78,216,0.75))'
                  : 'transparent',
                color: isActive ? '#ffffff' : '#9ca3af',
                boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
                fontWeight: isActive ? '600' : '500',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(31,41,55,0.5)';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
              aria-pressed={isActive}
            >
              <Icon
                size={17}
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ color: isActive ? '#ffffff' : '#6b7280' }}
              />
              {!isCollapsed && (
                <span className="truncate flex items-center gap-1.5">
                  {item.label}
                  {item.isLive && (
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0" title="Live status active">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </span>
              )}

              {/* Active left accent */}
              {isActive && (
                <div
                  className="absolute left-0 w-0.5 h-6 rounded-r-full"
                  style={{ background: '#60a5fa' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User Footer ── */}
      <div
        className="p-4 select-none"
        style={{ borderTop: `1px solid ${sidebarBorder}`, background: 'rgba(5,7,12,0.4)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm uppercase flex-shrink-0"
            style={{
              background: 'rgba(37,99,235,0.15)',
              border: '1px solid rgba(37,99,235,0.25)',
              color: '#60a5fa',
            }}
          >
            {user.avatar || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">{user.name || 'User'}</p>
              <p className="text-[10px] truncate mt-0.5" style={{ color: '#4b5563' }}>
                {user.role || 'Guest'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg cursor-pointer transition-colors flex-shrink-0"
              style={{ color: '#6b7280' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fb7185'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              aria-label="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block h-screen sticky top-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-[70px]' : 'w-60'
        }`}
        style={{ position: 'relative' }}
      >
        {sidebarContent}
      </div>

      {/* Mobile Slide-over */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(5,7,12,0.75)' }}
            onClick={() => setIsOpenMobile(false)}
          />
          <div
            className="relative flex flex-col w-60 h-full shadow-2xl animate-slide-in"
            style={{ background: sidebarBg }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
