import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Progress from './pages/Progress';
import Landing from './pages/Landing';
import Diagnostic from './pages/Diagnostic';
import Curriculum from './pages/Curriculum';
import Lesson from './pages/Lesson';
import Mock from './pages/Mock';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const hideNavbar = isLoginPage;

  // Magic link login bypass
  const searchParams = new URLSearchParams(location.search);
  const loginId = searchParams.get('login');
  if (loginId) {
    localStorage.setItem('telegram_id', loginId);
    window.location.href = '/dashboard'; // clear url params and go to dashboard
  }

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/mock" element={<Mock />} />
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
