// components/ThreeText.tsx
import { Text3D } from '@react-three/drei';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';

// Define the interface for the ThreeTextProps component
interface ThreeTextProps {
  // The font to be used for the text
  font: Font;
  // The content of the text
  textContent: string;
  // The number of bevel segments for the text
  bevelSegments?: number;
  // The smoothness of the text
  smooth?: number;
  // The material configuration for the text
  material?: Partial<MeshStandardMaterial>;
}

// Define the ThreeText component
const ThreeText: React.FC<ThreeTextProps> = ({
  font,
  textContent,
  bevelSegments = 3, // Set the default value for bevelSegments
  smooth = 0.1, // Set the default value for smooth
  material = {}, // Set the default value for material
}) => {
  // Create a memoized material configuration object
  const materialConfig = useMemo(
    () => ({
      color: 'white', // Set the default color to white
      opacity: 1, // Set the default opacity to 1
      ...material, // Merge the provided material configuration
    }),
    [material]
  );

  // Check if the font is provided, if not, return an error message
  if (!font) {
    return <div>Error: Font not provided</div>;
  }

  // Render the Text3D component with the provided props
  return (
    <Text3D font={font as any} bevelSegments={bevelSegments} smooth={smooth}>
      {textContent}
      <meshStandardMaterial {...materialConfig} />
    </Text3D>
  );
};

// Export the ThreeText component
export default ThreeText;