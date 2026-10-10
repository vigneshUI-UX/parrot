import React from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import './App.css';

export default function App() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        resize={{ scroll: false, debounce: 0 }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}