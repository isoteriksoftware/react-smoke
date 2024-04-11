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
  enableFrustumCulling?: boolean;
  turbulenceStrength?: ThreeAxisValue;
  enableTurbulence?: boolean;
  maxVelocity?: ThreeAxisValue;
  velocityResetFactor?: number;
  minBounds?: ThreeAxisValue;
  maxBounds?: ThreeAxisValue;
  opacity?: number;
  color?: Color;
  density?: number;
  size?: ThreeAxisValue;
  castShadow?: boolean;
  receiveShadow?: boolean;
  windStrength?: ThreeAxisValue;
  windDirection?: ThreeAxisValue;
  enableWind?: boolean;
  enableRotation?: boolean;
  rotation?: ThreeAxisValue;
  textures?: [string, ...rest: string[]];
  particleGeometry?: ParticleGeometryGenerator;
  particleMaterial?: ParticleMaterialGenerator;
};
