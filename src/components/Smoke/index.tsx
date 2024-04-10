import { useFrame, useLoader } from "@react-three/fiber";
import { ParticleGeometryGenerator, ParticleMaterialGenerator, SmokeProps } from "./types";
import * as THREE from "three";
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

  const generator: ParticleMaterialGenerator = (_, textures, { opacity, color }) => {
    if (!material) {
      material = new THREE.MeshLambertMaterial({
        map: textures[Math.floor(Math.random() * textures.length)],
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        color: color,
      });
    }

    return material;
  };

  return generator;
};

export const Smoke = ({
  turbulenceStrength = [0.001, 0.001, 0.001],
  enableTurbulence = false,
  maxVelocity = 0.5,
  velocityResetFactor = 0.05,
  minBounds = [-800, -800, -800],
  maxBounds = [800, 800, 800],
  opacity = 0.5,
  color = new THREE.Color(0xffffff),
  density = 50,
  size = [1000, 1000, 1000],
  castShadow = false,
  receiveShadow = false,
  enableInteraction = false,
  repulsionStrength = 0.0001,
  windStrength = [0.001, 0.001, 0.001],
  windDirection = [1, 0, 0],
  enableWind = false,
  enableRotation = true,
  rotation = [0, 0, 0.0011],
  textures,
  particleGeometry = getDefaultParticleGeometryGenerator(),
  particleMaterial = getDefaultParticleMaterialGenerator(),
}: SmokeProps) => {
  const props: Required<SmokeProps> = useMemo(
    () => ({
      turbulenceStrength,
      enableTurbulence,
      maxVelocity,
      velocityResetFactor,
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
      enableRotation,
      rotation,
      textures,
      particleGeometry,
      particleMaterial,
    }),
    [
      turbulenceStrength,
      enableTurbulence,
      maxVelocity,
      velocityResetFactor,
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
      enableRotation,
      rotation,
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
    () =>
      Array.from({ length: density }, (_, index) =>
        particleMaterial(index, textureVariants, props),
      ),
    [density, particleMaterial, props, textureVariants],
  );

  const particles = useMemo(() => {
    const smokeParticles = [];

    for (let p = 0; p < density; p++) {
      const x = Math.random() * (maxBounds[0] - minBounds[0]) + minBounds[0];
      const y = Math.random() * (maxBounds[1] - minBounds[1]) + minBounds[1];
      const z = Math.random() * (maxBounds[2] - minBounds[2]) + minBounds[2];

      const particle = new THREE.Mesh(geometries[p], materials[p]);
      particle.position.set(x, y, z);

      particle.userData.velocity = new THREE.Vector3(
        Math.random() * maxVelocity * 2 - maxVelocity,
        Math.random() * maxVelocity * 2 - maxVelocity,
        Math.random() * maxVelocity * 2 - maxVelocity,
      );

      if (enableRotation) {
        const [rx, ry, rz] = rotation;
        const rotationX = Math.random() * rx * 2 - rx;
        const rotationY = Math.random() * ry * 2 - ry;
        const rotationZ = Math.random() * rz * 2 - rz;
        particle.rotation.set(rotationX, rotationY, rotationZ);
      }

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
  }, [
    density,
    enableRotation,
    enableTurbulence,
    geometries,
    materials,
    maxBounds,
    maxVelocity,
    minBounds,
    rotation,
  ]);

  useFrame(() => {
    particles.forEach((particle) => {
      const velocity: THREE.Vector3 = particle.userData.velocity;
      const turbulence = particle.userData.turbulence;

      // Apply turbulence if enabled
      if (enableTurbulence) {
        // Calculate turbulence force vector
        const turbulenceForce = new THREE.Vector3(
          Math.sin(turbulence.x) * turbulence.length() * turbulenceStrength[0],
          Math.sin(turbulence.y) * turbulence.length() * turbulenceStrength[1],
          Math.sin(turbulence.z) * turbulence.length() * turbulenceStrength[2],
        );

        // Apply turbulence force to velocity
        velocity.add(turbulenceForce);
      }

      // Apply wind effect if enabled
      if (enableWind) {
        velocity.x += windDirection[0] * windStrength[0];
        velocity.y += windDirection[1] * windStrength[1];
        velocity.z += windDirection[2] * windStrength[2];
      }

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

      // Clamp velocity to maximum value
      velocity.clampScalar(-maxVelocity, maxVelocity);

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
          const center = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
          const targetDirection = center.clone().sub(particle.position).normalize();
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
