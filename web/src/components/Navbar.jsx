import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const telegramId = localStorage.getItem('telegram_id');
  const [telegramName, setTelegramName] = useState(localStorage.getItem('telegram_name') || 'User');

  useEffect(() => {
    if (telegramId && (telegramName === 'User' || telegramName === '')) {
      api.get(`/analytics/${telegramId}`)
        .then(res => {
          if (res.data.user?.name) {
            localStorage.setItem('telegram_name', res.data.user.name);
            setTelegramName(res.data.user.name);
          }
        })
        .catch(err => console.error('Failed to fetch user name:', err));
    }
  }, [telegramId, telegramName]);

  const handleLogout = () => {
    localStorage.removeItem('telegram_id');
    localStorage.removeItem('telegram_name');
    setTelegramName('User');
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';
  const isProgress = location.pathname === '/progress';

  const TELEGRAM_BOT_URL = "https://t.me/PrepTrackBot?start=web";

  return (
    <header className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-lg max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-xl">
          <Link to="/" className="text-headline-md font-headline-md text-primary dark:text-primary tracking-tight">PrepTrack</Link>
          {telegramId && (
            <nav className="hidden md:flex items-center space-x-xl">
              <Link className={`${isDashboard ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'} transition-colors font-body-base text-body-base`} to="/dashboard">Dashboard</Link>
              <Link className={`${isProgress ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'} transition-colors font-body-base text-body-base`} to="/progress">Progress</Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-md">
          {telegramId ? (
            <>
              <span className="text-on-surface-variant font-body-sm">{telegramName}</span>
              <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors font-body-base text-body-base px-md py-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-on-surface-variant hover:text-on-surface transition-colors font-body-base text-body-base px-md py-sm">Login</Link>
              <a href={TELEGRAM_BOT_URL} className="bg-primary text-on-primary px-md py-sm rounded-lg font-bold transition-all duration-200 hover:brightness-110">Get Started</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
