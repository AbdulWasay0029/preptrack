import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import { cn } from '@/src/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

export default function Layout({ children, activePage }: LayoutProps) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary/30">
      <TopNav activePage={activePage} />
      <main className={cn(
        "flex-1",
        !isLanding ? "pb-20 md:pb-8 md:pt-20" : "pt-20"
      )}>
        {children}
      </main>
      <BottomNav activePage={activePage} />
    </div>
  );
}
