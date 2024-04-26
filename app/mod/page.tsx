// src/app/page.tsx
"use client"
import { useEffect } from 'react';
import { useThreeSceneSetup, ThreeSceneState } from '../../hooks/useThreeSceneSetup';
import { useThreeSceneAnimation } from '../../hooks/useThreeSceneAnimation';
import { useThreeSceneResize } from '../../hooks/useThreeSceneResize';

export default function ThreeJSPage() {
  // Initialize the Three.js scene using the custom hook
  const [threeSceneState, threeSceneCleanup] = useThreeSceneSetup(
    'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'
  );

  useEffect(() => {
    // Start the animation loop using the custom hook
    const animationCleanup = useThreeSceneAnimation(threeSceneState);

    // Handle window resize events using the custom hook
    const resizeCleanup = useThreeSceneResize(threeSceneState);

    // Clean up the scene and event listeners when the component is unmounted
    return () => {
      threeSceneCleanup();
      animationCleanup();
      resizeCleanup();
    };
  }, [threeSceneState, threeSceneCleanup]);

  return <div id="three-js-container"></div>;
}