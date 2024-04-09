![Preview](https://github.com/isoteriksoftware/react-smoke/assets/50753501/109d9120-07f0-46fd-b43e-21a127979e25)

[![Version](https://img.shields.io/npm/v/react-smoke?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-smoke)
[![Downloads](https://img.shields.io/npm/dt/react-smoke.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-smoke)

This library provides React components to create awesome 3D galleries. It supports rendering with solid colors, images, and videos, offering a wide range of possibilities for showcasing media in a 3D environment.

Play with the [demo](https://react-smoke-demo.vercel.app/) to see what you can do with this library.

```bash
npm install react-smoke three @react-three/fiber @react-three/drei
```

or

```bash
yarn add react-smoke three @react-three/fiber @react-three/drei
```

## Peer Dependencies

This library is designed to work alongside `@react-three/drei`, `@react-three/fiber`, and `three.js`. These are listed as peer dependencies, meaning that it expects these packages to be present in your project:

- `three.js`: A JavaScript 3D library that creates and displays animated 3D computer graphics in a web browser.
- `@react-three/fiber`: A React renderer for three.js that brings declarative, reactive, and component-based patterns to 3D rendering.
- `@react-three/drei`: A useful collection of helpers and abstractions for react-three-fiber.

As peer dependencies, they are not automatically installed when you install this library. You need to manually install them in your project, if not already present. This approach helps to avoid version conflicts and reduce bundle size.

## Basic Usage

```jsx
import { Gallery, GalleryScene, SolidColorItem, ImageItem, VideoItem } from "react-smoke";

const App = () => {
  return (
    <GalleryScene>
      <Gallery>
        <SolidColorItem color="#ff0000" />
        <ImageItem src="https://picsum.photos/200/300" />
        <VideoItem
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          crossOrigin="anonymous"
        />
      </Gallery>
    </GalleryScene>
  );
};
```

This renders a gallery with three items: a solid color, an image, and a video. The gallery is rendered in a canvas element using `react-three-fiber`.

## Gallery

```tsx
interface GalleryProps extends Omit<GroupProps, "children"> {
  children: GalleryChildren;
  ground?: GroundProps;
  disableGround?: boolean;
  item?: {
    width?: number;
    height?: number;
    radialSegments?: number;
    heightSegments?: number;
    innerRadiusPercent?: number;
  };
}
```

The `Gallery` component is the container for all items in the gallery. It is responsible for laying out the items in a 3D space. It also provides a number of properties that can be used to customize the gallery:

### Properties

| Property        | Type              | Default | Description                          |
| --------------- | ----------------- | ------- | ------------------------------------ |
| `children`      | `GalleryChildren` |         | The items to render in the gallery.  |
| `ground`        | `GroundProps`     |         | The ground properties.               |
| `disableGround` | `boolean`         | `false` | Whether or not to render the ground. |
| `item`          | `ItemProps`       |         | The item properties.                 |

### GalleryChildren

The `GalleryChildren` type is an array of `GalleryItem` objects. These objects can be one of the following types:

- `SolidColorItem`
- `ImageItem`
- `VideoItem`
- `GalleryItem`

### ItemProps

```tsx
interface ItemProps {
  width?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  innerRadiusPercent?: number;
}
```

The `ItemProps` type is used to customize the items in the gallery. The items are rendered using the `GalleryItem` components.

#### Properties

| Property             | Type     | Default | Description                                                     |
| -------------------- | -------- | ------- | --------------------------------------------------------------- |
| `width`              | `number` | `120`   | The width of the item.                                          |
| `height`             | `number` | `50`    | The height of the item.                                         |
| `radialSegments`     | `number` | `50`    | The number of radial segments that make up the item's geometry. |
| `heightSegments`     | `number` | `1`     | The number of height segments that make up the item's geometry. |
| `innerRadiusPercent` | `number` | `0.99`  | The percentage of the outerRadius used to get the innerRadius   |

## SolidColorItem

```tsx
<SolidColorItem color="#ff0000" />
```

The `SolidColorItem` component is used to render a solid color in the gallery. It is responsible for rendering the item's geometry and material. It uses the `SolidColorItemMaterial` component to render the item's material.

### Properties

| Property | Type     | Default | Description                    |
| -------- | -------- | ------- | ------------------------------ |
| `color`  | `string` |         | The color to use for the item. |

## ImageItem

```tsx
<ImageItem src="https://picsum.photos/200/300" />
```

The `ImageItem` component is used to render an image in the gallery. It is responsible for rendering the item's geometry and material. It uses the `ImageItemMaterial` component to render the item's material.

### Properties

| Property | Type     | Default | Description                        |
| -------- | -------- | ------- | ---------------------------------- |
| `src`    | `string` |         | The source of the image to render. |

## VideoItem

```tsx
<VideoItem src="./video.mp4" />
```

The `VideoItem` component is used to render a video in the gallery. It is responsible for rendering the item's geometry and material. It uses the `VideoItemMaterial` component to render the item's material.

### Properties

| Property | Type     | Default | Description                        |
| -------- | -------- | ------- | ---------------------------------- |
| `src`    | `string` |         | The source of the video to render. |

## Ground

The `Ground` component is used to render the ground in the gallery. It is responsible for rendering the ground's geometry and material. It uses the `MeshReflectorMaterial` component from `@react-three/drei` to render the ground's material.

### GroundProp

```tsx
interface GroundProps {
  width?: number;
  height?: number;
  reflectorMaterial?: {
    color?: string;
    roughness?: number;
    metalness?: number;
    resolution?: number;
    mixBlur?: number;
    mixStrength?: number;
    blur?: [number, number] | number;
    mirror?: number;
    minDepthThreshold?: number;
    maxDepthThreshold?: number;
    depthScale?: number;
    depthToBlurRatioBias?: number;
    distortionMap?: Texture;
    distortion?: number;
    mixContrast?: number;
    reflectorOffset?: number;
  };
  disableReflector?: boolean;
}
```

#### Properties

| Property            | Type      | Default | Description                                                                       |
| ------------------- | --------- | ------- | --------------------------------------------------------------------------------- |
| `width`             | `number`  | `1000`  | The width of the ground.                                                          |
| `height`            | `number`  | `1000`  | The height of the ground.                                                         |
| `reflectorMaterial` | `object`  |         | The properties of the `MeshReflectorMaterial` component from `@react-three/drei`. |
| `disableReflector`  | `boolean` | `false` | Whether or not to render `MeshReflectorMaterial`.                                 |

## GalleryItem

```tsx
type GalleryItemProps = PropsWithChildren<{
  material: GalleryItemMaterial;
}>;
```

The `GalleryItem` component is used to render an item in the gallery. It is responsible for rendering the item's geometry and material.

### Properties

| Property   | Type                  | Default | Description                                                        |
| ---------- | --------------------- | ------- | ------------------------------------------------------------------ |
| `material` | `GalleryItemMaterial` |         | The material to use for the item. This is not a three.js material. |

#### GalleryItemMaterial

```ts
interface GalleryItemMaterial {
  generate: () => Material | Material[];
}
```

The `GalleryItemMaterial` type is used to generate the three.js `Material` of a gallery item. There are built-in materials that can be used to render solid colors, images, and videos. You can also create your own custom materials.

#### Built-in Materials

| Material                 | Description            |
| ------------------------ | ---------------------- |
| `SolidColorItemMaterial` | Renders a solid color. |
| `ImageItemMaterial`      | Renders an image.      |
| `VideoItemMaterial`      | Renders a video.       |

## GalleryScene

```tsx
<GalleryScene>
  <Gallery>
    <SolidColorItem color="#ff0000" />
    <ImageItem src="https://picsum.photos/200/300" />
    <VideoItem
      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      crossOrigin="anonymous"
    />
  </Gallery>
</GalleryScene>
```

The `GalleryScene` component is used to render the gallery in a canvas element using `react-three-fiber`. It is responsible for setting up the scene, camera, and lighting.

### GallerySceneProps

```tsx
type GallerySceneProps = Omit<CanvasProps, "children"> & {
  children: GallerySceneChildren;
  backgroundColor?: string;
  fog?: {
    color?: string;
    near?: number;
    far?: number;
  };
  orbitControls?: OrbitControlsProps;
  disableControls?: boolean;
  disableFog?: boolean;
  disableEnvironment?: boolean;
  environment?: EnvironmentProps;
};
```

### Properties

| Property             | Type                   | Default   | Description                                                              |
| -------------------- | ---------------------- | --------- | ------------------------------------------------------------------------ |
| `children`           | `GallerySceneChildren` |           | The gallery to render and other R3F compatible components.               |
| `backgroundColor`    | `string`               | `#000000` | The background color of the scene.                                       |
| `fog`                | `object`               |           | The properties of the `Fog` in the scene                                 |
| `orbitControls`      | `object`               |           | The properties of the `OrbitControls` component from `@react-three/drei` |
| `disableControls`    | `boolean`              | `false`   | Whether or not to render `OrbitControls`                                 |
| `disableFog`         | `boolean`              | `false`   | Whether or not to render `Fog`                                           |
| `disableEnvironment` | `boolean`              | `false`   | Whether or not to render `Environment`                                   |
| `environment`        | `object`               |           | The properties of the `Environment` component from `@react-three/drei`   |

# Contributing

Contributions are welcome! Please read our [Code of Conduct](https://github.com/isoteriksoftware/react-smoke/blob/master/CODE_OF_CONDUCT.md) and [Contributing](https://github.com/isoteriksoftware/react-smoke/blob/master/CONTRIBUTING.md)
