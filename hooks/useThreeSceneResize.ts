// src/hooks/useThreeSceneResize.ts
import { ThreeSceneState } from './useThreeSceneSetup';

export const useThreeSceneResize = (
  state: ThreeSceneState
) => {
  // Define the window resize event handler
  function handleWindowResize() {
    // Update the camera aspect ratio and projection matrix
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();

    // Update the renderer size
    state.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Add the window resize event listener
  window.addEventListener('resize', handleWindowResize);

  // Return a cleanup function to remove the event listener
  return () => {
    window.removeEventListener('resize', handleWindowResize);
  };
};