import { Link } from 'react-router-dom';

const tabs = [
  { path: '/dashboard', icon: 'home', label: 'Home' },
  { path: '/curriculum', icon: 'menu_book', label: 'Curriculum' },
  { path: '/mock', icon: 'video_call', label: 'Mock' },
  { path: '/progress', icon: 'query_stats', label: 'Progress' },
];

export default function BottomNav({ activePage }) {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 border-t border-outline-variant bg-surface">
      {tabs.map(tab => (
        <Link key={tab.path} to={tab.path} className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-full transition-all ${activePage === tab.path ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
          <span className="text-label-md">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
