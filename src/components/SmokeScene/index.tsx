import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Smoke } from "../Smoke";
import * as THREE from "three";
import { SmokeSceneProps } from "./types";

export const SmokeScene = ({
  smoke,
  suspenseFallback,
  disableDefaultLights,
  camera,
  scene,
  ambientLightProps,
  directionalLightProps,
  ...rest
}: SmokeSceneProps) => {
  return (
    <Canvas
      camera={{ fov: 60, position: [0, 0, 500], far: 6000, ...(camera as any) }}
      scene={{
        background: new THREE.Color("black"),
        ...(scene as any),
      }}
      {...rest}
    >
      {!disableDefaultLights && (
        <>
          <directionalLight intensity={1} position={[-1, 0, 1]} {...directionalLightProps} />
          <ambientLight intensity={1} {...ambientLightProps} />
        </>
      )}

      <Suspense fallback={suspenseFallback}>
        <Smoke {...smoke} />
      </Suspense>
    </Canvas>
  );
};

export * from "./types";
