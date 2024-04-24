// src/app/page.tsx
"use client"
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js';

type ThreeJSPageState = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  light: THREE.PointLight;
  vnh: VertexNormalsHelper;
  vth: VertexTangentsHelper;
};

export default function ThreeJSPage() {
  useEffect(() => {
    const state: ThreeJSPageState = {
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer(),
      camera: new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000),
      light: new THREE.PointLight(),
      vnh: undefined!,
      vth: undefined!,
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
      loader.load('models/gltf/LeePerrySmith/LeePerrySmith.glb', (gltf: GLTF) => {
        const mesh = gltf.scene.children[0] as THREE.Mesh;

        mesh.geometry.computeTangents(); // generates bad data due to degenerate UVs

        const group = new THREE.Group();
        group.scale.multiplyScalar(50);
        state.scene.add(group);

        group.updateMatrixWorld(true);

        group.add(mesh);

        state.vnh = new VertexNormalsHelper(mesh, 5);
        state.scene.add(state.vnh);

        state.vth = new VertexTangentsHelper(mesh, 5);
        state.scene.add(state.vth);

        state.scene.add(new THREE.BoxHelper(mesh));

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
        group.add(wireframe);
        state.scene.add(new THREE.BoxHelper(wireframe));

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(mesh.geometry),
          edgesMaterial
        );
        edges.position.x = -4;
        group.add(edges);
        state.scene.add(new THREE.BoxHelper(edges));

        state.scene.add(new THREE.BoxHelper(group));
        state.scene.add(new THREE.BoxHelper(state.scene));
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

      if (state.vnh) state.vnh.update();
      if (state.vth) state.vth.update();

      state.renderer.render(state.scene, state.camera);
    }

    init();
    animate();

    return () => {
      // Clean up the scene and event listeners when the component is unmounted
      window.removeEventListener('resize', onWindowResize);
      state.renderer.dispose();
    };
  }, []);

  return <div id="three-js-container"></div>;
}