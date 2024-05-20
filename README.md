![Preview](https://github.com/isoteriksoftware/react-smoke/assets/50753501/3d4c8668-9e25-4bbf-a7b0-5f808014fdef)

[![Version](https://img.shields.io/npm/v/react-smoke)](https://www.npmjs.com/package/react-smoke)
[![Downloads](https://img.shields.io/npm/dt/react-smoke.svg)](https://www.npmjs.com/package/react-smoke)

`react-smoke` is a powerful and flexible solution for rendering stunning smoke effects in your React applications. Built on top of React Three Fiber (R3F) and Three.js, this library leverages the power of modern WebGL to bring high-fidelity, realistic smoke simulations to the web.

## Features
- **Realistic Smoke Rendering:** Create visually impressive smoke effects with realistic motion and appearance.
- **Seamless Integration:** Designed to work seamlessly within your React projects using R3F and Three.js.
- **Customizable Effects:** Easily adjust parameters such as density, wind, turbulence, and more to fit your needs.
- **Performance Optimized:** Efficient rendering techniques ensure smooth performance even with complex smoke simulations.
- **Easy to Use:** Simple and intuitive API makes it easy to add 3D smoke effects to your application with minimal code.

## Demo
Check out the [live demo (playground)](https://react-smoke-demo.vercel.app/) to see `react-smoke` in action and explore its capabilities.

## Installation
```bash
npm install react-smoke three @react-three/fiber
```

or

```bash
yarn add react-smoke three @react-three/fiber
```

## Peer Dependencies

This library is designed to work alongside `three.js` and `@react-three/fiber`. These are listed as peer dependencies, meaning that it expects these packages to be present in your project:

- `three.js`: A JavaScript 3D library that creates and displays animated 3D computer graphics in a web browser.
- `@react-three/fiber`: A React renderer for three.js that brings declarative, reactive, and component-based patterns to 3D rendering.

As peer dependencies, they are not automatically installed when you install this library. You need to manually install them in your project, if not already present. This approach helps to avoid version conflicts and reduce bundle size.

## Basic Usage

```tsx
// App.tsx
import { SmokeScene } from "react-smoke";
import { useMemo } from "react";
import * as THREE from "three";

export default function App() {
  const smokeColor = useMemo(() => new THREE.Color("red"), []);
  
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <SmokeScene
        smoke={{
          color: smokeColor,
          density: 50,
          enableRotation: true,
        }} 
      />
    </div>
  );
}
```
This renders smoke effects using the default [smoke texture](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/assets/smoke-default.png). 
`<SmokeScene/>` is a wrapper around the `Canvas` component from `@react-three/fiber`. You can customize it or use it as a starting point for your own smoke effects.

## Advanced Usage
If you already have a Three.js scene set up, you can use the `<Smoke/>` component to render smoke effects. This provides more control over the smoke effects and allows you to integrate them into existing scenes.
```tsx
// App.tsx
import { Smoke } from "react-smoke";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

export default function App() {
  const bgColor = useMemo(() => new THREE.Color("black"), []);
  const smokeColor = useMemo(() => new THREE.Color("white"), []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        camera={{ fov: 60, position: [0, 0, 500], far: 6000 }}
        scene={{
          background: bgColor,
        }}
      >
        <Suspense fallback={null}>
          <Smoke
            color={smokeColor}
            density={50}
            enableRotation={true}
            rotation={[0, 0, 0.2]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

## Components

- ### `<SmokeScene/>`
The `<SmokeScene/>` component is a wrapper around the `Canvas` component from `@react-three/fiber`. It provides a simple way to render smoke effects in your application.
It is a good starting point for beginners or users who want to quickly integrate smoke effects into their applications.

#### Props
```tsx
/**
 * The smoke scene properties. Supports all properties from the Canvas component.
 */
export type SmokeSceneProps = Omit<CanvasProps, "children"> &
  PropsWithChildren<{
    /**
     * The smoke properties.
     * This will be used to render the smoke component.
     */
    smoke?: SmokeProps;

    /**
     * The fallback component to display while the smoke component is loading.
     */
    suspenseFallback?: ReactNode;

    /**
     * Whether to disable the default lights.
     * @default false
     */
    disableDefaultLights?: boolean;

    /**
     * The ambient light properties.
     */
    ambientLightProps?: AmbientLightProps;

    /**
     * The directional light properties.
     */
    directionalLightProps?: DirectionalLightProps;
  }>;
```

| Prop                      | Type                                                                                                      | Required | Default                             |
|---------------------------|-----------------------------------------------------------------------------------------------------------|----------|-------------------------------------|
| **smoke**                 | [SmokeProps](https://github.com/isoteriksoftware/react-smoke/blob/main/src/components/Smoke/types.ts#L34) | No       | Default `<Smoke/>` props            |
| **suspenseFallback**      | `ReactNode`                                                                                               | No       | None                                |
| **disableDefaultLights**  | `boolean`                                                                                                 | No       | false                               |
| **ambientLightProps**     | `AmbientLightProps`                                                                                       | No       | intensity=1                         |
| **directionalLightProps** | `DirectionalLightProps`                                                                                   | No       | intensity=1<br/>position=[-1, 0, 1] |

- ### `<Smoke/>`
The `<Smoke/>` component is a low-level component that provides more control over the smoke effects. It is a good choice for users who want to customize the smoke effects or integrate them into existing scenes.

#### Props
```tsx
/**
 * A three-axis value.
 */
export type ThreeAxisValue = [x: number, y: number, z: number];

export type SmokeProps = {
  /**
   * Whether to enable frustum culling. When enabled, particles outside the camera's view will not be updated.
   * @default true
   */
  enableFrustumCulling?: boolean;

  /**
   * The turbulence strength.
   * This value determines the strength of the turbulence applied to the particles.
   * @default [0.01, 0.01, 0.01]
   */
  turbulenceStrength?: ThreeAxisValue;

  /**
   * Whether to enable turbulence.
   * @default false
   */
  enableTurbulence?: boolean;

  /**
   * The maximum velocity.
   * This value determines the maximum velocity of the particles on each axis.
   * @default [30, 30, 0]
   */
  maxVelocity?: ThreeAxisValue;

  /**
   * The velocity reset factor.
   * This factor is used to reset the velocity of particles that exceed the bounds of the smoke effect particles.
   * @default 10
   */
  velocityResetFactor?: number;

  /**
   * The minimum bounds.
   * This value determines the minimum bounds of the particles.
   * @default [-800, -800, -800]
   */
  minBounds?: ThreeAxisValue;

  /**
   * The maximum bounds.
   * This value determines the maximum bounds of the particles.
   * @default [800, 800, 800]
   */
  maxBounds?: ThreeAxisValue;

  /**
   * The opacity of the particles.
   * @default 0.5
   */
  opacity?: number;

  /**
   * The color of the particles.
   * @default THREE.Color(0xffffff)
   */
  color?: Color;

  /**
   * The density of the particles.
   * This value determines the number of particles to generate.
   * @default 50
   */
  density?: number;

  /**
   * The size of the particles.
   * This value determines the size of each particle.
   * @default [1000, 1000, 1000]
   */
  size?: ThreeAxisValue;

  /**
   * Whether to cast shadows.
   * @default false
   */
  castShadow?: boolean;

  /**
   * Whether to receive shadows.
   * @default false
   */
  receiveShadow?: boolean;

  /**
   * The strength of the wind.
   * This value determines the strength of the wind applied to the particles.
   * @default [0.01, 0.01, 0.01]
   */
  windStrength?: ThreeAxisValue;

  /**
   * The direction of the wind.
   * This value determines the direction of the wind applied to the particles.
   * @default [1, 0, 0]
   */
  windDirection?: ThreeAxisValue;

  /**
   * Whether to enable wind.
   * @default false
   */
  enableWind?: boolean;

  /**
   * Whether to enable rotation.
   * @default false
   */
  enableRotation?: boolean;

  /**
   * The rotation of the particles.
   * This value determines the rotation of the particles on each axis.
   * @default [0, 0, 0.1]
   */
  rotation?: ThreeAxisValue;

  /**
   * The paths of the textures to use for the particles.
   * @default [defaultSmokeImage]
   */
  textures?: [string, ...rest: string[]];

  /**
   * The particle geometry generator function.
   * @default getDefaultParticleGeometryGenerator()
   */
  particleGeometry?: ParticleGeometryGenerator;

  /**
   * The particle material generator function.
   * @default getDefaultParticleMaterialGenerator()
   */
  particleMaterial?: ParticleMaterialGenerator;
};
```

| Prop                     | Type                        | Required | Default                                                                                                                       |
|--------------------------|-----------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------|
| **enableFrustumCulling** | `boolean`                   | No       | true                                                                                                                          |
| **turbulenceStrength**   | `ThreeAxisValue`            | No       | [0.01, 0.01, 0.01]                                                                                                            |
| **enableTurbulence**     | `boolean`                   | No       | false                                                                                                                         |
| **maxVelocity**          | `ThreeAxisValue`            | No       | [30, 30, 0]                                                                                                                   |
| **velocityResetFactor**  | `number`                    | No       | 10                                                                                                                            |
| **minBounds**            | `ThreeAxisValue`            | No       | [-800, -800, -800]                                                                                                            |
| **maxBounds**            | `ThreeAxisValue`            | No       | [800, 800, 800]                                                                                                               |
| **opacity**              | `number`                    | No       | 0.5                                                                                                                           |
| **color**                | `THREE.Color`               | No       | THREE.Color(0xffffff)                                                                                                         |
| **density**              | `number`                    | No       | 50                                                                                                                            |
| **size**                 | `ThreeAxisValue`            | No       | [1000, 1000, 1000]                                                                                                            |
| **castShadow**           | `boolean`                   | No       | false                                                                                                                         |
| **receiveShadow**        | `boolean`                   | No       | false                                                                                                                         |
| **windStrength**         | `ThreeAxisValue`            | No       | [0.01, 0.01, 0.01]                                                                                                            |
| **windDirection**        | `ThreeAxisValue`            | No       | [1, 0, 0]                                                                                                                     |
| **enableWind**           | `boolean`                   | No       | false                                                                                                                         |
| **enableRotation**       | `boolean`                   | No       | false                                                                                                                         |
| **rotation**             | `ThreeAxisValue`            | No       | [0, 0, 0.1]                                                                                                                   |
| **textures**             | `string[]`                  | No       | [[defaultSmokeTexture](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/assets/smoke-default.png)]          |
| **particleGeometry**     | `ParticleGeometryGenerator` | No       | [getDefaultParticleGeometryGenerator()](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/utils/index.ts#L9) |
| **particleMaterial**     | `ParticleMaterialGenerator` | No       | [getDefaultParticleMaterialGenerator](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/utils/index.ts#L27)  |


### Particle Geometry Generator
The `ParticleGeometryGenerator` function is used to generate the geometry of the particles. It is a function that takes the index of the particle and the smoke properties (size and density) as arguments and returns a buffer geometry.
This allows you to customize the geometry of the particles to create unique smoke effects.

```tsx
/**
 * A particle geometry generator function.
 * @param index The index of the particle.
 * @param props The smoke properties.
 *
 * @returns A buffer geometry.
 */
export type ParticleGeometryGenerator = (
  index: number,
  props: Required<Pick<SmokeProps, "size" | "density">>,
) => BufferGeometry;
```

A [default implementation](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/utils/index.ts#L9) is provided by the library. You can use it as a starting point for your own implementations:
```tsx
/**
 * Returns a default particle geometry generator function.
 * This generator preserves and reuses a single geometry for all particles.
 * @returns A particle geometry generator function.
 */
export const getDefaultParticleGeometryGenerator = (): ParticleGeometryGenerator => {
    let geometry: THREE.PlaneGeometry;

    return (_, { size }) => {
      if (!geometry) {
        geometry = new THREE.PlaneGeometry(size[0], size[1]);
      }

      return geometry;
    };
  };
```

### Particle Material Generator
The `ParticleMaterialGenerator` function is used to generate the material of the particles. It is a function that takes the smoke properties as an argument and returns a material.
This allows you to customize the material of the particles to create unique smoke effects.

```tsx
/**
 * A particle material generator function.
 * @param index The index of the particle.
 * @param textures The textures to use for the materials.
 * @param props The smoke properties.
 *
 * @returns A material.
 */
export type ParticleMaterialGenerator = (
  index: number,
  textures: Texture[],
  props: Required<Pick<SmokeProps, "opacity" | "density" | "color">>,
) => Material;
```

A [default implementation](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/utils/index.ts#L27) is provided by the library. You can use it as a starting point for your own implementations:

```tsx
/**
 * Returns a default particle material generator function.
 * This generator creates and reuses materials based on the provided textures and color.
 * A material is generated for each texture.
 * @returns A particle material generator function.
 */
export const getDefaultParticleMaterialGenerator = (): ParticleMaterialGenerator => {
    let materials: THREE.MeshLambertMaterial[];

    return (index, textures, { opacity, color }) => {
      if (!materials) {
        materials = [];

        for (let i = 0; i < textures.length; i++) {
          materials.push(
            new THREE.MeshLambertMaterial({
              map: textures[i],
              transparent: true,
              opacity: opacity,
              depthWrite: false,
              color: color,
              polygonOffset: true,
              polygonOffsetFactor: 1,
              polygonOffsetUnits: 1,
            }),
          );
        }
      }

      return materials[index % materials.length];
    };
};
```

The library provides one [additional particle material generator](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/utils/index.ts#L61) that can generate materials with different colors.
This generator can be used to create more visually appealing smoke effects.
The number of materials generated can be based on the provided textures count, colors count, or density:
```tsx
/**
 * Returns a particle material generator function that generates materials with multiple colors.
 * The total number of materials generated can be based on either the number of colors, textures, or a specified density.
 * @param colors An array of colors to be used for the materials. At least two colors are required.
 * @param sizeDeterminant Determines how many materials to generate based on the colors, textures, or a specified density.
 * @returns A particle material generator function.
 */
export const getMultiColorParticleMaterialGenerator = (
    colors: [THREE.Color, THREE.Color, ...rest: THREE.Color[]],
    sizeDeterminant: "colors" | "textures" | "density" = "colors",
  ): ParticleMaterialGenerator => {
    let materials: THREE.MeshLambertMaterial[];

    return (index, textures, { opacity, density }) => {
      if (!materials) {
        materials = [];

        const commonProps = {
          transparent: true,
          opacity: opacity,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        };

        if (sizeDeterminant === "textures") {
          for (let i = 0; i < textures.length; i++) {
            materials.push(
              new THREE.MeshLambertMaterial({
                map: textures[i],
                color: colors[i % colors.length],
                ...commonProps,
              }),
            );
          }
        } else if (sizeDeterminant === "colors") {
          for (let i = 0; i < colors.length; i++) {
            materials.push(
              new THREE.MeshLambertMaterial({
                map: textures[i % textures.length],
                color: colors[i],
                ...commonProps,
              }),
            );
          }
        } else {
          for (let i = 0; i < density; i++) {
            materials.push(
              new THREE.MeshLambertMaterial({
                map: textures[i % textures.length],
                color: colors[i % colors.length],
                ...commonProps,
              }),
            );
          }
        }
      }

      return materials[index % materials.length];
    };
  };
```

The in-built particle material generators can be used as a starting point for your own implementations. They provide a good foundation for creating custom smoke effects.

# Contributing

Contributions are welcome! Please read our [Code of Conduct](https://github.com/isoteriksoftware/react-smoke/blob/master/CODE_OF_CONDUCT.md) and [Contributing](https://github.com/isoteriksoftware/react-smoke/blob/master/CONTRIBUTING.md)
