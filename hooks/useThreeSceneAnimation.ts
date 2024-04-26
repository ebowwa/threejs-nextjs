// src/hooks/useThreeSceneAnimation.ts
import { ThreeSceneState } from './useThreeSceneSetup';

export const useThreeSceneAnimation = (
  state: ThreeSceneState
) => {
  let animationFrameId: number | null = null;

  // Define the animation loop function
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Update the camera and light positions based on the current time
    const time = -performance.now() * 0.0003;
    state.camera.position.x = 400 * Math.cos(time);
    state.camera.position.z = 400 * Math.sin(time);
    state.camera.lookAt(state.scene.position);

    state.light.position.x = Math.sin(time * 1.7) * 300;
    state.light.position.y = Math.cos(time * 1.5) * 400;
    state.light.position.z = Math.cos(time * 1.3) * 300;

    // Update the vertex normal and tangent helpers
    if (state.vertexNormalsHelper) {
      try {
        state.vertexNormalsHelper.update();
      } catch (error) {
        console.error('Error updating VertexNormalsHelper:', error);
      }
    }

    // Check if the VertexTangentsHelper is defined before updating
    if (state.vertexTangentsHelper) {
      try {
        state.vertexTangentsHelper.update();
      } catch (error) {
        console.error('Error updating VertexTangentsHelper:', error);
      }
    }

    // Render the scene
    state.renderer.render(state.scene, state.camera);
  }

  // Start the animation loop
  animate();

  // Return a cleanup function to stop the animation loop
  return () => {
    // Cancel the animation frame request
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};