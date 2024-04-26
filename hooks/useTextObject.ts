// hooks/useTextObject.ts
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const useTextObject = () => {
  const textRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.x = Math.sin(clock.getElapsedTime()) * 2;
      textRef.current.position.y = Math.cos(clock.getElapsedTime()) * 2;
    }
  });

  return textRef;
};

export default useTextObject;