// src/hooks/useThreeSceneSetup.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';

export type ThreeSceneState = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  light: THREE.PointLight;
  vertexNormalsHelper?: THREE.VertexNormalsHelper;
  vertexTangentsHelper?: THREE.VertexTangentsHelper;
  modelGroup: THREE.Group;
};

export const useThreeSceneSetup = (
  modelUrl: string
): [ThreeSceneState, () => void] => {
  // Create the initial Three.js scene, renderer, camera, and light
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  const light = new THREE.PointLight();

  // Set the initial properties of the scene, renderer, camera, and light
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 400;

  light.position.set(200, 100, 150);
  scene.add(light);

  scene.add(new THREE.PointLightHelper(light, 15));

  // Add a grid helper and a polar grid helper to the scene
  const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
  gridHelper.position.y = -150;
  gridHelper.position.x = -150;
  scene.add(gridHelper);

  const polarGridHelper = new THREE.PolarGridHelper(200, 16, 8, 64, 0x0000ff, 0x808080);
  polarGridHelper.position.y = -150;
  polarGridHelper.position.x = 200;
  scene.add(polarGridHelper);

  // Load the 3D model using the GLTFLoader
  const loader = new GLTFLoader();
  const modelGroup = new THREE.Group();
  loader.load(modelUrl, (gltf) => {
    const mesh = gltf.scene.children[0] as THREE.Mesh;

    // Compute the tangents for the mesh geometry
    mesh.geometry.computeTangents();

    modelGroup.scale.multiplyScalar(50);
    scene.add(modelGroup);

    modelGroup.updateMatrixWorld(true);
    modelGroup.add(mesh);

    // Add vertex normal and tangent helpers to the scene
    const vertexNormalsHelper = new VertexNormalsHelper(mesh, 5);
    scene.add(vertexNormalsHelper);

    const vertexTangentsHelper = new VertexTangentsHelper(mesh, 5);
    scene.add(vertexTangentsHelper);

    // Add some additional visual elements to the scene
    scene.add(new THREE.BoxHelper(mesh));

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
      opacity: 0.25,
      transparent: true,
    });

    const edgesMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
      opacity: 0.25,
      transparent: true,
    });

    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(mesh.geometry),
      wireframeMaterial
    );
    wireframe.position.x = 4;
    modelGroup.add(wireframe);
    scene.add(new THREE.BoxHelper(wireframe));

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      edgesMaterial
    );
    edges.position.x = -4;
    modelGroup.add(edges);
    scene.add(new THREE.BoxHelper(edges));

    scene.add(new THREE.BoxHelper(modelGroup));
    scene.add(new THREE.BoxHelper(scene));
  });

  // Cleanup function to remove event listeners and dispose of the renderer
  const cleanup = () => {
    window.removeEventListener('resize', onWindowResize);
    renderer.dispose();
  };

  // Window resize event listener and update function
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onWindowResize);

  // Return the initial state of the Three.js scene and the cleanup function
  return [
    {
      scene,
      renderer,
      camera,
      light,
      vertexNormalsHelper: undefined,
      vertexTangentsHelper: undefined,
      modelGroup,
    },
    cleanup,
  ];
};