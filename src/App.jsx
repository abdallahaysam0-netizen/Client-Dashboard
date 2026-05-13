import { useState, useEffect } from 'react'
import AdminDashboard from './Pages/AdminDashboard'
import Clients from './Pages/Clients'
import Notes from './Pages/Notes'
import Attachment from './Pages/Attachment'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Logout from './Pages/Logout'
import AuditLog from './Pages/Audit log'
import Navbar from './components/Common/Navbar'
import './App.css'
import { Toaster, toast } from 'react-hot-toast'
import echo from './echo'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [authPage, setAuthPage] = useState('login');
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('activePage') || 'dashboard';
  });

  // منطق الوضع الليلي المكتوب مباشرة هنا لضمان السرعة والدقة
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('activePage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (isLoggedIn) {
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

      return () => {
        echo.leave('notifications');
      };
    }
  }, [isLoggedIn, isDark]);

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen transition-all duration-500"
        style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
      >
        <Navbar 
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          isAuthPage={true} 
        />
        {authPage === 'login' ? (
          <Login setIsLoggedIn={setIsLoggedIn} onSwitchToRegister={() => setAuthPage('register')} />
        ) : (
          <Register setIsLoggedIn={setIsLoggedIn} onSwitchToLogin={() => setAuthPage('login')} />
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <AdminDashboard />;
      case 'clients': return <Clients />;
      case 'notes': return <Notes />;
      case 'attachments': return <Attachment />;
      case 'audit-log': return <AuditLog />;
      case 'logout': return <Logout setIsLoggedIn={setIsLoggedIn} />;
      default: return <AdminDashboard />;
    }
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
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setIsLoggedIn={setIsLoggedIn} 
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      <main>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  )
}

export default App
