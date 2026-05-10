// PenaltyShootout.tsx – Full physics scene: pitch + goal + ball + lights
import { useRef, useState, useCallback } from 'react';
import { Physics } from '@react-three/rapier';
import { Environment } from '@react-three/drei';
import Goal from '../components/3d/Goal';
import Pitch from '../components/3d/Pitch';
import Ball from '../components/3d/Ball';
import type { BallHandle } from '../components/3d/Ball';

import type { HeightOption, DirectionOption } from '../components/ShootControls';

interface PenaltyShootoutProps {
  onGoal?:    () => void;
  onReset?:   () => void;
  onShoot?:   () => void;
  power?:     number;
  height?:    HeightOption;
  direction?: DirectionOption;
}

export default function PenaltyShootout({
  onGoal, onReset, onShoot,
  power = 3, height = 'mid', direction = 'centre',
}: PenaltyShootoutProps) {
  const ballRef = useRef<BallHandle>(null!);

  const handleGoal = useCallback(() => {
    onGoal?.();
    // Auto-reset ball after brief celebration delay
    setTimeout(() => {
      ballRef.current?.reset();
    }, 2000);
  }, [onGoal]);

  const handleReset = useCallback(() => {
    ballRef.current?.reset();
    onReset?.();
  }, [onReset]);

  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* ── Lighting ────────────────────────────────────── */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Rim light from behind (stadium look) */}
      <pointLight position={[0, 6, -8]} intensity={1.8} color="#d4f5d4" />
      <pointLight position={[-4, 3, 2]}  intensity={0.8} color="#ffffff" />
      <Environment preset="night" />

      {/* ── Scene ────────────────────────────────────────── */}
      <Pitch />
      <Goal onGoal={handleGoal} />
      <Ball ref={ballRef} onShoot={onShoot} power={power} height={height} direction={direction} />
    </Physics>
  );
}
