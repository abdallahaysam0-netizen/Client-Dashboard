import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Common/Navbar'
import './App.css'
import { Toaster, toast } from 'react-hot-toast'

// Lazy load all page components - they won't be downloaded until needed
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'))
const Clients = lazy(() => import('./Pages/Clients'))
const Notes = lazy(() => import('./Pages/Notes'))
const Attachment = lazy(() => import('./Pages/Attachment'))
const Login = lazy(() => import('./Pages/Login'))
const Logout = lazy(() => import('./Pages/Logout'))
const AuditLog = lazy(() => import('./Pages/Audit log'))

// Preload functions to be called on hover (can still be used in Navbar)
export const preloadDashboard = () => import('./Pages/AdminDashboard')
export const preloadClients = () => import('./Pages/Clients')
export const preloadNotes = () => import('./Pages/Notes')
export const preloadAttachments = () => import('./Pages/Attachment')
export const preloadAuditLog = () => import('./Pages/Audit log')

// Lightweight skeleton placeholder for Suspense fallback
const PageLoader = () => (
  <div className="p-8 space-y-12 animate-pulse" dir="rtl">
    <div className="space-y-4">
      <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
      <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800"></div>
      <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800"></div>
      <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800"></div>
    </div>
  </div>
)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Dynamically import Echo only when logged in (saves ~150KB on initial load)
  useEffect(() => {
    if (isLoggedIn) {
      let cleanup = null;

      import('./echo').then(({ default: echo }) => {
        console.log('Connecting to Reverb...');
        const channel = echo.private('notifications');

        channel.listen('.note.created', (e) => {
          toast.success(`ملاحظة جديدة من أدمن آخر: ${e.note.note}`, {
            duration: 6000,
            position: 'top-left',
            style: {
              background: isDark ? '#1e293b' : '#fff',
              color: isDark ? '#fff' : '#1e293b',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            },
          });
        });

        channel.listen('.attachment.created', (e) => {
          toast.success(`تم رفع ملف جديد: ${e.attachment.file_name}`, {
            duration: 6000,
            position: 'top-left',
            style: {
              background: isDark ? '#1e293b' : '#fff',
              color: isDark ? '#fff' : '#1e293b',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            },
          });
        });

        cleanup = () => {
          echo.leave('notifications');
        };
      }).catch(err => {
        console.warn('Echo connection failed:', err);
      });

      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [isLoggedIn, isDark]);

  const PublicRoute = ({ children }) => {
    return !isLoggedIn ? children : <Navigate to="/" replace />;
  };

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <div
      className={`App min-h-screen transition-all duration-500`}
      style={{
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <Navbar
        setIsLoggedIn={setIsLoggedIn}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        isAuthPage={!isLoggedIn}
      />

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login setIsLoggedIn={setIsLoggedIn} />
              </PublicRoute>
            } />
            
            <Route path="/" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/clients" element={
              <PrivateRoute>
                <Clients />
              </PrivateRoute>
            } />
            
            <Route path="/notes" element={
              <PrivateRoute>
                <Notes />
              </PrivateRoute>
            } />
            
            <Route path="/attachments" element={
              <PrivateRoute>
                <Attachment />
              </PrivateRoute>
            } />
            
            <Route path="/audit-log" element={
              <PrivateRoute>
                <AuditLog />
              </PrivateRoute>
            } />
            
            <Route path="/logout" element={
              <Logout setIsLoggedIn={setIsLoggedIn} />
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster />
    </div>
  )
}

export default App
