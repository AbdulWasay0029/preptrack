import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, BookOpen, Video, BarChart2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BottomNavProps {
  activePage?: string;
}

const tabs = [
  { path: '/dashboard', icon: Layout, label: 'Dash' },
  { path: '/curriculum', icon: BookOpen, label: 'Curric' },
  { path: '/mock', icon: Video, label: 'Mock' },
  { path: '/progress', icon: BarChart2, label: 'Stats' },
];

export default function BottomNav({ activePage }: BottomNavProps) {
  const location = useLocation();
  const currentPath = activePage || location.pathname;

  return (
    <nav id="bottom-nav" className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 border-t border-outline-variant bg-surface">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path || (tab.path !== '/' && currentPath.startsWith(tab.path));
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-full transition-all",
              isActive ? "bg-primary-container text-on-primary" : "text-on-surface-variant"
            )}
          >
            <tab.icon className="w-[22px] h-[22px]" />
            <span className="text-label-md">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
