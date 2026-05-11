import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Video, BarChart2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/curriculum', icon: BookOpen, label: 'Curriculum' },
  { path: '/mock', icon: Video, label: 'Mock' },
  { path: '/progress', icon: BarChart2, label: 'Progress' },
];

export default function BottomNav({ activePage }) {
  const location = useLocation();
  const currentPath = activePage || location.pathname;

  // Don't show bottom nav on landing page
  if (currentPath === '/') return null;

  return (
    <nav id="bottom-nav" className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPath === tab.path;
        return (
          <Link 
            key={tab.path} 
            to={tab.path} 
            className="flex flex-col items-center justify-center gap-1 w-full h-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <div className={cn(
              "p-1 rounded-full transition-all flex items-center justify-center",
              isActive ? "bg-primary text-on-primary" : "text-on-surface-variant"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-label-md font-medium",
              isActive ? "text-primary" : "text-on-surface-variant"
            )}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
