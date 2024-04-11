import { ParticleGeometryGenerator, ParticleMaterialGenerator } from "../../components";
import * as THREE from "three";

/**
 * Returns a default particle geometry generator function.
 * This generator preserves and reuses a single geometry for all particles.
 * @returns A particle geometry generator function.
 */
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

/**
 * Returns a default particle material generator function.
 * This generator creates and reuses materials based on the provided textures and color.
 * @returns A particle material generator function.
 */
export const getDefaultParticleMaterialGenerator = (): ParticleMaterialGenerator => {
  let materials: THREE.MeshLambertMaterial[];

  const generator: ParticleMaterialGenerator = (index, textures, { opacity, color }) => {
    if (!materials) {
      materials = [];

      for (let i = 0; i < textures.length; i++) {
        materials.push(
          new THREE.MeshLambertMaterial({
            map: textures[i],
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            color: color,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
          }),
        );
      }
    }

    return materials[index % materials.length];
  };

  return generator;
};

/**
 * Returns a particle material generator function that generates materials with multiple colors.
 * The total number of materials generated can be based on either the number of colors, textures, or a specified density.
 * @param colors An array of colors to be used for the materials.
 * @param sizeDeterminant Determines how many materials to generate based on the colors, textures, or a specified density.
 * @returns A particle material generator function.
 */
export const getMultiColorParticleMaterialGenerator = (
  colors: [THREE.Color, THREE.Color, ...rest: THREE.Color[]],
  sizeDeterminant: "colors" | "textures" | "density" = "colors",
): ParticleMaterialGenerator => {
  let materials: THREE.MeshLambertMaterial[];

  const generator: ParticleMaterialGenerator = (index, textures, { opacity, density }) => {
    if (!materials) {
      materials = [];

      const commonProps = {
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      };

      if (sizeDeterminant === "textures") {
        for (let i = 0; i < textures.length; i++) {
          materials.push(
            new THREE.MeshLambertMaterial({
              map: textures[i],
              color: colors[i % colors.length],
              ...commonProps,
            }),
          );
        }
      } else if (sizeDeterminant === "colors") {
        for (let i = 0; i < colors.length; i++) {
          materials.push(
            new THREE.MeshLambertMaterial({
              map: textures[i % textures.length],
              color: colors[i],
              ...commonProps,
            }),
          );
        }
      } else {
        for (let i = 0; i < density; i++) {
          materials.push(
            new THREE.MeshLambertMaterial({
              map: textures[i % textures.length],
              color: colors[i % colors.length],
              ...commonProps,
            }),
          );
        }
      }
    }

    return materials[index % materials.length];
  };

  return generator;
};
