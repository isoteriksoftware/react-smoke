import { Color } from "@react-three/fiber";
import { BufferGeometry, Material, Texture } from "three";

export type ThreeAxisValue = [x: number, y: number, z: number];

export type TwoAxisValue = [x: number, y: number];

export type ParticleGeometryGenerator = (
  index: number,
  props: Required<SmokeProps>,
) => BufferGeometry;

export type ParticleMaterialGenerator = (
  index: number,
  texture: Texture,
  props: Required<SmokeProps>,
) => Material;

export type SmokeProps = {
  turbulence?: number;
  enableTurbulence?: boolean;
  maxVelocity?: number;
  minBounds?: ThreeAxisValue;
  maxBounds?: ThreeAxisValue;
  opacity?: number;
  color?: Color;
  density?: number;
  size?: ThreeAxisValue;
  castShadow?: boolean;
  receiveShadow?: boolean;
  enableInteraction?: boolean;
  windStrength?: ThreeAxisValue;
  windDirection?: ThreeAxisValue;
  enableWind?: boolean;
  repulsionStrength?: number;
  textures: [string, ...rest: string[]];
  particleGeometry?: ParticleGeometryGenerator;
  particleMaterial?: ParticleMaterialGenerator;
};
