// src/app/page.tsx
"use client"
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';

type ThreeJSPageState = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  light: THREE.PointLight;
  modelGroup: THREE.Group | null;
};

export default function ThreeJSPage() {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    const state: ThreeJSPageState = {
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer(),
      camera: new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000),
      light: new THREE.PointLight(),
      modelGroup: null,
    };

    function init() {
      state.renderer.setPixelRatio(window.devicePixelRatio);
      state.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(state.renderer.domElement);

      state.camera.position.z = 400;

      state.light.position.set(200, 100, 150);
      state.scene.add(state.light);

      state.scene.add(new THREE.PointLightHelper(state.light, 15));

      const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
      gridHelper.position.y = -150;
      gridHelper.position.x = -150;
      state.scene.add(gridHelper);

      const polarGridHelper = new THREE.PolarGridHelper(200, 16, 8, 64, 0x0000ff, 0x808080);
      polarGridHelper.position.y = -150;
      polarGridHelper.position.x = 200;
      state.scene.add(polarGridHelper);

      const loader = new GLTFLoader();
      loader.load('https://cdn.jsdelivr.net/gh/ebowwar/threejs-assets@main/space_boi.glb', (gltf) => {
        const mesh = gltf.scene.children[0] as THREE.Mesh;

        try {
          mesh.geometry.computeTangents();
        } catch (error) {
          console.error('Error computing tangents:', error);
        }

        const group = new THREE.Group();
        group.scale.multiplyScalar(50);
        group.position.y = -150;
        state.scene.add(group);

        group.updateMatrixWorld(true);
        group.add(mesh);

        const vnh = new VertexNormalsHelper(mesh, 5);
        vnh.position.y = -150;
        group.add(vnh);

        const vth = new VertexTangentsHelper(mesh, 5);
        vth.position.y = -150;
        group.add(vth);

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
        wireframe.position.y = -150;
        group.add(wireframe);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(mesh.geometry),
          edgesMaterial
        );
        edges.position.x = -4;
        edges.position.y = -150;
        group.add(edges);

        state.modelGroup = group;
        state.scene.add(state.modelGroup);
        state.scene.add(new THREE.BoxHelper(state.modelGroup));
      }, undefined, (error) => {
        console.error('Error loading GLTF model:', error);
      });

      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      state.camera.aspect = window.innerWidth / window.innerHeight;
      state.camera.updateProjectionMatrix();

      state.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      const time = -performance.now() * 0.0003;

      state.camera.position.x = 400 * Math.cos(time);
      state.camera.position.z = 400 * Math.sin(time);
      state.camera.lookAt(state.scene.position);

      state.light.position.x = Math.sin(time * 1.7) * 300;
      state.light.position.y = Math.cos(time * 1.5) * 400;
      state.light.position.z = Math.cos(time * 1.3) * 300;

      // Possible options for camera movement:
      // 1. Implement mouse or touch controls for camera movement
      // 2. Add keyboard controls for camera movement
      // 3. Use a third-party camera control library like OrbitControls

      // Possible options for object movement:
      // 1. Implement mouse or touch controls for object rotation/translation
      // 2. Add keyboard controls for object rotation/translation
      // 3. Implement physics-based movement (e.g., gravity, collisions)
      // 4. Animate the object based on time or other factors

      if (state.modelGroup) {
        state.modelGroup.rotation.y += 0.01; // Rotating the model group for demonstration purposes
      }

      state.renderer.render(state.scene, state.camera);
    }

    init();
    animate();

    isInitializedRef.current = true;

    return () => {
      window.removeEventListener('resize', onWindowResize);
      state.renderer.dispose();
    };
  }, []);

  return <div id="three-js-container"></div>;
}


//       loader.load('https://cdn.jsdelivr.net/gh/ebowwar/threejs-assets@main/space_boi.glb', (gltf) => {
