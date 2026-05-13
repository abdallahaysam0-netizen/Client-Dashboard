import React, { useState } from 'react';
const Register = ({ setIsLoggedIn, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    password_confirmation: passwordConfirmation 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsLoggedIn(true);
            } else {
                if (data.errors) {
                    setFieldErrors(data.errors);
                    setError('يرجى تصحيح الأخطاء الموضحة أدناه');
                } else {
                    setError(data.message || 'حدث خطأ في عملية التسجيل.');
                }
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.');
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden font-sans transition-colors duration-500" dir="rtl">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]"></div>
            
            <div className="relative z-10 w-full max-w-lg p-4">
                <div className="bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"></div>
                    
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 transform hover:rotate-6 transition-all duration-500">
                             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">إنشاء حساب جديد</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">انضم إلى لوحة تحكم شركة المياه</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5" noValidate>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                                <span className="text-xl">🚨</span>
                                {error}
                            </div>
                        )}

                        <div className={`space-y-2 ${fieldErrors.name ? 'animate-shake' : ''}`}>
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">الاسم بالكامل</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors">
                                    👤
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${fieldErrors.name ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-200 dark:border-white/10'} rounded-2xl py-4 pr-12 pl-4 text-gray-900 dark:text-white font-bold outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                                    placeholder="الاسم الثلاثي..."
                                />
                                {fieldErrors.name && (
                                    <div className="text-red-400 text-xs font-bold mt-2 mr-2 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                        {fieldErrors.name[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`space-y-2 ${fieldErrors.email ? 'animate-shake' : ''}`}>
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors">
                                    📧
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-white/5 border ${fieldErrors.email ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-200 dark:border-white/10'} rounded-2xl py-4 pr-12 pl-4 text-gray-900 dark:text-white font-bold outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                                    placeholder="name@example.com"
                                />
                                {fieldErrors.email && (
                                    <div className="text-red-400 text-xs font-bold mt-2 mr-2 flex items-center gap-1">
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
                                    <div className="text-red-400 text-xs font-bold mt-2 mr-2 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                        {fieldErrors.password[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">تأكيد كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors">
                                    🛡️
                                </div>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pr-12 pl-4 text-gray-900 dark:text-white font-bold outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>جاري الإنشاء...</span>
                                </div>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    إنشاء الحساب
                                    <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
                                </span>
                            )}
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-sm font-bold">
                            لديك حساب بالفعل؟{' '}
                            <button 
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-400/30 underline-offset-4 font-bold"
                            >
                                تسجيل الدخول
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-in { animation: fadeIn 0.8s ease-out forwards; }
            `}} />
        </div>
    );
};

export default Register;
