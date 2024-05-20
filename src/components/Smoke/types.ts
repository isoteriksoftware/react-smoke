import { BufferGeometry, Material, Texture, Color } from "three";

/**
 * A three-axis value.
 */
export type ThreeAxisValue = [x: number, y: number, z: number];

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

export type SmokeProps = {
  /**
   * Whether to enable frustum culling. When enabled, particles outside the camera's view will not be updated.
   * @default true
   */
  enableFrustumCulling?: boolean;

  /**
   * The turbulence strength.
   * This value determines the strength of the turbulence applied to the particles.
   * @default [0.001, 0.001, 0.001]
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
   * @default [0.5, 0.5, 0]
   */
  maxVelocity?: ThreeAxisValue;

  /**
   * The velocity reset factor.
   * This factor is used to reset the velocity of particles that exceed the bounds of the smoke effect particles.
   * @default 0.001
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
   * This value determines the size of the particles on each axis.
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
   * @default [0.001, 0.001, 0.001]
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
   * @default [0, 0, 0.0011]
   */
  rotation?: ThreeAxisValue;

  /**
   * The textures to use for the particles.
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
