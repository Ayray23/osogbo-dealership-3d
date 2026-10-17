import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Loads a glTF 2.0 / GLB vehicle asset.
 * Store assets in public/models and pass their public URL as modelUrl.
 * The source model is cloned per viewer to avoid mutating the cached scene.
 */
export default function GLBVehicle({ modelUrl, color, scale = 1, autoRotate = true }) {
  const group = useRef();
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

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group} scale={scale} position={[0, -0.35, 0]}>
      <primitive object={vehicle} />
    </group>
  );
}
