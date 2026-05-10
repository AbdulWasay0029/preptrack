import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Progress from './pages/Progress';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Magic link login bypass
  const searchParams = new URLSearchParams(location.search);
  const loginId = searchParams.get('login');
  if (loginId) {
    localStorage.setItem('telegram_id', loginId);
    window.location.href = '/'; // clear url params and reload
  }

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      {!isLoginPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
