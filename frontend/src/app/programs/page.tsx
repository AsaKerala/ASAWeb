import React from 'react';
import { Metadata } from 'next';
import ProgramsList from '@/components/programs/ProgramsList';

export const metadata: Metadata = {
  title: 'Training Programs | ASA India',
  description: 'Explore our comprehensive training programs designed to enhance skills and foster development in various domains.',
  openGraph: {
    title: 'Training Programs | ASA India',
    description: 'Explore our comprehensive training programs designed to enhance skills and foster development in various domains.',
    images: [
      {
        url: '/images/og-programs.jpg',
        width: 1200,
        height: 630,
        alt: 'ASA India Training Programs',
      },
    ],
  },
};

export default function ProgramsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Training Programs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive training programs designed to enhance skills and foster development in various domains.
        </p>
      </div>
      
      <ProgramsList />
    </div>
  );
} 