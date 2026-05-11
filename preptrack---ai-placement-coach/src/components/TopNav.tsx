import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TopNavProps {
  activePage?: string;
}

export default function TopNav({ activePage }: TopNavProps) {
  const location = useLocation();
  const currentPath = activePage || location.pathname;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/curriculum', label: 'Curriculum' },
    { path: '/mock', label: 'Mock' },
    { path: '/progress', label: 'Progress' },
  ];

  return (
    <header id="top-nav" className="flex justify-between items-center h-20 px-page_padding max-w-7xl mx-auto w-full fixed top-0 left-0 right-0 z-50 border-b border-outline-variant bg-background/80 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-unit_sm">
        <Terminal className="text-primary w-6 h-6" />
        <span className="text-headline-md font-bold text-primary tracking-tight">PrepTrack</span>
      </Link>
      <nav className="flex gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "font-medium transition-colors text-body-md",
              currentPath === link.path 
                ? "text-primary border-b-2 border-primary pb-1" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link to="/upgrade">
        <button id="upgrade-button-desktop" className="bg-primary-container text-on-primary-container px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all text-label-bold">
          Upgrade
        </button>
      </Link>
    </header>
  );
}
