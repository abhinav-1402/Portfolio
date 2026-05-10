// Ball.tsx – Football with Rapier physics and shoot-on-click logic
import { useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import type { HeightOption, DirectionOption } from '../components/ShootControls';

export interface BallHandle {
  reset: () => void;
}

interface BallProps {
  onShoot?:   () => void;
  power?:     number;        // 1–5
  height?:    HeightOption;  // 'low' | 'mid' | 'top'
  direction?: DirectionOption; // 'left' | 'centre' | 'right'
}

// Ball start position (penalty spot)
const START_POS: [number, number, number] = [0, 0.22, 1.5];

const Ball = forwardRef<BallHandle, BallProps>(function Ball(
  { onShoot, power = 3, height = 'mid', direction = 'centre' },
  ref,
) {
  const rigidRef = useRef<RapierRigidBody>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/models/football.glb');

  // ✅ Clone ONCE — not on every re-render
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const [shot, setShot] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Expose reset() handle to parent scene
  useImperativeHandle(ref, () => ({
    reset() {
      if (!rigidRef.current) return;
      rigidRef.current.setTranslation(
        { x: START_POS[0], y: START_POS[1], z: START_POS[2] },
        true,
      );
      rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      setShot(false);
    },
  }));

  // Spin the ball while in flight
  useFrame(() => {
    if (shot && groupRef.current) {
      groupRef.current.rotation.x -= 0.08;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (shot || !rigidRef.current) return;

    // ── Map controls to impulse values ─────────────────────────────────────
    // Power 1-5 → Z force -1.0 to -3.5
    const zForce = -(1.0 + (power - 1) * 0.625);

    // Height: low stays near ground, mid is sweet spot, top aims for crossbar
    const yForce = height === 'low' ? 0.1 : height === 'mid' ? 0.6 : 0.8;

    // Direction: maps to X offset
    const xForce = direction === 'left' ? -0.4 : direction === 'right' ? 0.4 : 0;

    const impulse = new THREE.Vector3(xForce, yForce, zForce);

    rigidRef.current.applyImpulse(impulse, true);
    setShot(true);
    onShoot?.();
  };

  return (
    <RigidBody
      ref={rigidRef}
      colliders="ball"
      restitution={0.5}
      friction={0.5}
      linearDamping={0.4}
      angularDamping={0.4}
      position={START_POS}
    >
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = shot ? 'default' : 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {/* ✅ Memoized clone — stable across re-renders */}
        <primitive
          object={clonedScene}
          scale={hovered && !shot ? 0.6 : 0.55}
        />

        {/* Green glow ring under the ball — only visible before the shot */}
        {!shot && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]}>
            <ringGeometry args={[0.22, 0.32, 32]} />
            <meshStandardMaterial
              color="#08CB00"
              transparent
              opacity={hovered ? 0.55 : 0.25}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
});

export default Ball;
