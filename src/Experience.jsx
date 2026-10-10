import React from 'react';
import { Environment } from '@react-three/drei';
import Phoenix from './Phoenix';

export default function Experience() {
  return (
    <>
      <Environment preset="night" />
      
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffdfba" />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#ff4500" />

      <Phoenix />
    </>
  );
}