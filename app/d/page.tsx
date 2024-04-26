"use client"
import { Canvas, useThree } from '@react-three/fiber';
import { Mesh, PlaneGeometry, MeshBasicMaterial } from 'three';
import useFont from '../../hooks/useFont';
import ThreeText from '../../components/ThreeText';
import textData from '../../public/html/text-data.json';
import { z } from 'zod';

const textDataSchema = z.object({
  text: z.string(),
});

type TextData = z.infer<typeof textDataSchema>;

const Background = () => {
  const { scene } = useThree();

  // Create a plane geometry for the background
  const geometry = new PlaneGeometry(100, 100);

  // Create a basic material for the background
  const material = new MeshBasicMaterial({ color: 0xffffff });

  // Create a mesh with the geometry and material
  const mesh = new Mesh(geometry, material);

  // Add the mesh to the scene
  scene.add(mesh);

  return null;
};

const HomePage = () => {
  const font = useFont({ url: 'https://cdn.jsdelivr.net/npm/three@0.145.0/examples/fonts/helvetiker_regular.typeface.json' });

  if (!font) {
    return <div>Loading...</div>;
  }

  const validatedTextData = textDataSchema.parse(textData) as TextData;

  return (
    <Canvas>
      <Background />
      <ThreeText font={font} textContent={validatedTextData.text} />
    </Canvas>
  );
};

export default HomePage;