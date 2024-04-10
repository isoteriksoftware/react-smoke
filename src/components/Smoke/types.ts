import { BufferGeometry, Material, Texture, Color } from "three";

export type ThreeAxisValue = [x: number, y: number, z: number];

export type TwoAxisValue = [x: number, y: number];

export type ParticleGeometryGenerator = (
  index: number,
  props: Required<SmokeProps>,
) => BufferGeometry;

export type ParticleMaterialGenerator = (
  index: number,
  textures: Texture[],
  props: Required<SmokeProps>,
) => Material;

export type SmokeProps = {
  turbulenceStrength?: ThreeAxisValue;
  enableTurbulence?: boolean;
  maxVelocity?: number;
  velocityResetFactor?: number;
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
  enableRotation?: boolean;
  rotation?: ThreeAxisValue;
  textures: [string, ...rest: string[]];
  particleGeometry?: ParticleGeometryGenerator;
  particleMaterial?: ParticleMaterialGenerator;
};
