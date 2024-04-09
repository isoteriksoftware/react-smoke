import { useFrame, useLoader } from "@react-three/fiber";
import { ParticleGeometryGenerator, ParticleMaterialGenerator, SmokeProps } from "./types";
import THREE from "three";
import { useMemo } from "react";

export const getDefaultParticleGeometryGenerator = (): ParticleGeometryGenerator => {
  let geometry: THREE.PlaneGeometry;

  const generator: ParticleGeometryGenerator = (_, { size }) => {
    if (!geometry) {
      geometry = new THREE.PlaneGeometry(size[0], size[1]);
    }

    return geometry;
  };

  return generator;
};

export const getDefaultParticleMaterialGenerator = (): ParticleMaterialGenerator => {
  let material: THREE.MeshLambertMaterial;

  const generator: ParticleMaterialGenerator = (_, texture, { opacity }) => {
    if (!material) {
      material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
      });
    }

    return material;
  };

  return generator;
};

export const Smoke = ({
  turbulence = 0.001,
  enableTurbulence = true,
  maxVelocity = 0.02,
  minBounds = [-400, -400, -400],
  maxBounds = [400, 400, 400],
  opacity = 0.5,
  color = "white",
  density = 150,
  size = [10, 10, 10],
  castShadow = false,
  receiveShadow = false,
  enableInteraction = false,
  repulsionStrength = 0.0001,
  windStrength = [0.001, 0.001, 0.001],
  windDirection = [1, 0, 0],
  enableWind = true,
  textures,
  particleGeometry = getDefaultParticleGeometryGenerator(),
  particleMaterial = getDefaultParticleMaterialGenerator(),
}: SmokeProps) => {
  const props: Required<SmokeProps> = useMemo(
    () => ({
      turbulence,
      enableTurbulence,
      maxVelocity,
      minBounds,
      maxBounds,
      opacity,
      color,
      density,
      size,
      castShadow,
      receiveShadow,
      enableInteraction,
      repulsionStrength,
      windStrength,
      windDirection,
      enableWind,
      textures,
      particleGeometry,
      particleMaterial,
    }),
    [
      turbulence,
      enableTurbulence,
      maxVelocity,
      minBounds,
      maxBounds,
      opacity,
      color,
      density,
      size,
      castShadow,
      receiveShadow,
      enableInteraction,
      repulsionStrength,
      windStrength,
      windDirection,
      enableWind,
      textures,
      particleGeometry,
      particleMaterial,
    ],
  );

  if (textures.length === 0) {
    throw new Error("No textures provided");
  }

  const textureVariants = useLoader(THREE.TextureLoader, textures);

  const geometries = useMemo(
    () => Array.from({ length: density }, (_, index) => particleGeometry(index, props)),
    [density, particleGeometry, props],
  );

  const materials = useMemo(
    () => textureVariants.map((texture, index) => particleMaterial(index, texture, props)),
    [particleMaterial, props, textureVariants],
  );

  const particles = useMemo(() => {
    const smokeParticles = [];

    for (let p = 0; p < density; p++) {
      const x = Math.random() * (maxBounds[0] - minBounds[0]) + minBounds[0];
      const y = Math.random() * (maxBounds[1] - minBounds[1]) + minBounds[1];
      const z = Math.random() * (maxBounds[2] - minBounds[2]) + minBounds[2];

      const particle = new THREE.Points(
        geometries[p],
        materials[Math.floor(Math.random() * materials.length)],
      );
      particle.position.set(x, y, z);

      particle.userData.velocity = new THREE.Vector3(
        Math.random() * maxVelocity * 2 - maxVelocity,
        Math.random() * maxVelocity * 2 - maxVelocity,
        Math.random() * maxVelocity * 2 - maxVelocity,
      );

      if (enableTurbulence) {
        particle.userData.turbulence = new THREE.Vector3(
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
        );
      }

      smokeParticles.push(particle);
    }

    return smokeParticles;
  }, [density, enableTurbulence, geometries, materials, maxBounds, maxVelocity, minBounds]);

  useFrame(() => {
    particles.forEach((particle) => {
      const velocity = particle.userData.velocity;
      const turbulence = particle.userData.turbulence;

      // Apply turbulence if enabled
      if (enableWind) {
        velocity.x += Math.sin(turbulence.x) * turbulence;
        velocity.y += Math.sin(turbulence.y) * turbulence;
        velocity.z += Math.sin(turbulence.z) * turbulence;
      }

      // Apply wind effect if enabled
      if (enableWind) {
        velocity.x += windDirection[0] * windStrength[0];
        velocity.y += windDirection[1] * windStrength[1];
        velocity.z += windDirection[2] * windStrength[2];
      }

      // Apply velocity
      particle.position.add(velocity);

      // Particle interaction
      if (enableInteraction) {
        particles.forEach((otherParticle) => {
          if (particle !== otherParticle) {
            const distance = particle.position.distanceTo(otherParticle.position);
            const minDistance = particle.userData.size + otherParticle.userData.size;
            if (distance < minDistance) {
              // Apply repulsion force
              const direction = particle.position.clone().sub(otherParticle.position).normalize();
              const repulsionForce = direction.multiplyScalar(repulsionStrength);
              velocity.sub(repulsionForce);
            }
          }
        });
      }

      // Reset particles outside the range
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
        particle.position.x = Math.random() * (maxX - minX) + minX;
        particle.position.y = Math.random() * (maxY - minY) + minY;
        particle.position.z = Math.random() * (maxZ - minZ) + minZ;

        // Reset velocity
        if (velocity) {
          velocity.set(
            Math.random() * maxVelocity * 2 - maxVelocity,
            Math.random() * maxVelocity * 2 - maxVelocity,
            Math.random() * maxVelocity * 2 - maxVelocity,
          );
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