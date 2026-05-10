import { Suspense, useEffect, useRef, useState } from 'react';
import Portfolio from './Portfolio';
import ThemeToggle from '../components/ThemeToggle';
import LoaderScene from '../scenes/LoaderScene';
import PenaltyShootout from '../scenes/PenaltyShootout';
import { Canvas } from '@react-three/fiber';
import { useTheme } from '../context/ThemeContext';

function Main() {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [goals, setGoals] = useState(0);
  const [showGoalFlash, setShowGoalFlash] = useState(false);
  const [shots, setShots]   = useState(0);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoal = () => {
    setGoals(g => g + 1);
    setShowGoalFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setShowGoalFlash(false), 2200);
  };

  const handleShoot = () => setShots(s => s + 1);

  return (
    <div className="w-screen h-screen relative transition-colors duration-500 overflow-hidden"
      style={{ background: dark ? '#000000' : '#EEEEEE' }}
    >
      <ThemeToggle />

      {/* ── 1. UI (Portfolio) ─────────────────────────────── */}
      {!loading && (
        <div className="absolute inset-0 z-10 overflow-y-auto">
          <Portfolio onShoot={handleShoot} />
        </div>
      )}

      {/* ── 2. 3D Canvas (background) ─────────────────────── */}
      <Canvas
        className="absolute inset-0 z-0"
        shadows
        camera={{ position: [0, 2.5, 7], fov: 52 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        {loading ? (
          <LoaderScene />
        ) : (
          <Suspense fallback={null}>
            <PenaltyShootout onGoal={handleGoal} />
          </Suspense>
        )}
      </Canvas>

      {/* ── 3. HUD overlay (goals / hint) ─────────────────── */}
      {!loading && (
        <>
          {/* Score badge */}
          <div
            style={{
              position: 'fixed', top: 64, right: 24, zIndex: 50,
              fontFamily: "'Barlow Condensed', sans-serif",
              background: dark ? 'rgba(0,0,0,0.72)' : 'rgba(238,238,238,0.82)',
              border: '1px solid rgba(8,203,0,0.3)',
              backdropFilter: 'blur(10px)',
              padding: '8px 18px', lineHeight: 1,
              color: dark ? '#EEEEEE' : '#000',
              pointerEvents: 'none',
              clipPath: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',
            }}
          >
            <span style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#08CB00', display: 'block', marginBottom: 4 }}>
              Goals scored
            </span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#08CB00' }}>{goals}</span>
            <span style={{ fontSize: 14, color: dark ? '#666' : '#888', marginLeft: 4 }}>/ {shots}</span>
          </div>

          {/* Hint label */}
          <div
            style={{
              position: 'fixed', bottom: 28, right: 28, zIndex: 50,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: dark ? 'rgba(8,203,0,0.55)' : 'rgba(37,57,0,0.55)',
              pointerEvents: 'none',
              animation: 'pulse 2.5s ease-in-out infinite',
            }}
          >
            ↗ click the ball to shoot
          </div>

          {/* GOAL! flash */}
          {showGoalFlash && (
            <div
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
                animation: 'goalFlash 2.2s ease forwards',
              }}
            >
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 'clamp(72px, 14vw, 140px)',
                  fontWeight: 900, fontStyle: 'italic',
                  textTransform: 'uppercase',
                  color: '#08CB00',
                  textShadow: '0 0 60px rgba(8,203,0,0.6)',
                  letterSpacing: '-0.02em',
                }}
              >
                GOAL! 🟢
              </span>
            </div>
          )}

          {/* Keyframes for HUD */}
          <style>{`
            @keyframes pulse       { 0%,100%{opacity:.4} 50%{opacity:1} }
            @keyframes goalFlash   { 0%{opacity:0;transform:scale(.6)} 20%{opacity:1;transform:scale(1.08)} 70%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.05)} }
          `}</style>
        </>
      )}
    </div>
  );
}

export default Main;