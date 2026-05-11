import { Link } from 'react-router-dom';

export default function TopNav({ activePage }) {
  return (
    <header className="hidden md:flex justify-between items-center h-20 px-page_padding max-w-7xl mx-auto w-full fixed top-0 left-0 right-0 z-50 border-b border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center gap-unit_sm">
        <span className="material-symbols-outlined text-primary">terminal</span>
        <span className="text-headline-md font-bold text-primary">PrepTrack</span>
      </div>
      <nav className="flex gap-8">
        {[['/', 'Home'], ['/curriculum', 'Curriculum'], ['/mock', 'Mock'], ['/progress', 'Progress']].map(([path, label]) => (
          <Link key={path} to={path} className={`font-medium transition-colors ${activePage === path ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>
            {label}
          </Link>
        ))}
      </nav>
      <button className="bg-primary-container text-on-primary px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all">
        Upgrade
      </button>
    </header>
  );
}
