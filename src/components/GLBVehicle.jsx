import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Loads a glTF 2.0 / GLB vehicle asset.
 * Store assets in public/models and pass their public URL as modelUrl.
 * The source model is cloned per viewer to avoid mutating the cached scene.
 */
export default function GLBVehicle({ modelUrl, color, scale = 1, autoRotate = true, onModelInfo, animationName = null }) {
  const group = useRef();
  const { scene, animations = [] } = useGLTF(modelUrl);
  const vehicle = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;

    clone.position.sub(center);
    clone.scale.multiplyScalar(3.7 / maxDimension);
    // Normalize the model to sit on y=0 regardless of the source GLB's pivot/origin.
    const normalizedBounds = new THREE.Box3().setFromObject(clone);
    clone.position.y -= normalizedBounds.min.y;

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

  const mixer = useMemo(() => new THREE.AnimationMixer(vehicle), [vehicle]);

  useEffect(() => {
    if (!onModelInfo) return;
    const names = [];
    vehicle.traverse((node) => {
      if (node.name) names.push(node.name);
    });
    const normalized = names.map((name) => name.toLowerCase().replace(/[^a-z0-9]+/g, ' '));
    const has = (pattern) => normalized.some((name) => pattern.test(name));
    onModelInfo({
      nodeNames: names,
      animations: animations.map((clip) => clip.name),
      parts: {
        doors: has(/\b(door|doors|front door|rear door)\b/),
        bonnet: has(/\b(hood|bonnet)\b/),
        boot: has(/\b(trunk|boot|tailgate|hatch)\b/),
        interior: has(/\b(interior|seat|seats|dashboard|cockpit|steering)\b/),
        engine: has(/\b(engine|motor|powertrain)\b/),
      },
    });
  }, [vehicle, animations, onModelInfo]);

  useEffect(() => {
    mixer.stopAllAction();
    if (!animationName) return undefined;
    const clip = animations.find((item) => item.name === animationName);
    if (!clip) return undefined;
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    return () => mixer.stopAllAction();
  }, [animationName, animations, mixer]);

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.12;
    mixer.update(delta);
  });

  return (
    <group ref={group} scale={scale} position={[0, 0, 0]}>
      <primitive object={vehicle} />
    </group>
  );
}
