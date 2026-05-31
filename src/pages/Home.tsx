import { Suspense, useEffect, useRef, useState } from 'react';
import Portfolio from './Portfolio';
import PenaltyShootout from '../scenes/PenaltyShootout';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';
import type { HeightOption, DirectionOption } from '../components/ShootControls';

function Loader({ dark }: { dark: boolean }) {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1,  // ← absolute, z-1 (above canvas z-0, below UI z-10)
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24,
      background: dark ? '#000000' : '#EEEEEE',
      color: dark ? '#EEEEEE' : '#000000',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '1.5px solid rgba(128,128,128,0.2)',
        borderTopColor: 'currentColor',
        animation: 'spin 0.9s linear infinite',
      }} />
      <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.45 }}>
        {Math.round(progress)}%
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Main() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [goals, setGoals]           = useState(0);
  const [shots, setShots]           = useState(0);
  const [showGoalFlash, setShowGoalFlash] = useState(false);
  const [gameKey, setGameKey]       = useState(0);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasScoredThisShot = useRef(false);

  const [power,     setPower]     = useState<number>(3);
  const [height,    setHeight]    = useState<HeightOption>('mid');
  const [direction, setDirection] = useState<DirectionOption>('centre');

  const handleGoal = () => {
    if (hasScoredThisShot.current) return;
    hasScoredThisShot.current = true;
    setGoals(g => g + 1);
    setShowGoalFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setShowGoalFlash(false), 2200);
  };

  const handleShoot = () => {
    hasScoredThisShot.current = false;
    setShots(s => s + 1);
  };

  const handleReset = () => {
    setGameKey(k => k + 1);
    setShots(0);
    setGoals(0);
    hasScoredThisShot.current = false;
  };

  return (
    <div
      className="w-screen h-screen relative transition-colors duration-500 overflow-hidden"
      style={{ background: dark ? '#000000' : '#EEEEEE', color: dark ? '#EEEEEE' : '#000000' }}
    >
      {/* Loader — outside Canvas, disappears when 3D assets are ready */}
      <Loader dark={dark} />

      {/* UI */}
      <div className="absolute inset-0 z-10 overflow-y-auto pointer-events-none">
        <Portfolio
          onShoot={handleShoot}
          power={power}
          height={height}
          direction={direction}
          onPowerChange={setPower}
          onHeightChange={setHeight}
          onDirectionChange={setDirection}
          onReset={handleReset}
        />
      </div>

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0 z-0"
        shadows
        camera={{ position: [0, 2.5, 7], fov: 52 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PenaltyShootout
            key={gameKey}
            onGoal={handleGoal}
            onShoot={handleShoot}
            power={power}
            height={height}
            direction={direction}
          />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <>
        <div
          style={{
            position: 'fixed',
            top: isMobile ? 76 : 64,
            right: isMobile ? 12 : 24,
            zIndex: 50,
            fontFamily: "'Barlow Condensed', sans-serif",
            background: dark ? 'rgba(0,0,0,0.72)' : 'rgba(238,238,238,0.82)',
            border: '1px solid rgba(8,203,0,0.3)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '6px 14px' : '8px 18px',
            lineHeight: 1,
            color: dark ? '#EEEEEE' : '#000',
            pointerEvents: 'none',
            clipPath: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ fontSize: isMobile ? 8 : 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#08CB00', display: 'block', marginBottom: 4 }}>
            Goals scored
          </span>
          <span style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, color: '#08CB00' }}>{goals}</span>
          <span style={{ fontSize: isMobile ? 12 : 14, color: dark ? '#666' : '#888', marginLeft: 4 }}>/ {shots}</span>
        </div>

        {showGoalFlash && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
            animation: 'goalFlash 2.2s ease forwards',
          }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(72px, 14vw, 60px)',
              fontWeight: 900, fontStyle: 'italic',
              textTransform: 'uppercase',
              color: '#08CB00',
              textShadow: '0 0 60px rgba(8,203,0,0.6)',
              letterSpacing: '-0.02em',
            }}>
              GOAL! ⚽
            </span>
          </div>
        )}

        <style>{`
          @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes goalFlash { 0%{opacity:0;transform:scale(.6)} 20%{opacity:1;transform:scale(1.08)} 70%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.05)} }
        `}</style>
      </>
    </div>
  );
}

export default Main;