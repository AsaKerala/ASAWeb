'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type SafeImageProps = Omit<ImageProps, 'onError'> & {
  fallbackSrc?: string;
  imgClassName?: string;
};

/**
 * SafeImage component that uses Next.js Image with fallback to regular img tag
 * if Next.js image optimization fails.
 */
export default function SafeImage({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  className,
  imgClassName,
  ...props
}: SafeImageProps) {
  const [isNextImageFailed, setIsNextImageFailed] = useState(false);
  
  // If Next.js image fails, use a direct img tag as fallback
  if (isNextImageFailed) {
    // Use fallbackSrc if provided, or the original src
    const imgSrc = typeof src === 'string' 
      ? (fallbackSrc || src) 
      : (fallbackSrc || '');
    
    return (
      <div className={className}>
        <img
          src={imgSrc}
          alt={alt as string}
          width={typeof width === 'number' ? width : undefined} 
          height={typeof height === 'number' ? height : undefined}
          className={imgClassName}
          style={props.style}
          loading="lazy"
        />
      </div>
    );
  }
  
  // Try Next.js Image first
  return (
    <Image
      src={src}
      alt={alt as string}
      width={width}
      height={height}
      className={className}
      onError={() => setIsNextImageFailed(true)}
      {...props}
    />
  );
} 