import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated } from './lib/api';
import Login from './pages/Login';
import PartnerDashboard from './pages/PartnerDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<'theme-dark' | 'theme-light'>('theme-dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'theme-dark' | 'theme-light' | null;
    const initialTheme = savedTheme || 'theme-dark';
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  function handleLogout() {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  }

  function toggleTheme() {
    const newTheme = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  }

  const activePath = location.pathname;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        background: 'var(--bg-surface)',
      }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
          TRUCKWYS / PARTNER PORTAL
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: 14,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
            title={theme === 'theme-dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'theme-dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <div style={{
          width: 200,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '24px 0',
        }}>
          <nav>
            <div
              onClick={() => navigate('/')}
              style={{
                padding: '10px 24px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: activePath === '/' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                borderLeft: activePath === '/' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                marginBottom: 4,
              }}
            >
              🏠 Portfolio
            </div>
            <div
              onClick={() => navigate('/risk')}
              style={{
                padding: '10px 24px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: activePath === '/risk' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                borderLeft: activePath === '/risk' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                marginBottom: 4,
              }}
            >
              📊 Risk Analysis
            </div>
            <div
              onClick={() => navigate('/advances')}
              style={{
                padding: '10px 24px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: activePath === '/advances' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                borderLeft: activePath === '/advances' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                marginBottom: 4,
              }}
            >
              💰 Advances
            </div>
            <div
              onClick={() => navigate('/settings')}
              style={{
                padding: '10px 24px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: activePath === '/settings' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                borderLeft: activePath === '/settings' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                marginBottom: 4,
              }}
            >
              ⚙️ Settings
            </div>
          </nav>
        </div>
        {/* Main Content */}
        <div style={{ flex: 1, padding: '32px 32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={<PartnerDashboard />} />
            <Route path="/risk" element={<div style={{ color: 'var(--text-secondary)' }}>Risk Analysis coming soon</div>} />
            <Route path="/advances" element={<div style={{ color: 'var(--text-secondary)' }}>Advances coming soon</div>} />
            <Route path="/settings" element={<div style={{ color: 'var(--text-secondary)' }}>Settings coming soon</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
