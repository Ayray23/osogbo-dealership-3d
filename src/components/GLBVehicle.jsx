import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Loads a real glTF 2.0 / GLB vehicle asset.
 * Keep model files in public/models and pass their public URL as modelUrl.
 * The source model is cloned per viewer so multiple inventory cards/viewers do
 * not mutate the same cached scene.
 */
export default function GLBVehicle({ modelUrl, color, scale = 1, autoRotate = true }) {
  const { scene } = useGLTF(modelUrl);
  const vehicle = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;

    clone.position.sub(center);
    clone.scale.multiplyScalar(3.7 / maxDimension);

    clone.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
      if (color && node.material && node.material.userData?.vehiclePaint) {
        const material = node.material.clone();
        material.color.set(color);
        node.material = material;
      }
    });

    return clone;
  }, [scene, color]);

  return (
    <group rotation={autoRotate ? [0, 0, 0] : [0, 0, 0]} scale={scale} position={[0, -0.35, 0]}>
      <primitive object={vehicle} />
    </group>
  );
}

useGLTF.preload('/models/sedan.glb');
