import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { SmokeProps } from "./types";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import smokeImage from "../../core/assets/smoke-default.png";
import {
  getDefaultParticleGeometryGenerator,
  getDefaultParticleMaterialGenerator,
} from "../../core";

export const Smoke = ({
  enableFrustumCulling = true,
  turbulenceStrength = [0.001, 0.001, 0.001],
  enableTurbulence = false,
  maxVelocity = [0.5, 0.5, 0],
  velocityResetFactor = 0.001,
  minBounds = [-800, -800, -800],
  maxBounds = [800, 800, 800],
  opacity = 0.5,
  color = new THREE.Color(0xffffff),
  density = 50,
  size = [1000, 1000, 1000],
  castShadow = false,
  receiveShadow = false,
  windStrength = [0.001, 0.001, 0.001],
  windDirection = [1, 0, 0],
  enableWind = false,
  enableRotation = false,
  rotation = [0, 0, 0.0011],
  textures = [smokeImage],
  particleGeometry = getDefaultParticleGeometryGenerator(),
  particleMaterial = getDefaultParticleMaterialGenerator(),
}: SmokeProps) => {
  if (textures.length === 0) {
    throw new Error("No textures provided");
  }

  const textureVariants = useLoader(THREE.TextureLoader, textures);

  const { camera } = useThree();

  const frustum = useMemo(() => new THREE.Frustum(), []);
  const boundingBox = useMemo(() => new THREE.Box3(), []);

  const geometries = useMemo(
    () => Array.from({ length: density }, (_, index) => particleGeometry(index, { size, density })),
    [density, particleGeometry, size],
  );

  const materials = useMemo(
    () =>
      Array.from({ length: density }, (_, index) =>
        particleMaterial(index, textureVariants, { opacity, density, color }),
      ),
    [color, density, opacity, particleMaterial, textureVariants],
  );

  const particles = useMemo(() => {
    const smokeParticles = [];

    for (let p = 0; p < density; p++) {
      const x = Math.random() * (maxBounds[0] - minBounds[0]) + minBounds[0];
      const y = Math.random() * (maxBounds[1] - minBounds[1]) + minBounds[1];
      const z = Math.random() * (maxBounds[2] - minBounds[2]) + minBounds[2];

      const particle = new THREE.Mesh(geometries[p], materials[p]);
      particle.castShadow = castShadow;
      particle.receiveShadow = receiveShadow;
      particle.position.set(x, y, z);

      smokeParticles.push(particle);
    }

    return smokeParticles;
  }, [castShadow, density, geometries, materials, maxBounds, minBounds, receiveShadow]);

  useEffect(() => {
    particles.forEach((particle) => {
      particle.userData.velocity = new THREE.Vector3(
        Math.random() * maxVelocity[0] * 2 - maxVelocity[0],
        Math.random() * maxVelocity[1] * 2 - maxVelocity[1],
        Math.random() * maxVelocity[2] * 2 - maxVelocity[2],
      );
    });
  }, [maxVelocity, particles]);

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
  }, [enableRotation, enableTurbulence, particles, rotation]);

  const tempVec3 = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
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
        particle.position.add(velocity);

        // Apply rotation
        if (enableRotation) {
          const [rx, ry, rz] = rotation;
          particle.rotation.x += rx;
          particle.rotation.y += ry;
          particle.rotation.z += rz;
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

export * from "./types";
export const defaultSmokeTexture = smokeImage;
