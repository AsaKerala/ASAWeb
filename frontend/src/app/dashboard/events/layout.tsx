import React from 'react';

export const metadata = {
  title: 'My Events | Member Dashboard',
  description: 'View your registered events and event history',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 