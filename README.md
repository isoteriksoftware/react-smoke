![Preview](https://github.com/isoteriksoftware/react-smoke/assets/50753501/48168255-000f-4169-acfc-f21bc55db0b1)

[![Version](https://img.shields.io/npm/v/react-smoke?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-smoke)
[![Downloads](https://img.shields.io/npm/dt/react-smoke.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-smoke)

Effortlessly integrate captivating smoke effects into your React applications using Three.js and React Three Fiber (R3F)

Play with the [demo](https://react-smoke-demo.vercel.app/) to see what you can do with this library.

```bash
npm install react-smoke three @react-three/fiber
```

or

```bash
yarn add react-smoke three @react-three/fiber
```

## Peer Dependencies

This library is designed to work alongside `@react-three/drei`, and `@react-three/fiber`. These are listed as peer dependencies, meaning that it expects these packages to be present in your project:

- `three.js`: A JavaScript 3D library that creates and displays animated 3D computer graphics in a web browser.
- `@react-three/fiber`: A React renderer for three.js that brings declarative, reactive, and component-based patterns to 3D rendering.

As peer dependencies, they are not automatically installed when you install this library. You need to manually install them in your project, if not already present. This approach helps to avoid version conflicts and reduce bundle size.

## Basic Usage

```tsx
// App.tsx
import { SmokeScene } from "react-smoke";

export default function App() {
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
      <SmokeScene />
    </div>
  );
}
```

This renders smoke effects using the default [smoke texture](https://github.com/isoteriksoftware/react-smoke/blob/main/src/core/assets/smoke-default.png). `<SmokeScene/>` is a wrapper around the `Canvas` component from `@react-three/fiber`. You can customize it or use it as a starting point for your own smoke effects.

## Advanced Usage

```tsx
// App.tsx
import { Smoke } from "react-smoke";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";

export default function App() {
  const bgColor = useMemo(() => new THREE.Color("black"), []);

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
          <Smoke />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

## Gallery

```tsx

```

The `Gallery` component is the container for all items in the gallery. It is responsible for laying out the items in a 3D space. It also provides a number of properties that can be used to customize the gallery:

# Contributing

Contributions are welcome! Please read our [Code of Conduct](https://github.com/isoteriksoftware/react-smoke/blob/master/CODE_OF_CONDUCT.md) and [Contributing](https://github.com/isoteriksoftware/react-smoke/blob/master/CONTRIBUTING.md)
