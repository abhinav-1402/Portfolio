// Ball.tsx – Football with Rapier physics and shoot-on-click logic
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export interface BallHandle {
  reset: () => void;
}

interface BallProps {
  onShoot?: () => void;
}

// Ball start position (penalty spot)
const START_POS: [number, number, number] = [0, 0.22, 1.5];

const Ball = forwardRef<BallHandle, BallProps>(function Ball({ onShoot }, ref) {
  const rigidRef = useRef<RapierRigidBody>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/models/football.glb');
  const { camera } = useThree();

  const [shot, setShot] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Expose reset to parent
  useImperativeHandle(ref, () => ({
    reset() {
      if (!rigidRef.current) return;
      rigidRef.current.setTranslation({ x: START_POS[0], y: START_POS[1], z: START_POS[2] }, true);
      rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      setShot(false);
    },
  }));

  // Rotate the ball while in flight
  useFrame(() => {
    if (shot && groupRef.current) {
      groupRef.current.rotation.x -= 0.08;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (shot || !rigidRef.current) return;

    // Aim slightly toward goal with a realistic arc
    // Add small random horizontal spread for fun
    const spread = (Math.random() - 0.5) * 1.6;
    const impulse = new THREE.Vector3(spread, 4.5, -14);

    rigidRef.current.applyImpulse(impulse, true);
    setShot(true);
    onShoot?.();
  };

  return (
    <RigidBody
      ref={rigidRef}
      colliders="ball"
      restitution={0.6}
      friction={0.5}
      linearDamping={0.3}
      angularDamping={0.3}
      position={START_POS}
    >
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true);  document.body.style.cursor = shot ? 'default' : 'pointer'; }}
        onPointerOut={() =>  { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <primitive
          object={scene.clone()}
          scale={shot ? 0.55 : hovered ? 0.6 : 0.55}
        />
        {/* Subtle glow ring under the ball when hoverable */}
        {!shot && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]}>
            <ringGeometry args={[0.22, 0.32, 32]} />
            <meshStandardMaterial
              color="#08CB00" transparent opacity={hovered ? 0.55 : 0.25}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
});

export default Ball;
