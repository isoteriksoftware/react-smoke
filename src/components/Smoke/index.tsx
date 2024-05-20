import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { SmokeProps } from "./types";
import * as THREE from "three";
import { memo, useEffect, useMemo } from "react";
import smokeImage from "../../core/assets/smoke-default.png";
import {
  getDefaultParticleGeometryGenerator,
  getDefaultParticleMaterialGenerator,
} from "../../core";

const DEFAULT_COLOR = new THREE.Color(0xffffff);

/**
 * The smoke component.
 * @param enableFrustumCulling Whether to enable frustum culling. When enabled, particles outside the camera's view will not be updated.
 * @param turbulenceStrength The turbulence strength. This value determines the strength of the turbulence applied to the particles.
 * @param enableTurbulence Whether to enable turbulence.
 * @param maxVelocity The maximum velocity. This value determines the maximum velocity of the particles on each axis.
 * @param velocityResetFactor The velocity reset factor. This factor is used to reset the velocity of particles that exceed the bounds of the smoke effect particles.
 * @param minBounds The minimum bounds. This value determines the minimum bounds of the particles.
 * @param maxBounds The maximum bounds. This value determines the maximum bounds of the particles.
 * @param opacity The opacity of the particles.
 * @param color The color of the particles.
 * @param density The density of the particles.
 * @param size The size of the particles.
 * @param castShadow Whether the particles cast shadows.
 * @param receiveShadow Whether the particles receive shadows.
 * @param windStrength The wind strength. This value determines the strength of the wind applied to the particles.
 * @param windDirection The wind direction. This value determines the direction of the wind applied to the particles.
 * @param enableWind Whether to enable wind.
 * @param enableRotation Whether to enable rotation.
 * @param rotation The rotation of the particles.
 * @param textures The texture paths of the particles.
 * @param particleGeometry The particle geometry generator.
 * @param particleMaterial The particle material generator.
 */
const SmokeComponent = ({
  enableFrustumCulling = true,
  turbulenceStrength = [0.01, 0.01, 0.01],
  enableTurbulence = false,
  maxVelocity = [30, 30, 0],
  velocityResetFactor = 10,
  minBounds = [-800, -800, -800],
  maxBounds = [800, 800, 800],
  opacity = 0.5,
  color = DEFAULT_COLOR,
  density = 50,
  size = [1000, 1000, 1000],
  castShadow = false,
  receiveShadow = false,
  windStrength = [0.01, 0.01, 0.01],
  windDirection = [1, 0, 0],
  enableWind = false,
  enableRotation = false,
  rotation = [0, 0, 0.1],
  textures = [smokeImage],
  particleGeometry = getDefaultParticleGeometryGenerator(),
  particleMaterial = getDefaultParticleMaterialGenerator(),
}: SmokeProps) => {
  if (textures.length === 0) {
    throw new Error("At least one texture must be provided.");
  }

  /** Loads textures */
  const textureVariants = useLoader(THREE.TextureLoader, textures);

  const { camera } = useThree();

  const frustum = useMemo(() => new THREE.Frustum(), []);
  const boundingBox = useMemo(() => new THREE.Box3(), []);
  const tempVec3 = useMemo(() => new THREE.Vector3(), []);

  /**
   * Generates particle geometries.
   * The length of the array is determined by the density. This allows custom geometry generators be flexible in their implementation.
   */
  const geometries = useMemo(
    () => Array.from({ length: density }, (_, index) => particleGeometry(index, { size, density })),
    [density, particleGeometry, size],
  );

  /**
   * Generates particle materials.
   * The length of the array is determined by the density. This allows custom material generators be flexible in their implementation.
   */
  const materials = useMemo(
    () =>
      Array.from({ length: density }, (_, index) =>
        particleMaterial(index, textureVariants, { opacity, density, color }),
      ),
    [color, density, opacity, particleMaterial, textureVariants],
  );

  /**
   * Generates particles.
   * The length of the array is determined by the density.
   */
  const particles = useMemo(() => {
    const smokeParticles: THREE.Mesh[] = [];

    for (let p = 0; p < density; p++) {
      const particle = new THREE.Mesh();
      smokeParticles.push(particle);
    }

    return smokeParticles;
  }, [density]);

  /**
   * Disposes of the meshes when the component is unmounted or particles are updated.
   */
  useEffect(() => {
    // Return a cleanup function that disposes of the meshes
    return () => {
      particles.forEach((particle) => {
        particle.geometry.dispose();

        const material = particle.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material.dispose();
        }
      });
    };
  }, [particles]);

  /**
   * Updates particle positions to random locations within the bounds.
   */
  useEffect(() => {
    for (let p = 0; p < particles.length; p++) {
      const x = Math.random() * (maxBounds[0] - minBounds[0]) + minBounds[0];
      const y = Math.random() * (maxBounds[1] - minBounds[1]) + minBounds[1];
      const z = Math.random() * (maxBounds[2] - minBounds[2]) + minBounds[2];
      particles[p].position.set(x, y, z);
    }
  }, [particles, maxBounds, minBounds]);

  /**
   * Updates particle geometries and materials.
   */
  useEffect(() => {
    for (let p = 0; p < particles.length; p++) {
      const particle = particles[p];
      particle.geometry = geometries[p];
      particle.material = materials[p];
      particle.castShadow = castShadow;
      particle.receiveShadow = receiveShadow;
    }
  }, [castShadow, geometries, materials, particles, receiveShadow]);

  /**
   * Applies random initial velocities to particles.
   */
  useEffect(() => {
    particles.forEach((particle) => {
      particle.userData.velocity = new THREE.Vector3(
        Math.random() * maxVelocity[0] * 2 - maxVelocity[0],
        Math.random() * maxVelocity[1] * 2 - maxVelocity[1],
        Math.random() * maxVelocity[2] * 2 - maxVelocity[2],
      );
    });
  }, [maxVelocity, particles]);

  /**
   * Applies random initial rotations to particles.
   */
  useEffect(() => {
    if (enableRotation) {
      particles.forEach((particle) => {
        const [rx, ry, rz] = rotation;
        const rotationX = Math.random() * rx * 2 - rx;
        const rotationY = Math.random() * ry * 2 - ry;
        const rotationZ = Math.random() * rz * 2 - rz;
        particle.rotation.set(rotationX, rotationY, rotationZ);
      });
    }
  }, [enableRotation, particles, rotation]);

  /**
   * Applies random initial turbulence to particles.
   */
  useEffect(() => {
    if (enableTurbulence) {
      particles.forEach((particle) => {
        particle.userData.turbulence = new THREE.Vector3(
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
        );
      });
    }
  }, [enableTurbulence, particles]);

  /**
   * Updates particle positions and applies forces.
   * This function is called on each frame.
   */
  useFrame((_, delta) => {
    // Updates frustum planes if frustum culling is enabled
    if (enableFrustumCulling) {
      camera.updateMatrixWorld();
      frustum.setFromProjectionMatrix(camera.projectionMatrix);
      frustum.planes.forEach(function (plane) {
        plane.applyMatrix4(camera.matrixWorld);
      });
    }

    particles.forEach((particle) => {
      if (enableFrustumCulling) {
        boundingBox.setFromObject(particle);
      }

      // Only update particles within the camera's view if frustum culling is enabled or update all particles if disabled
      if (!enableFrustumCulling || (enableFrustumCulling && frustum.intersectsBox(boundingBox))) {
        const velocity: THREE.Vector3 = particle.userData.velocity;
        const turbulence = particle.userData.turbulence;

        // Apply turbulence if enabled
        if (enableTurbulence) {
          // Calculate turbulence force vector
          tempVec3.set(
            Math.sin(turbulence.x) * turbulence.length() * turbulenceStrength[0],
            Math.sin(turbulence.y) * turbulence.length() * turbulenceStrength[1],
            Math.sin(turbulence.z) * turbulence.length() * turbulenceStrength[2],
          );

          // Apply turbulence force to velocity
          velocity.add(tempVec3);
        }

        // Apply wind effect if enabled
        if (enableWind) {
          velocity.x += windDirection[0] * windStrength[0];
          velocity.y += windDirection[1] * windStrength[1];
          velocity.z += windDirection[2] * windStrength[2];
        }

        // Clamp velocity to maximum value
        velocity.x = THREE.MathUtils.clamp(velocity.x, -maxVelocity[0], maxVelocity[0]);
        velocity.y = THREE.MathUtils.clamp(velocity.y, -maxVelocity[1], maxVelocity[1]);
        velocity.z = THREE.MathUtils.clamp(velocity.z, -maxVelocity[2], maxVelocity[2]);
        velocity.z = 0; // Disable z-axis movement

        // Apply velocity
        particle.position.add(
          tempVec3.set(velocity.x, velocity.y, velocity.z).multiplyScalar(delta),
        );

        // Apply rotation
        if (enableRotation) {
          const [rx, ry, rz] = rotation;
          particle.rotation.x += rx * delta;
          particle.rotation.y += ry * delta;
          particle.rotation.z += rz * delta;
        }

        // Smoothly transition particles back within the bounds
        const [minX, minY, minZ] = minBounds;
        const [maxX, maxY, maxZ] = maxBounds;
        if (
          particle.position.x < minX ||
          particle.position.x > maxX ||
          particle.position.y < minY ||
          particle.position.y > maxY ||
          particle.position.z < minZ ||
          particle.position.z > maxZ
        ) {
          // Reset velocity
          if (velocity) {
            const center = tempVec3.set((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
            const targetDirection = center.sub(particle.position).normalize();
            velocity.add(targetDirection.multiplyScalar(velocityResetFactor));
          }

          // Reset turbulence
          if (turbulence) {
            turbulence.set(
              Math.random() * 2 * Math.PI,
              Math.random() * 2 * Math.PI,
              Math.random() * 2 * Math.PI,
            );
          }
        }
      }
    });
  });

  return (
    <group>
      {particles.map((particle, index) => (
        <primitive key={index} object={particle} />
      ))}
    </group>
  );
};

export const Smoke = memo(SmokeComponent);
export * from "./types";
export const defaultSmokeTexture = smokeImage;
