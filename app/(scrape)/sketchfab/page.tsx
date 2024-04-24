"use client";

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SketchfabViewer from '../../../components/SketchfabView';

interface SketchfabData {
  title: string;
  description: string;
  thumbnailUrl: string;
  downloadUrl: string;
}

const SketchfabPage: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [sketchfabData, setSketchfabData] = useState<SketchfabData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSketchfabData = async () => {
      if (!id) {
        setError("Invalid Sketchfab ID");
        return;
      }

      try {
        const response = await fetch(`/sketchfab/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error);
          return;
        }
        const data = await response.json();
        setSketchfabData(data);
      } catch (err) {
        setError("Error fetching Sketchfab data");
      }
    };

    fetchSketchfabData();
  }, [id, pathname]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!sketchfabData) {
    return <div>Loading...</div>;
  }

  return <SketchfabViewer sketchfabData={sketchfabData} />;
};

export default SketchfabPage;