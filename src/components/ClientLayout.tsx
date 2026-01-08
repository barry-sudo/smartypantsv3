'use client';

import { AuthProvider } from './providers/AuthProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps): JSX.Element {
  return <AuthProvider>{children}</AuthProvider>;
}
