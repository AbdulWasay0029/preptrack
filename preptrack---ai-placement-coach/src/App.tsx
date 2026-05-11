/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const telegramId = searchParams.get('telegram_id');

  useEffect(() => {
    if (telegramId) {
      localStorage.setItem('prep_telegram_id', telegramId);
    }
  }, [telegramId]);

  const storedId = localStorage.getItem('prep_telegram_id');
  const isPublicRoute = ['/', '/diagnostic'].includes(location.pathname);

  // Allow access if linked or on landing/diagnostic
  if (!storedId && !isPublicRoute) {
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

