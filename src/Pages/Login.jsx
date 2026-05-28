import React, { useState } from 'react';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsLoggedIn(true);
            } else {
                if (data.errors) {
                    setFieldErrors(data.errors);
                    setError(data.message || 'يرجى مراجعة الحقول الحمراء');
                } else {
                    setError(data.message || 'حدث خطأ في تسجيل الدخول. يرجى التحقق من بياناتك.');
                }
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden font-sans transition-colors duration-500" dir="rtl">
            {/* Artistic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]"></div>

            <div className="relative z-10 w-full max-w-md p-4 animate-in">
                <div className="bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"></div>

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 transform hover:rotate-6 transition-all duration-500 group animate-float">
                            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 15C20.407 16.511 19.336 17.771 17.892 18.528C16.448 19.284 14.722 19.49 13.062 19.102C11.401 18.714 9.919 17.757 8.913 16.425C7.907 15.093 7.436 13.479 7.595 11.906C7.754 10.334 8.533 8.897 9.774 7.884C11.016 6.871 12.637 6.347 14.312 6.417C15.986 6.487 17.604 7.146 18.841 8.261C20.077 9.377 20.849 10.876 20.941 12.457" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 7 8 7 11.5C7 14.5376 9.23858 17 12 17C14.7614 17 17 14.5376 17 11.5" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">تسجيل الدخول</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">لوحة تحكم شركة المياه</p>
                            <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6" noValidate>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                                <span className="text-xl">🚨</span>
                                {error === 'The given data was invalid.' ? 'يرجى تصحيح الأخطاء الموضحة أدناه' : error}
                            </div>
                        )}

                        <div className={`space-y-2 ${fieldErrors.email ? 'animate-shake' : ''}`}>
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors">
                                    📧
                                </div>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${fieldErrors.email ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-200 dark:border-white/10'} rounded-2xl py-4 pr-12 pl-4 text-gray-900 dark:text-white font-bold outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                                    placeholder="admin@water.co"
                                />
                                {fieldErrors.email && (
                                    <div className="text-red-400 text-xs font-bold mt-2 mr-2 flex items-center gap-1 animate-in">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                        {fieldErrors.email[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`space-y-2 ${fieldErrors.password ? 'animate-shake' : ''}`}>
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors">
                                    🔒
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${fieldErrors.password ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-200 dark:border-white/10'} rounded-2xl py-4 pr-12 pl-4 text-gray-900 dark:text-white font-bold outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                                    placeholder="••••••••"
                                />
                                {fieldErrors.password && (
                                    <div className="text-red-400 text-xs font-bold mt-2 mr-2 flex items-center gap-1 animate-in">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                        {fieldErrors.password[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>جاري التحقق...</span>
                                </div>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    دخول آمن
                                    <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
                                </span>
                            )}
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </form>



                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-slate-500 text-xs font-bold">نظام محمي وآمن © {new Date().getFullYear()}</p>
                        <div className="flex gap-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">جميع الأنظمة مستقرة</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations moved to index.css for better performance */}
        </div>
    );
};

export default Login;
