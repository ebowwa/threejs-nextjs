// hooks/useFont.ts
import { useState, useEffect } from 'react';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';

interface UseFontOptions {
  url: string;
}

const useFont = ({ url }: UseFontOptions): Font | null => {
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loadFont = async () => {
      const loader = new FontLoader();
      const loadedFont = await loader.loadAsync(url);
      setFont(loadedFont);
    };

    loadFont();
  }, [url]);

  return font;
};

useFont.preload = (url: string): Promise<Font> => {
  return new Promise((resolve, reject) => {
    const loader = new FontLoader();
    loader.load(
      url,
      (font) => {
        resolve(font);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};

export default useFont;