import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, ShieldAlert, Lock, Mail, Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';
import mockUsers from '../data/mockUsers.json';

function sr(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function Particle({ i }) {
  const left = `${sr(i * 3) * 100}%`;
  const size = 2 + sr(i * 7) * 6;
  const delay = sr(i * 11) * 24;
  const duration = 16 + sr(i * 13) * 20;
  const hues = [
    'rgba(59,130,246,0.7)',
    'rgba(34,211,238,0.55)',
    'rgba(16,185,129,0.5)',
  ];

  return (
    <div
      className="absolute bottom-0 animate-float-up pointer-events-none"
      style={{
        left,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        background: hues[i % 3],
        borderRadius: i % 4 === 0 ? '2px' : '50%',
        boxShadow: `0 0 10px ${hues[i % 3]}`,
        opacity: 0.45 + sr(i * 5) * 0.4,
      }}
    />
  );
}

function HeroCore() {
  const rings = [
    { inset: 0, color: 'rgba(59,130,246,0.55)', width: 2 },
    { inset: 28, color: 'rgba(34,211,238,0.4)', width: 1.5 },
    { inset: 56, color: 'rgba(16,185,129,0.35)', width: 1.5 },
    { inset: 88, color: 'rgba(147,197,253,0.25)', width: 1 },
  ];

  return (
    <div className="relative w-[min(52vw,480px)] aspect-square preserve-3d">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full animate-glow-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(34,211,238,0.18) 38%, transparent 70%)',
        }}
      />

      <div className="absolute inset-0 preserve-3d animate-rotate-y-3d">
        {rings.map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: ring.inset,
              border: `${ring.width}px solid ${ring.color}`,
              boxShadow: `0 0 24px ${ring.color}, inset 0 0 18px ${ring.color}`,
              transform: `rotateX(${66 + i * 4}deg)`,
            }}
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full"
            style={{
              background: deg % 120 === 0 ? '#22d3ee' : '#3b82f6',
              boxShadow: '0 0 16px currentColor',
              transform: `rotateY(${deg}deg) translateZ(210px)`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-[18%] rounded-full animate-rotate-z-tilt pointer-events-none"
        style={{
          border: '1px dashed rgba(148,163,184,0.25)',
          boxShadow: 'inset 0 0 40px rgba(37,99,235,0.12)',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none">
        <span
          className="login-gradient-text font-black leading-none tracking-tighter"
          style={{ fontSize: 'clamp(5.5rem, 12vw, 8.5rem)', fontFamily: 'Outfit, sans-serif' }}
        >
          95
        </span>
        <span
          className="mt-1 text-[11px] font-bold uppercase tracking-[0.42em]"
          style={{ color: 'rgba(147,197,253,0.7)' }}
        >
          SLA
        </span>
      </div>
    </div>
  );
}

function FloatChip({ value, accent, className, delay }) {
  return (
    <div
      className={`absolute animate-float-3d rounded-2xl px-5 py-4 select-none ${className}`}
      style={{
        animationDelay: delay,
        background: 'linear-gradient(160deg, rgba(15,23,42,0.85), rgba(5,7,12,0.55))',
        border: `1px solid ${accent}55`,
        boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 28px ${accent}22`,
        backdropFilter: 'blur(16px)',
        transform: 'translateZ(80px)',
      }}
    >
      <p
        className="font-black text-3xl leading-none"
        style={{ color: accent, fontFamily: 'Outfit, sans-serif' }}
      >
        {value}
      </p>
    </div>
  );
}

function PipelineOrbs() {
  const nodes = [
    { color: '#34d399', glow: 'rgba(52,211,153,0.55)' },
    { color: '#3b82f6', glow: 'rgba(59,130,246,0.55)' },
    { color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
    { color: '#22d3ee', glow: 'rgba(34,211,238,0.5)' },
  ];

  return (
    <div className="relative mt-8 w-full max-w-md h-16">
      <div
        className="absolute left-[8%] right-[8%] top-1/2 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), rgba(34,211,238,0.7), rgba(16,185,129,0.8), transparent)',
          boxShadow: '0 0 12px rgba(59,130,246,0.45)',
        }}
      />
      <div
        className="absolute left-[8%] right-[8%] top-1/2 h-px animate-dash-flow"
        style={{
          background: 'linear-gradient(90deg, transparent, #fff, transparent)',
          opacity: 0.35,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-[6%]">
        {nodes.map((n, i) => (
          <div
            key={i}
            className="relative w-9 h-9 rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 30%, #fff, ${n.color} 42%, #05070c 78%)`,
              boxShadow: `0 8px 24px ${n.glow}, 0 0 0 6px ${n.glow.replace('0.5', '0.12').replace('0.55', '0.12')}`,
              animation: 'breathe 3.2s ease-in-out infinite',
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LoginPage({ onLoginSuccess }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const particleIndices = useMemo(() => Array.from({ length: 28 }, (_, i) => i), []);

  const validateForm = () => {
    const e = {};
    if (!username) e.username = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(username)) e.username = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters required';
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
        (u) => u.username === username.trim() && u.password === password
      );
      setIsSubmitting(false);
      if (user) onLoginSuccess(user);
      else setLoginError('Invalid credentials. Hint: admin@fin.com / password123');
    }, 1500);
  };

  const onSceneMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: isDark ? '#030712' : '#e8eef6', color: 'var(--text-primary)' }}
    >
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

      <div
        className="hidden lg:flex w-[58%] relative overflow-hidden items-center justify-center"
        onMouseMove={onSceneMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div
          className="absolute inset-0 animate-mesh-shift login-mesh"
          style={{
            backgroundImage:
              'linear-gradient(125deg, #020617 0%, #0b1b3a 28%, #0c2744 52%, #042f2e 78%, #020617 100%)',
          }}
        />
        <div
          className="absolute inset-0 animate-grid-pan"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'perspective(700px) rotateX(52deg) scale(1.85) translateY(12%)',
            transformOrigin: 'center 85%',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent 78%)',
          }}
        />
        <div
          className="absolute -top-24 -left-16 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.28) 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full pointer-events-none animate-orb-drift"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)',
            animationDuration: '26s',
          }}
        />
        <div
          className="absolute top-1/3 right-[12%] w-[240px] h-[240px] rounded-full pointer-events-none animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 70%)',
            animationDuration: '12s',
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particleIndices.map((i) => (
            <Particle key={i} i={i} />
          ))}
        </div>

        <div
          className="absolute left-8 top-[18%] select-none pointer-events-none opacity-[0.07]"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(8rem, 18vw, 14rem)',
            lineHeight: 0.8,
            letterSpacing: '-0.08em',
            color: '#fff',
          }}
        >
          FIN
        </div>

        <div
          className="relative z-10 flex flex-col items-center perspective-1200"
          style={{
            transform: `rotateY(${tilt.x * 10}deg) rotateX(${-tilt.y * 7}deg)`,
            transition: 'transform 0.35s ease-out',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="relative">
            <HeroCore />
            <FloatChip
              value="508+"
              accent="#34d399"
              delay="0s"
              className="-left-6 top-10"
            />
            <FloatChip
              value="Mar 26"
              accent="#fbbf24"
              delay="1.2s"
              className="-right-4 bottom-16"
            />
          </div>
          <PipelineOrbs />
        </div>
      </div>

      <div
        className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-12 relative"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(3,7,18,0.4) 0%, rgba(8,15,32,0.92) 100%)'
            : 'linear-gradient(180deg, rgba(241,245,249,0.9), rgba(255,255,255,0.96))',
        }}
      >
        <div
          className="absolute pointer-events-none animate-breathe"
          style={{
            top: '22%',
            right: '8%',
            width: '340px',
            height: '340px',
            background: isDark
              ? 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animationDuration: '16s',
          }}
        />

        <div
          className="w-full max-w-[400px] rounded-2xl p-8 shadow-2xl animate-fade-in login-card-border overflow-hidden"
          style={{
            background: isDark
              ? 'linear-gradient(165deg, rgba(8,15,32,0.95) 0%, rgba(5,7,12,0.92) 100%)'
              : 'linear-gradient(165deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
            backdropFilter: 'blur(22px)',
            transform: `perspective(900px) rotateY(${tilt.x * -4}deg)`,
            transition: 'transform 0.4s ease-out',
          }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 w-16 opacity-20 animate-sheen"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            }}
          />

          <div className="mb-7 text-center select-none">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white text-lg mx-auto mb-5"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #22d3ee 100%)',
                boxShadow: '0 12px 32px rgba(37,99,235,0.45), 0 0 0 8px rgba(37,99,235,0.12)',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              FIN
            </div>
            <h2
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-heading)', fontFamily: 'Outfit, sans-serif' }}
            >
              Sign in
            </h2>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              id="login-email"
              type="text"
              placeholder="admin@fin.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={15} />}
                disabled={isSubmitting}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 cursor-pointer"
                style={{ top: '34px', color: 'var(--text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs select-none pt-1">
              <label
                className="flex items-center gap-2 cursor-pointer font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded cursor-pointer"
                  style={{ accentColor: '#2563eb' }}
                />
                Remember
              </label>
              <button
                type="button"
                className="font-semibold cursor-pointer hover:underline"
                style={{ color: '#3b82f6' }}
                onClick={() => alert('Contact Fin Operations Support to reset password.')}
              >
                Forgot?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2 text-sm font-bold tracking-wide"
              style={{
                background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                boxShadow: '0 12px 28px rgba(37,99,235,0.35)',
              }}
              isLoading={isSubmitting}
            >
              Enter
            </Button>
          </form>

          <p className="text-center text-[10px] mt-5 font-medium" style={{ color: 'var(--text-muted)' }}>
            Demo: <span style={{ color: '#3b82f6' }}>admin@fin.com</span> / password123
          </p>
        </div>
      </div>
    </div>
  );
}
