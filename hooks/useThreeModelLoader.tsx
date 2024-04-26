// src/hooks/useThreeModelLoader.ts
import * as React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

type ThreeModelState = {
  model: THREE.Group | null;
  error: Error | null;
  isLoading: boolean;
};

export const useThreeModelLoader = async (modelUrl: string): Promise<ThreeModelState> => {
  const [state, setState] = React.useState<ThreeModelState>({
    model: null,
    error: null,
    isLoading: true,
  });

  try {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);
    const mesh = gltf.scene.children[0] as THREE.Mesh;
    mesh.geometry.computeTangents();
    const model = new THREE.Group();
    model.scale.multiplyScalar(50);
    model.add(mesh);
    setState({ model, error: null, isLoading: false });
  } catch (error) {
    setState({ model: null, error: error as Error, isLoading: false });
  }

  return state;
};