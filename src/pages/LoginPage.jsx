import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, ShieldAlert, Lock, Mail, Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';
import mockUsers from '../data/mockUsers.json';

/* ── deterministic pseudo-random so positions are stable ── */
function sr(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ── Animated floating particle ── */
function Particle({ i }) {
  const left     = `${sr(i * 3) * 100}%`;
  const size     = 2 + sr(i * 7) * 5;
  const delay    = sr(i * 11) * 24;
  const duration = 18 + sr(i * 13) * 22;
  const isSquare = i % 4 === 0;
  const isDiamond = i % 4 === 2;

  return (
    <div
      className="absolute bottom-0 animate-float-up pointer-events-none"
      style={{
        left,
        width:  `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay:    `${delay}s`,
        background: i % 3 === 0
          ? 'rgba(37, 99, 235, 0.6)'
          : i % 3 === 1
          ? 'rgba(13, 148, 136, 0.4)'
          : 'rgba(16, 185, 129, 0.35)',
        borderRadius: isSquare ? '2px' : isDiamond ? '0' : '50%',
        transform:    isDiamond ? 'rotate(45deg)' : isSquare ? 'rotate(20deg)' : undefined,
        opacity: 0.5 + sr(i * 5) * 0.4,
      }}
    />
  );
}

/* ── Animated SVG data-flow network ── */
function DataFlowSVG() {
  return (
    <svg viewBox="0 0 420 130" className="w-full" aria-hidden="true">
      {/* Background track paths */}
      <path d="M 30 65 Q 105 25 190 65 T 390 65" fill="none" stroke="rgba(31,41,55,0.8)" strokeWidth="1.5" />
      <path d="M 30 65 Q 105 100 190 65 T 390 65" fill="none" stroke="rgba(31,41,55,0.5)" strokeWidth="1" />

      {/* Animated data flow — primary blue line */}
      <path
        d="M 30 65 Q 105 25 190 65 T 390 65"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray="12 6"
        className="animate-dash-flow"
        style={{ animationDuration: '8s' }}
      />
      {/* Secondary teal line flowing opposite */}
      <path
        d="M 30 65 Q 105 100 190 65 T 390 65"
        fill="none"
        stroke="#0d9488"
        strokeWidth="1.5"
        strokeDasharray="8 8"
        className="animate-dash-reverse"
        style={{ animationDuration: '12s' }}
      />

      {/* Vertical connector lines */}
      <line x1="190" y1="45" x2="190" y2="85" stroke="rgba(37,99,235,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="310" y1="55" x2="310" y2="80" stroke="rgba(13,148,136,0.3)" strokeWidth="1" strokeDasharray="3 3" />

      {/* Animated pulsing nodes */}
      <circle cx="30"  cy="65" r="6" fill="#05070c" stroke="#10b981" strokeWidth="2" />
      <circle cx="30"  cy="65" r="3" fill="#10b981">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>

      <circle cx="110" cy="40" r="6" fill="#05070c" stroke="#2563eb" strokeWidth="2" />
      <circle cx="110" cy="40" r="3" fill="#2563eb">
        <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite" />
      </circle>

      <circle cx="190" cy="65" r="6" fill="#05070c" stroke="#10b981" strokeWidth="2" />
      <circle cx="190" cy="65" r="3" fill="#10b981">
        <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" />
      </circle>

      <circle cx="270" cy="85" r="7" fill="#05070c" stroke="#f59e0b" strokeWidth="2">
        <animate attributeName="stroke-opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="270" cy="85" r="3.5" fill="#f59e0b">
        <animate attributeName="r" values="3.5;6;3.5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
      </circle>

      <circle cx="390" cy="65" r="6" fill="#05070c" stroke="#2563eb" strokeWidth="2" />
      <circle cx="390" cy="65" r="3" fill="#2563eb">
        <animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Node labels */}
      <text x="30"  y="84"  fill="#6b7280" fontSize="8.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">Ingestion</text>
      <text x="110" y="22"  fill="#6b7280" fontSize="8.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">Day 1 Cutoff</text>
      <text x="190" y="84"  fill="#6b7280" fontSize="8.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">Compute</text>
      <text x="270" y="104" fill="#f59e0b" fontSize="8.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700">RCA Incident</text>
      <text x="390" y="84"  fill="#6b7280" fontSize="8.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">Reporting</text>
    </svg>
  );
}

/* ── Rotating geometric ring ── */
function GeometricRing({ size, duration, color, reverse, style }) {
  return (
    <div
      className={reverse ? 'animate-spin-reverse' : 'animate-spin-slow'}
      style={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        borderRadius: '50%',
        animationDuration: duration,
        ...style,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════ */
export default function LoginPage({ onLoginSuccess }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError]   = useState('');

  // Stable particle indices
  const particleIndices = useMemo(() => Array.from({ length: 22 }, (_, i) => i), []);

  const validateForm = () => {
    const e = {};
    if (!username)                         e.username = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(username)) e.username = 'Enter a valid email address';
    if (!password)                         e.password = 'Password is required';
    else if (password.length < 6)          e.password = 'Minimum 6 characters required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.username === username.trim() && u.password === password
      );
      setIsSubmitting(false);
      if (user) onLoginSuccess(user);
      else setLoginError('Invalid credentials. Hint: admin@fin.com / password123');
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: isDark ? '#05070c' : '#f0f4f8', color: 'var(--text-primary)' }}
    >
      {/* ══ Theme toggle (top-right corner) ══ */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-xl border transition-all duration-300 cursor-pointer"
        style={{
          background: isDark ? 'rgba(17,24,39,0.8)' : 'rgba(255,255,255,0.8)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-secondary)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* ══════════════════════════════════════
          LEFT PANEL — 3D Animated Branding
      ══════════════════════════════════════ */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #05070c 0%, #0b0f19 50%, #0d1a2e 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2044 100%)',
        }}
      >
        {/* ── Perspective 3D grid plane ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(600px) rotateX(25deg) scale(1.5)',
            transformOrigin: 'center 80%',
            opacity: 0.6,
          }}
        />

        {/* ── Top radial fade overlay ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(5,7,12,0.9) 0%, transparent 100%)',
          }}
        />

        {/* ── Large drifting orbs ── */}
        <div
          className="absolute animate-orb-drift pointer-events-none"
          style={{ top: '10%', left: '5%', width: '380px', height: '380px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
            borderRadius: '50%', animationDuration: '22s', animationDelay: '0s' }}
        />
        <div
          className="absolute animate-orb-drift pointer-events-none"
          style={{ bottom: '5%', right: '5%', width: '450px', height: '450px',
            background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)',
            borderRadius: '50%', animationDuration: '30s', animationDelay: '10s' }}
        />
        <div
          className="absolute animate-breathe pointer-events-none"
          style={{ top: '40%', right: '15%', width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            borderRadius: '50%', animationDuration: '15s', animationDelay: '5s' }}
        />

        {/* ── Floating particles ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particleIndices.map(i => <Particle key={i} i={i} />)}
        </div>

        {/* ── Rotating geometric rings (top-right) ── */}
        <div className="absolute top-8 right-8 pointer-events-none" style={{ opacity: 0.15 }}>
          <GeometricRing size="100px" duration="30s" color="rgba(37,99,235,0.6)" reverse={false} />
          <div style={{ position: 'absolute', inset: '15px' }}>
            <GeometricRing size="70px" duration="20s" color="rgba(13,148,136,0.6)" reverse={true} />
          </div>
        </div>

        {/* ── Rotating geometric rings (bottom-left) ── */}
        <div className="absolute bottom-8 left-8 pointer-events-none" style={{ opacity: 0.12 }}>
          <GeometricRing size="80px" duration="25s" color="rgba(16,185,129,0.6)" reverse={true} />
        </div>

        {/* ── Corner accent brackets ── */}
        <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none opacity-25"
          style={{ borderTop: '2px solid #2563eb', borderLeft: '2px solid #2563eb' }} />
        <div className="absolute bottom-6 right-6 w-8 h-8 pointer-events-none opacity-25"
          style={{ borderBottom: '2px solid #2563eb', borderRight: '2px solid #2563eb' }} />

        {/* ── Main content ── */}
        <div className="relative z-10 max-w-lg select-none text-left">
          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            style={{
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.25)',
              color: '#60a5fa',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            SLA Compliance Platform
          </div>

          <h1
            className="font-extrabold tracking-tight leading-[1.1] mb-5"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}
          >
            FIN{' '}
            <span style={{ color: '#3b82f6' }}>Commercial</span>
            <br />SLA Compliance.
          </h1>

          <p className="text-base font-medium leading-relaxed mb-10" style={{ color: '#94a3b8' }}>
            Enterprise operational visibility for Finance &amp; Commercial teams — SLA tracking,
            root-cause analysis, and daily execution performance.
          </p>

          {/* Data-flow SVG card */}
          <div
            className="rounded-xl p-5 shadow-2xl"
            style={{
              background: 'rgba(5,7,12,0.7)',
              border: '1px solid rgba(31,41,55,0.8)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">
              Live Pipeline Monitor
            </p>
            <DataFlowSVG />
          </div>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'SLA Target',    value: '95%',   color: '#60a5fa' },
              { label: 'Execution Runs', value: '508+',  color: '#34d399' },
              { label: 'Tracked Since', value: 'Mar 26', color: '#fbbf24' },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-lg p-3 text-center"
                style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(31,41,55,0.6)' }}
              >
                <p className="font-extrabold text-lg" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>
                  {s.value}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: '#6b7280' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════ */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative"
        style={{ background: isDark ? 'rgba(11,15,25,0.5)' : 'rgba(240,244,248,0.95)' }}
      >
        {/* Subtle right-panel animated glow */}
        <div
          className="absolute pointer-events-none animate-breathe"
          style={{
            top: '30%', right: '10%',
            width: '300px', height: '300px',
            background: isDark
              ? 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animationDuration: '18s',
          }}
        />

        <div
          className="w-full max-w-md rounded-2xl p-8 shadow-2xl animate-fade-in"
          style={{
            background: isDark ? 'rgba(5,7,12,0.9)' : 'rgba(255,255,255,0.95)',
            border: `1px solid ${isDark ? 'rgba(17,24,39,0.8)' : 'rgba(203,213,225,0.8)'}`,
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo + Header */}
          <div className="mb-8 text-center select-none">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center font-black text-white text-lg mx-auto mb-4"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              FIN
            </div>
            <h2
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-heading)', fontFamily: 'Outfit, sans-serif' }}
            >
              Secure Operations Login
            </h2>
            <p className="text-xs font-medium mt-2" style={{ color: 'var(--text-muted)' }}>
              Enter your credentials to access the compliance system
            </p>
          </div>

          {/* Error alert */}
          {loginError && (
            <div
              className="p-3.5 rounded-lg text-xs font-semibold flex items-start gap-2.5 mb-5 animate-shake"
              style={{
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.2)',
                color: '#fb7185',
              }}
            >
              <ShieldAlert size={15} className="flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email / Username"
              id="login-email"
              type="text"
              placeholder="admin@fin.com"
              value={username}
              onChange={e => setUsername(e.target.value)}
              error={errors.username}
              icon={<Mail size={15} />}
              disabled={isSubmitting}
            />

            <div className="relative">
              <Input
                label="Password"
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={15} />}
                disabled={isSubmitting}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 cursor-pointer"
                style={{ top: errors.password ? '34px' : '34px', color: 'var(--text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs select-none pt-1">
              <label
                className="flex items-center gap-2 cursor-pointer font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded cursor-pointer"
                  style={{ accentColor: '#2563eb' }}
                />
                Remember this terminal
              </label>
              <button
                type="button"
                className="font-semibold cursor-pointer hover:underline"
                style={{ color: '#3b82f6' }}
                onClick={() => alert('Contact Fin Operations Support to reset password.')}
              >
                Forgot credentials?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2 text-sm font-bold tracking-wide"
              isLoading={isSubmitting}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-[10px] mt-5 font-medium" style={{ color: 'var(--text-muted)' }}>
            Demo credentials: <span style={{ color: '#3b82f6' }}>admin@fin.com</span> / password123
          </p>
        </div>
      </div>
    </div>
  );
}
