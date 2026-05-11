import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function Layout({ children, activePage }) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <TopNav activePage={activePage} />
      <main className="flex-1 pb-20 md:pb-0 md:pt-20">
        {children}
      </main>
      <BottomNav activePage={activePage} />
    </div>
  );
}
