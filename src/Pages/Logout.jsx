import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsLoggedIn }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            const token = localStorage.getItem('token');
            
            try {
                // إرسال طلب للباك اند لإبطال التوكن (Token Invalidation)
                if (token) {
                    await fetch(`${API_BASE_URL}/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // مسح البيانات من المتصفح في كل الأحوال
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('activePage'); // إعادة تعيين الصفحة النشطة
                setIsLoggedIn(false);
                navigate('/login', { replace: true });
            }
        };

        performLogout();
    }, [setIsLoggedIn, API_BASE_URL, navigate]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent transition-colors duration-500 overflow-hidden" dir="rtl">
            {/* الخلفية الجمالية المتوافقة مع التصميم الحالي */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]"></div>

            <div className="relative z-10 flex flex-col items-center gap-6 p-10 bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-cyan-500/20 dark:border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        👋
                    </div>
                </div>
                
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">جاري تسجيل الخروج</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">شكراً لعملكم.. نراكم قريباً</p>
                </div>

                <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                </div>
            </div>
        </div>
    );
};

export default Logout;
