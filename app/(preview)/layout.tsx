import { AppShell } from '@/components/layout/AppShell';
import { ReactNode } from 'react';

/**
 * Preview layout that wraps children with AppShell
 * This layout composes with RootLayout (providers and fonts still apply)
 */
export default function PreviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

