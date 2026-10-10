import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Phoenix(props) {
  const group = useRef();
  
  const { scene, animations } = useGLTF('/models/phoenix.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const mainAction = Object.keys(actions)[0];
    if (mainAction && actions[mainAction]) {
      actions[mainAction].reset().fadeIn(0.5).play();
    }
    return () => {
      if (mainAction && actions[mainAction]) {
        actions[mainAction].fadeOut(0.5);
      }
    };
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;

    const { x, y } = state.pointer; 
    const { width, height } = state.viewport; 

    const targetX = (x * width) / 2.5;
    const targetY = (y * height) / 2.5;

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.08);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.08);

    const horizontalVelocity = targetX - group.current.position.x;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -horizontalVelocity * 0.4, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, horizontalVelocity * 0.2, 0.1);
    
    group.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Increase these values to make the bird bigger (e.g., [0.8, 0.8, 0.8] or [1.0, 1.0, 1.0]) */}
      <primitive object={scene} scale={[0.8, 0.8, 0.8]} />
    </group>
  );
  
}

useGLTF.preload('/models/phoenix.glb');