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
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
        if (fullName) localStorage.setItem('telegram_name', fullName);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      }
    };

    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
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
    <div className="font-body-base text-body-base min-h-screen flex flex-col bg-background text-on-background selection:bg-primary selection:text-on-primary">
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-gutter">
        <div className="w-full max-w-[420px]">
          {/* Login Card */}
          <div className="bg-surface-container border border-outline-variant p-xl rounded-none shadow-none text-center">
            {/* Wordmark */}
            <div className="mb-xl">
              <h1 className="font-headline-md text-headline-md text-primary tracking-tight">PrepTrack</h1>
            </div>

            {/* Messaging */}
            <div className="mb-xl">
              <h2 className="font-display-lg-mobile text-display-lg-mobile mb-xs text-on-surface">Welcome back</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Sign in to continue your rigorous preparation.</p>
            </div>

            {/* Telegram Button Container */}
            <div className="flex justify-center mb-xl" ref={containerRef}>
              {/* Widget will be injected here */}
            </div>

            {/* Subtext */}
            <p className="mt-md font-body-sm text-body-sm text-on-surface-variant">
              No account needed. Just your Telegram.
            </p>

            {/* Fallback Messaging */}
            <div className="mt-xl pt-6 border-t border-[#2a2a2a] text-center">
              <p className="text-body-sm text-on-surface-variant mb-2">Widget not loading or getting "Session Expired"?</p>
              <p className="text-body-sm bg-[#222] rounded p-3 text-on-surface">
                Message <strong className="text-primary">/web</strong> to your bot on Telegram for a secure Magic Link that instantly logs you in without a phone number!
              </p>
            </div>

            {/* Technical Footer/Divider */}
            <div className="mt-xl pt-lg border-t border-[#2a2a2a] flex items-center justify-center gap-base">
              <span className="material-symbols-outlined text-[16px] text-outline">verified_user</span>
              <span className="font-label-caps text-label-caps text-outline uppercase">Secure Authentication</span>
            </div>
          </div>

          {/* Contextual Decorative Element (Asymmetric) */}
          <div className="mt-lg grid grid-cols-2 gap-gutter opacity-40">
            <div className="h-[2px] bg-primary"></div>
            <div className="h-[2px] bg-[#2a2a2a]"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg py-xl max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-lg">
            <span className="text-label-caps font-label-caps text-on-surface">PrepTrack</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface-variant">Built by Abdul Wasay</span>
          </div>
          <nav className="flex gap-xl mt-lg md:mt-0">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Privacy</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Terms</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
