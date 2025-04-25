'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';
import { SafeImage } from '@/components/common';

type ImageContextType = {
  shouldUseFallback: boolean;
  toggleFallbackMode: () => void;
};

const ImageContext = createContext<ImageContextType>({
  shouldUseFallback: false,
  toggleFallbackMode: () => {},
});

export const useImageContext = () => useContext(ImageContext);

type ImageProviderProps = {
  children: ReactNode;
  initialFallbackMode?: boolean;
};

/**
 * ImageProvider - A context provider for global image rendering configuration
 * 
 * This provider can be used to toggle between Next.js Image and SafeImage globally
 * based on environment conditions or user preferences.
 */
export function ImageProvider({ 
  children, 
  initialFallbackMode = false 
}: ImageProviderProps) {
  const [shouldUseFallback, setShouldUseFallback] = useState(initialFallbackMode);

  const toggleFallbackMode = () => {
    setShouldUseFallback(prev => !prev);
  };

  return (
    <ImageContext.Provider value={{ shouldUseFallback, toggleFallbackMode }}>
      {children}
    </ImageContext.Provider>
  );
}

type GlobalImageProps = Omit<ImageProps, 'onError'> & {
  fallbackSrc?: string;
  imgClassName?: string;
};

/**
 * GlobalImage - An image component that respects the ImageProvider's configuration
 * 
 * This component will render either a Next.js Image or a SafeImage with fallback
 * based on the global configuration from ImageProvider.
 */
export function GlobalImage(props: GlobalImageProps) {
  const { shouldUseFallback } = useImageContext();
  
  if (shouldUseFallback) {
    return <SafeImage {...props} />;
  }
  
  return <Image {...props} />;
}

// Usage example:
/*
// In _app.jsx or a layout component:
import { ImageProvider } from '@/providers/ImageProvider';

function MyApp({ Component, pageProps }) {
  return (
    <ImageProvider initialFallbackMode={process.env.NODE_ENV === 'development'}>
      <Component {...pageProps} />
    </ImageProvider>
  );
}

// In any component:
import { GlobalImage } from '@/providers/ImageProvider';

function MyComponent() {
  return (
    <GlobalImage 
      src="/my-image.jpg" 
      alt="My Image" 
      width={300} 
      height={200}
      fallbackSrc="/my-image.jpg"
    />
  );
}
*/ 