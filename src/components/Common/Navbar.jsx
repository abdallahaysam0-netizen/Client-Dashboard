import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

// Define preloading logic to be triggered on hover for "Instant" feel
const preloadDashboard = () => import('../../Pages/AdminDashboard');
const preloadClients = () => import('../../Pages/Clients');
const preloadNotes = () => import('../../Pages/Notes');
const preloadAttachments = () => import('../../Pages/Attachment');
const preloadAuditLog = () => import('../../Pages/Audit log');

const Navbar = ({ setIsLoggedIn, isDark, toggleDarkMode, isAuthPage }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) return;
            const data = await response.json();
            const mapped = data.map(n => {
                const innerData = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                return {
                    id: n.id,
                    type: innerData.type,
                    title: innerData.title,
                    message: innerData.message,
                    time: new Date(n.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                    read: n.read_at !== null
                };
            });
            setNotifications(mapped);
            setUnreadCount(mapped.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (!isAuthPage) {
            fetchNotifications();

            const token = localStorage.getItem('token');
            if (!token) return;

            let cleanup = null;

            // Import echo dynamically to keep it out of the initial bundle
            import('../../echo').then(({ default: echo }) => {
                const userData = JSON.parse(atob(token.split('.')[1]));
                const channel = echo.private(`App.Models.User.${userData.sub}`);
                
                const handleNotification = (e) => {
                    const newNotif = {
                        id: e.id,
                        type: e.data.type,
                        title: e.data.title,
                        message: e.data.message,
                        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                        read: false
                    };
                    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
                    setUnreadCount(prev => prev + 1);
                };

                const addNotification = (data) => {
                    const newNotif = {
                        id: Date.now(),
                        type: data.type,
                        title: data.title,
                        message: data.message,
                        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                        read: false
                    };
                    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
                    setUnreadCount(prev => prev + 1);
                };

                const handleLocalNotification = (e) => {
                    addNotification(e.detail);
                };

                window.addEventListener('local-notification', handleLocalNotification);
                channel.notification(handleNotification);

                cleanup = () => {
                    window.removeEventListener('local-notification', handleLocalNotification);
                    echo.leave(`App.Models.User.${userData.sub}`);
                };
            }).catch(err => console.error('Navbar Echo initialization failed:', err));

            return () => {
                if (cleanup) cleanup();
            };
        }
    }, [isAuthPage]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/mark-as-read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking notifications read:', error);
        }
    };
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const permissions = user.permissions || [];
    const roles = user.roles || [];

    const hasPermission = (permission) => permissions.includes(permission) || roles.includes('Admin');

    const navLinkClass = ({ isActive }) => 
        `font-bold px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
            isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800'
            : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
        }`;

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-4 flex gap-6 items-center sticky top-0 z-50 shadow-sm transition-colors duration-300" dir="rtl">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transform transition-transform hover:rotate-12">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black bg-gradient-to-l from-indigo-700 via-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300 bg-clip-text text-transparent leading-none">
                            مشروع العملاء
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
                            شركة المياه
                        </span>
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 dark:bg-slate-800 mx-2"></div>

                {!isAuthPage && (
                    <div className="flex gap-2">
                        <NavLink
                            to="/"
                            onMouseEnter={preloadDashboard}
                            className={navLinkClass}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`}></span>
                                    لوحة التحكم
                                </>
                            )}
                        </NavLink>

                        {hasPermission('view-clients') && (
                            <NavLink
                                to="/clients"
                                onMouseEnter={preloadClients}
                                className={navLinkClass}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`}></span>
                                        إدارة العملاء
                                    </>
                                )}
                            </NavLink>
                        )}

                        {hasPermission('view-notes') && (
                            <NavLink
                                to="/notes"
                                onMouseEnter={preloadNotes}
                                className={navLinkClass}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`}></span>
                                        إدارة الملاحظات
                                    </>
                                )}
                            </NavLink>
                        )}

                        {hasPermission('view-attachments') && (
                            <NavLink
                                to="/attachments"
                                onMouseEnter={preloadAttachments}
                                className={navLinkClass}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`}></span>
                                        إدارة المرفقات
                                    </>
                                )}
                            </NavLink>
                        )}

                        {hasPermission('view-activity-logs') && (
                            <NavLink
                                to="/audit-log"
                                onMouseEnter={preloadAuditLog}
                                className={navLinkClass}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`}></span>
                                        سجل المراجعة
                                    </>
                                )}
                            </NavLink>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => toggleDarkMode()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 border border-gray-200 dark:border-slate-700"
                    title={isDark ? "الوضع الليلي" : "الوضع المضيء"}
                >
                    {isDark ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 110 2 1 1 0 010-2zm-5.657-2.343a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                
                {!isAuthPage && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) markAllAsRead();
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border ${
                                showNotifications 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
                                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                            title="التنبيهات"
                        >
                            <div className="relative">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                                            {unreadCount}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200 origin-top-left">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                    <span className="font-bold text-gray-900 dark:text-slate-100 italic">التنبيهات الأخيرة</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full font-bold">
                                        {notifications.length} إجمالي
                                    </span>
                                </div>
                                
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div 
                                                key={notif.id} 
                                                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-0 relative group`}
                                            >
                                                {!notif.read && (
                                                    <div className="absolute right-2 top-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                                <div className="flex flex-col gap-1 pr-4">
                                                    <div className="flex justify-between items-start">
                                                        <span className={`text-xs font-bold ${notif.type === 'note' ? 'text-indigo-500' : 'text-emerald-500'}`}>
                                                            {notif.type === 'note' ? '📝 ' : '📎 '}{notif.title}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">{notif.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center opacity-40">
                                            <span className="text-4xl mb-2">🔔</span>
                                            <p className="text-sm font-bold">لا يوجد تنبيهات حالياً</p>
                                        </div>
                                    )}
                                </div>
                                
                                {notifications.length > 0 && (
                                    <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800/50 text-center border-t border-gray-100 dark:border-slate-800">
                                        <button 
                                            onClick={() => setNotifications([])}
                                            className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            مسح كل التنبيهات
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!isAuthPage && (
                    <>
                        <div className="flex flex-col text-left items-end">
                            <span className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-none">{user.name}</span>
                            <span className="text-[10px] font-medium text-green-500">{roles.join(', ') || 'مستخدم'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group relative">
                                <span className="text-lg">👤</span>
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/logout');
                                }}
                                className="w-10 h-10 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-red-500 dark:text-red-400"
                                title="تسجيل الخروج"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
