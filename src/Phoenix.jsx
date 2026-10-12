import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Phoenix(props) {
  const group = useRef();
  
  const { scene, animations } = useGLTF('models/phoenix.glb');
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

    const { x, y } = state.pointer; // Mouse position (-1 to +1)
    const { width, height } = state.viewport; 

    // Calculate target position following cursor
    const targetX = (x * width) / 2.5;
    const targetY = (y * height) / 2.5;

    // Smooth position lerp
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.08);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.08);

    // -----------------------------------------------------------
    // FRONT-FACING MOUSE TRACKING (PREVENTS SHOWING BACKSIDE)
    // -----------------------------------------------------------
    // Limit horizontal rotation to max +/- 60 degrees (Math.PI / 3)
    const targetRotationY = THREE.MathUtils.clamp(x * (Math.PI / 2.5), -Math.PI / 3, Math.PI / 3);
    
    // Limit vertical rotation to max +/- 35 degrees (Math.PI / 5)
    const targetRotationX = THREE.MathUtils.clamp(-y * (Math.PI / 3), -Math.PI / 5, Math.PI / 5);

    // Subtle wing bank angle during horizontal movement
    const velocityX = targetX - group.current.position.x;
    const targetRotationZ = -velocityX * 0.4;

    // Smooth rotation interpolation
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.1);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotationZ, 0.1);

    // Gentle floating motion
    group.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={[0.8, 0.8, 0.8]} />
    </group>
  );
}

useGLTF.preload('models/phoenix.glb');