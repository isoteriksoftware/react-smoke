import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Smoke } from "../Smoke";
import smokeImage from "../../core/assets/smoke-default.png";

export const SmokeScene = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Canvas camera={{ fov: 60, position: [0, 0, 250], far: 6000 }}>
          <directionalLight color="white" intensity={2} position={[-1, 0, 1]} />
          <ambientLight color="red" intensity={2} />

          <Suspense fallback={null}>
            <Smoke textures={[smokeImage]} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
