import type { ReactNode } from 'react';
import { tokens } from '../../tokens';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: tokens.color.background, color: tokens.color.text }}
    >
      {children}
    </div>
  );
}
