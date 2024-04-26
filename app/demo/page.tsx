// app/page.tsx
"use client"

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import useTextObject from '../../hooks/useTextObject';
import textData from '../../public/html/text-data.json';

const TextObject = () => {
    const textRef = useTextObject();
  
    return (
      <Text3D
        ref={textRef}
        font="https://cdn.jsdelivr.net/npm/three@0.145.0/examples/fonts/helvetiker_regular.typeface.json"
        size={1}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelSegments={5}
      >
        {textData.text}
        <meshNormalMaterial />
      </Text3D>
    );
  };

export default function HomePage() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <TextObject />
    </Canvas>
  );
}