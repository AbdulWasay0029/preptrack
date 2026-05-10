import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('telegram_id')) {
      navigate('/');
    }

    window.onTelegramAuth = async (user) => {
      try {
        await api.post('/users/auth/telegram', user);
        localStorage.setItem('telegram_id', user.id);
        navigate('/');
      } catch (error) {
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      }
    };

    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      // Use the env var if provided, fallback to PrepTrackBot
      const botName = import.meta.env.VITE_TELEGRAM_BOT_NAME || 'PrepTrackBot';
      script.setAttribute('data-telegram-login', botName);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-2xl border border-gray-800 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary mb-2">PrepTrack</h1>
        <p className="text-gray-400 mb-8">Adaptive DSA prep for your target company</p>
        
        <div className="flex justify-center mb-4" ref={containerRef}>
        </div>
        <p className="text-sm text-gray-500">Log in with Telegram to access your dashboard</p>
      </div>
    </div>
  );
}
