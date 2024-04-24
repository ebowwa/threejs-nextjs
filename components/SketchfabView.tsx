// threejs-nextjs-examples/components/SketchfabView.tsx
import { useState, useEffect } from 'react';

interface SketchfabData {
  title: string;
  description: string;
  thumbnailUrl: string;
  downloadUrl: string;
}

interface SketchfabViewerProps {
  sketchfabData: SketchfabData;
}

const SketchfabViewer: React.FC<SketchfabViewerProps> = ({ sketchfabData }) => {
  return (
    <div>
      <h2>{sketchfabData.title}</h2>
      <p>{sketchfabData.description}</p>
      <img src={sketchfabData.thumbnailUrl} alt={sketchfabData.title} />
      <a href={sketchfabData.downloadUrl}>Download</a>
    </div>
  );
};

export default SketchfabViewer;