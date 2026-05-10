import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('telegram_id')) {
      navigate('/dashboard');
    }

    window.onTelegramAuth = async (user) => {
      try {
        await api.post('/users/auth/telegram', user);
        localStorage.setItem('telegram_id', user.id);
        navigate('/dashboard');
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
        
        <div className="flex justify-center mb-8" ref={containerRef}>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400 mb-2">Widget not loading or getting "Session Expired"?</p>
          <p className="text-sm bg-white/5 rounded-md p-3 text-gray-300">
            Message <strong className="text-primary-400">/web</strong> to your bot on Telegram for a secure Magic Link that instantly logs you in without a phone number!
          </p>
        </div>
      </div>
    </div>
  );
}
