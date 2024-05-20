import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Smoke } from "../Smoke";
import * as THREE from "three";
import { SmokeSceneProps } from "./types";

/**
 * The smoke scene component.
 * This component is a wrapper around the Canvas component, and it renders the smoke component.
 *
 * @param smoke The smoke component properties.
 * @param suspenseFallback The fallback component to display while the smoke component is loading.
 * @param disableDefaultLights Whether to disable the default lights.
 * @param camera The camera properties.
 * @param scene The scene properties.
 * @param ambientLightProps The ambient light properties.
 * @param directionalLightProps The directional light properties.
 * @param children The children to render.
 * @param rest The rest of the props to pass to the Canvas component.
 */
export const SmokeScene = ({
  smoke,
  suspenseFallback,
  disableDefaultLights,
  camera,
  scene,
  ambientLightProps,
  directionalLightProps,
  children,
  ...rest
}: SmokeSceneProps) => {
  const bgColor = useMemo(() => new THREE.Color("black"), []);

  return (
    <Canvas
      camera={{ fov: 60, position: [0, 0, 500], far: 6000, ...(camera as any) }}
      scene={{
        background: bgColor,
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

      {children}
    </Canvas>
  );
};

export * from "./types";
