// Goal.tsx – 3D goal post with physics colliders
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import { useRef } from 'react';

interface GoalProps {
  onGoal: () => void;
}

const POST_COLOR = '#FFFFFF';
const NET_COLOR  = '#88ff88';

// Reusable post mesh
function Post({ args, position }: { args: [number,number,number]; position: [number,number,number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={POST_COLOR} metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

export default function Goal({ onGoal }: GoalProps) {
  const sensorRef = useRef<RapierRigidBody>(null!);

  // Dimensions
  const W  = 3.2;  // inner width of goal
  const H  = 2.0;  // height to crossbar
  const D  = 0.1;  // post thickness
  const dD = 1.0;  // depth of goal (net)

  return (
    <group position={[0, 0, -6]}>
      {/* ── FRAME (static physics) ─────────────────────────── */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Left post */}
        <Post args={[D, H, D]} position={[-(W / 2), H / 2, 0]} />
        {/* Right post */}
        <Post args={[D, H, D]} position={[W / 2, H / 2, 0]} />
        {/* Crossbar */}
        <Post args={[W + D, D, D]} position={[0, H, 0]} />
      </RigidBody>

      {/* ── NET – decorative lines only (no physics needed) ─── */}
      {/* Back net panel */}
      <mesh position={[0, H / 2, -dD / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          color={NET_COLOR} transparent opacity={0.15}
          side={2} wireframe={false}
        />
      </mesh>
      {/* Back net wireframe for the "mesh" look */}
      <mesh position={[0, H / 2, -dD / 2 - 0.01]}>
        <planeGeometry args={[W, H, 6, 4]} />
        <meshStandardMaterial color={NET_COLOR} wireframe transparent opacity={0.35} />
      </mesh>

      {/* ── GOAL SENSOR (invisible trigger) ────────────────── */}
      {/* Positioned just behind the goal line */}
      <RigidBody
        ref={sensorRef}
        type="fixed"
        sensor
        onIntersectionEnter={onGoal}
      >
        <CuboidCollider args={[W / 2, H / 2, 0.3]} position={[0, H / 2, -0.5]} />
      </RigidBody>
    </group>
  );
}
