import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/activities`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            } else {
                toast.error("فشل في مزامنة السجلات مع الخادم");
            }
        } catch (error) {
            console.error("Error fetching audit logs:", error);
            toast.error("حدث خطأ في الاتصال بالنظام");
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = (log.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.admin || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || log.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-transparent">
                <div className="relative">
                    <div className="w-20 h-20 border-[6px] border-indigo-600/10 rounded-full"></div>
                    <div className="absolute top-0 w-20 h-20 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 text-indigo-600 font-black tracking-widest animate-pulse uppercase text-sm">جاري مزامنة السجلات...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-transparent min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900" dir="rtl">
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .audit-card {
                    animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    opacity: 0;
                }
            `}</style>

            <header className="mb-12 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-10 h-1 bg-indigo-600 rounded-full"></span>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">نظام المراقبة الذكي</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-3">
                            سجل <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">المراجعة</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                            تتبع فوري ودقيق لجميع التغييرات والأنشطة داخل النظام لضمان أعلى مستويات الشفافية والأمان.
                        </p>
                    </div>

                    <button
                        onClick={fetchLogs}
                        className="group flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all active:scale-95 overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        <span className="relative z-10 text-xl group-hover:rotate-180 transition-transform duration-500 inline-block">🔄</span>
                        <span className="relative z-10 font-black text-slate-600 dark:text-slate-300">تحديث البيانات</span>
                    </button>
                </div>
            </header>

            {/* Stats Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'إجمالي الحركات', value: logs.length, bg: 'bg-indigo-500', lightBg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: '📊' },
                    { label: 'نشط اليوم', value: logs.filter(l => l.time.includes('دقيقة') || l.time.includes('ساعة')).length, bg: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: '⚡' },
                    { label: 'أدمن نشط', value: [...new Set(logs.map(l => l.admin))].length, bg: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-900/20', icon: '👤' },
                    { label: 'تنبيهات حرجة', value: logs.filter(l => l.type === 'error').length, bg: 'bg-rose-500', lightBg: 'bg-rose-50 dark:bg-rose-900/20', icon: '🛑' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-all duration-700 group-hover:scale-150`}></div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className={`w-12 h-12 flex items-center justify-center ${stat.lightBg} text-2xl rounded-2xl`}>{stat.icon}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-4xl font-black text-slate-800 dark:text-white">
                            {stat.value}
                            <span className="text-sm font-medium text-slate-400 mr-2">عملية</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col xl:flex-row gap-6 mb-10 bg-white/50 dark:bg-slate-900/30 p-4 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-sm backdrop-blur-md">
                <div className="flex-1 relative group">
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors text-xl">🔍</span>
                    <input
                        type="text"
                        placeholder="ابحث عن مسؤولي النظام، الموظفين، أو نوع العملية..."
                        className="w-full pr-16 pl-6 py-5 bg-white dark:bg-slate-800 border-none rounded-[1.8rem] shadow-sm focus:ring-4 focus:ring-indigo-500/10 dark:text-white transition-all outline-none font-bold placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-[1.8rem]">
                    {[
                        { id: 'all', label: 'الكل', color: 'slate' },
                        { id: 'success', label: 'عمليات الإضافة', color: 'emerald' },
                        { id: 'warning', label: 'عمليات التعديل', color: 'amber' },
                        { id: 'error', label: 'عمليات الحذف', color: 'rose' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setFilterType(type.id)}
                            className={`px-8 py-4 rounded-[1.3rem] font-black text-xs transition-all duration-300 ${filterType === type.id
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/5'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Audit List Container */}
            <div className="space-y-6 max-w-6xl mx-auto">
                {filteredLogs.map((log, index) => (
                    <div
                        key={log.id}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        className="audit-card group bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 p-8 rounded-[3rem] hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-500 relative"
                    >
                        {/* Type Indicator */}
                        <div className={`absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-16 ${log.color || 'bg-indigo-500'} rounded-full opacity-40 group-hover:opacity-100 transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:h-24`}></div>

                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                            <div className="flex items-start md:items-center gap-6 flex-1">
                                <div className={`flex-shrink-0 w-20 h-20 ${log.color || 'bg-indigo-500'} bg-opacity-5 dark:bg-opacity-10 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-700`}>
                                    {log.type === 'success' ? '➕' : log.type === 'warning' ? '✏️' : log.type === 'error' ? '🗑️' : '🔔'}
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded-full border border-slate-100 dark:border-slate-700">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                                            {log.admin}
                                        </div>
                                        <span className="text-slate-300 dark:text-slate-600 text-[10px] font-bold">— {log.time}</span>
                                        {log.ip && (
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[9px] font-bold rounded-md mono">
                                                IP: {log.ip}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                                        {log.title}
                                    </h3>
                                    <p className="text-slate-400 dark:text-slate-500 text-sm font-bold flex items-center gap-2">
                                        <span className="w-5 h-px bg-slate-200 dark:bg-slate-800"></span>
                                        {log.details || 'تم التحقق من العملية وتوثيقها في قواعد البيانات المركزية.'}
                                    </p>
                                </div>
                            </div>


                        </div>
                    </div>
                ))}

                {filteredLogs.length === 0 && (
                    <div className="py-32 text-center bg-white dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="text-8xl mb-6 grayscale opacity-20">🕳️</div>
                        <h3 className="text-2xl font-black text-slate-400 mb-2">السجل يبدو فارغاً هنا</h3>
                        <p className="text-slate-500 text-sm font-bold">لا توجد نتائج تطابق معايير البحث الحالية.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                            className="mt-8 text-indigo-600 font-black text-sm hover:underline"
                        >
                            إعادة ضبط الفلاتر
                        </button>
                    </div>
                )}
            </div>

            <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <div>نظام سجل المراجعة المركزي v2.1.0</div>
                <div className="flex gap-6">
                    <span className="hover:text-indigo-500 transition-colors cursor-pointer">سياسة الأمان</span>
                    <span className="hover:text-indigo-500 transition-colors cursor-pointer">الدعم الفني</span>
                    <span className="hover:text-indigo-500 transition-colors cursor-pointer">سجلات النظام</span>
                </div>
                <div>جميع الحقوق محفوظة - شركة المياه 2026</div>
            </footer>
        </div>
    );
};

export default AuditLog;
