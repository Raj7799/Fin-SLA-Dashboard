import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Deterministic pseudo-random based on seed (avoids hydration mismatches)
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate stable particle data (only computed once)
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left:     `${seededRand(i * 3) * 100}%`,
      width:    `${2 + seededRand(i * 7) * 4}px`,
      height:   `${2 + seededRand(i * 7) * 4}px`,
      delay:    `${seededRand(i * 11) * 20}s`,
      duration: `${18 + seededRand(i * 13) * 22}s`,
      opacity:  seededRand(i * 5) * 0.4 + 0.1,
      isSquare: i % 3 === 0,
    }));
  }, []);

  // Generate stable orb data
  const orbs = useMemo(() => [
    { x: '15%',  y: '20%',  size: '500px', color: 'var(--orb-1)', duration: '25s', delay: '0s' },
    { x: '75%',  y: '60%',  size: '600px', color: 'var(--orb-2)', duration: '32s', delay: '8s' },
    { x: '45%',  y: '80%',  size: '350px', color: 'var(--orb-3)', duration: '20s', delay: '4s' },
  ], []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* === Deep Shifting Mesh Background === */}
      <div
        className="absolute inset-0 animate-mesh-shift login-mesh"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(125deg, #020617 0%, #0b1b3a 28%, #0c2744 52%, #042f2e 78%, #020617 100%)'
            : 'linear-gradient(125deg, #f1f5f9 0%, #e2e8f0 35%, #cbd5e1 65%, #f1f5f9 100%)',
          backgroundSize: '220% 220%',
          opacity: 0.95,
        }}
      />

      {/* === Perspective 3D Grid Floor === */}
      <div
        className="absolute inset-0 animate-grid-pan"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'perspective(700px) rotateX(52deg) scale(1.85) translateY(12%)',
          transformOrigin: 'center 85%',
          opacity: isDark ? 0.16 : 0.12,
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent 78%)',
        }}
      />

      {/* === Drifting radial orbs === */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-orb-drift"
          style={{
            left: orb.x,
            top:  orb.y,
            width:  orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            animationDuration: orb.duration,
            animationDelay:    orb.delay,
            filter: 'blur(4px)',
            opacity: isDark ? 0.7 : 0.4,
          }}
        />
      ))}

      {/* === Floating particles === */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bottom-0 animate-float-up pointer-events-none"
          style={{
            left:              p.left,
            width:             p.width,
            height:            p.height,
            opacity:           p.opacity,
            animationDuration: p.duration,
            animationDelay:    p.delay,
            background:        isDark
              ? `rgba(59, 130, 246, ${p.opacity})`
              : `rgba(37, 99, 235, ${p.opacity * 0.5})`,
            borderRadius:      p.isSquare ? '2px' : '50%',
            transform:         p.isSquare ? 'rotate(45deg)' : undefined,
            boxShadow:         isDark ? `0 0 8px rgba(59, 130, 246, ${p.opacity})` : 'none',
          }}
        />
      ))}

      {/* === Subtle top-edge glow bar === */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, var(--brand-blue), transparent)`,
          opacity: isDark ? 0.35 : 0.2,
        }}
      />
    </div>
  );
}
