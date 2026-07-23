import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF, Center } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import heroAsset from "@/assets/lbb-hero.glb.asset.json";

function Model() {
  const { scene } = useGLTF(heroAsset.url);
  const g = useRef<Group>(null);
  useFrame(() => {
    if (g.current) g.current.rotation.y += 0.004;
  });
  return (
    <group ref={g}>
      <Center>
        <primitive object={scene} scale={1.6} />
      </Center>
    </group>
  );
}

// preload
try { useGLTF.preload(heroAsset.url); } catch {}

export default function Hero3DScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} castShadow />
      <pointLight position={[-3, 2, -2]} intensity={0.8} color="#E8001D" />
      <Suspense fallback={null}>
        <Model />
        <Environment preset="city" />
      </Suspense>
      <ContactShadows position={[0, -1, 0]} opacity={0.35} blur={2.5} scale={6} />
      <OrbitControls enableZoom={false} enablePan={false} enableDamping autoRotate={false} />
    </Canvas>
  );
}
