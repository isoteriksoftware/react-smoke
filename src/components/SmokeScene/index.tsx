import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Smoke, SmokeProps } from "../Smoke";
import smokeImage from "../../core/assets/smoke-default.png";
import * as THREE from "three";
import { OrbitControls, Stats } from "@react-three/drei";

export const SmokeScene = (props: Omit<SmokeProps, "textures">) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
      }}
    >
      <Canvas
        camera={{ fov: 60, position: [0, 0, 1200], far: 6000 }}
        scene={{
          background: new THREE.Color("black"),
        }}
      >
        <directionalLight color="white" intensity={2} position={[-1, 0, 1]} />
        <ambientLight color="white" intensity={2} />

        <Suspense fallback={null}>
          <Smoke {...props} textures={[smokeImage]} />
        </Suspense>

        <Stats />

        <OrbitControls
          enableDamping={true}
          enableZoom={true}
          dampingFactor={0.01}
          autoRotate={false}
          autoRotateSpeed={-1}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 - 0.01}
        />
      </Canvas>
    </div>
  );
};
