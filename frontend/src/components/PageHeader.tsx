'use client';

import React from 'react';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  backgroundImage = '/images/page-headers/default-header.jpg',
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`relative bg-zinc-900 py-16 md:py-24 overflow-hidden ${className}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-zinc-900/70 z-10"></div>
          <div className="relative w-full h-full">
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}
      
      <div className="container-custom relative z-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 max-w-3xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
} 