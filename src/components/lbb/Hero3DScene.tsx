import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

// Placeholder sneaker-ish silhouette using primitive geometry.
// Replace with a real .glb via useGLTF("/models/sneaker.glb")
function Sneaker() {
  const g = useRef<Group>(null);
  useFrame(() => {
    if (g.current) g.current.rotation.y += 0.003;
  });
  return (
    <group ref={g} position={[0, -0.2, 0]}>
      {/* sole */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[2.2, 0.25, 0.9]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* body */}
      <mesh position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.42, 1.5, 8, 20]} />
        <meshStandardMaterial color="#E8001D" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* toe cap */}
      <mesh position={[0.85, -0.15, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#E8001D" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* heel accent */}
      <mesh position={[-0.85, 0.05, 0]} castShadow>
        <boxGeometry args={[0.35, 0.55, 0.85]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 4.5], fov: 40 }}
      dpr={[1, 2]}
      style={{ pointerEvents: "auto" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow />
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.6}>
        <Sneaker />
      </Float>
      <ContactShadows position={[0, -0.9, 0]} opacity={0.4} blur={2} scale={6} />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} enableDamping />
    </Canvas>
  );
}
