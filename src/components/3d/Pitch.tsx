// Pitch.tsx – Green ground with penalty-spot markings
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export default function Pitch() {
  return (
    <group>
      {/* ── Ground plane (physics floor) ─────────────── */}
      <RigidBody type="fixed" colliders="cuboid" friction={0.8} restitution={0.4}>
        {/* Cuboid collider needs a visible mesh child OR explicit args */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 14]} />
          <meshStandardMaterial
            color="#1a4a1a"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </RigidBody>

      {/* ── Centre stripe (subtle pitch pattern) ─────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#1e5a1e" roughness={0.95} transparent opacity={0.6} />
      </mesh>

      {/* ── Goal area box – white lines ──────────────── */}
      {/* Front line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -3.8]}>
        <planeGeometry args={[4.5, 0.06]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
      </mesh>
      {/* Left line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.22, 0.002, -4.9]}>
        <planeGeometry args={[0.06, 2.2]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
      </mesh>
      {/* Right line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.22, 0.002, -4.9]}>
        <planeGeometry args={[0.06, 2.2]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
      </mesh>

      {/* ── Penalty spot ─────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.5]}>
        <circleGeometry args={[0.09, 24]} />
        <meshStandardMaterial color="#ffffff" opacity={0.85} transparent />
      </mesh>

      {/* ── Penalty arc (D) ───────────────────────────── */}
      {(() => {
        const arcPoints: THREE.Vector3[] = [];
        for (let i = 0; i <= 40; i++) {
          const angle = (Math.PI / 40) * i;
          arcPoints.push(new THREE.Vector3(
            Math.cos(Math.PI + angle) * 1.8,
            0,
            Math.sin(Math.PI + angle) * 1.8 + 1.5,
          ));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(arcPoints);
        return (
          <line geometry={geo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </line>
        );
      })()}
    </group>
  );
}
