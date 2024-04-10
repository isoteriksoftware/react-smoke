import { ParticleGeometryGenerator, ParticleMaterialGenerator } from "../../components";
import * as THREE from "three";

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
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
    }

    return material;
  };

  return generator;
};
