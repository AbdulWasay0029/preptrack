import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Curriculum from './pages/Curriculum';
import Mock from './pages/Mock';
import Progress from './pages/Progress';
import Lesson from './pages/Lesson';
import Diagnostic from './pages/Diagnostic';

function AuthWrapper({ children }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('prep_auth_token', token);
      // Clean up URL
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [token, location.pathname]);

  const storedToken = localStorage.getItem('prep_auth_token');
  const isPublicRoute = ['/', '/diagnostic'].includes(location.pathname);

  // Allow access if logged in or on public route
  if (!storedToken && !isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthWrapper>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/mock" element={<Mock />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
          </Routes>
        </Layout>
      </AuthWrapper>
    </Router>
  );
}
