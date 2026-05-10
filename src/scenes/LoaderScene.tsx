import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Group } from "three";

export default function LoaderScene() {
  const modelRef = useRef<Group>(null!);

  const { scene } = useGLTF("/models/football.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 2, 2]} intensity={2} />
    <Environment preset="night" />
      <primitive
        ref={modelRef}
        object={scene}
        scale={2}
        position={[0, 0, 0]}
      />
    </>
  );
}