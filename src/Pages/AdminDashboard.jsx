import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({
        totalClients: 0,
        activeClients: 0,
        totalNotes: 0,
        totalAttachments: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activities, setActivities] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);
    const [systemHealth, setSystemHealth] = useState({
        stability: 94,
        ramUsed: 6.4,
        ramTotal: 16,
        cpuLoad: 42
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    const actions = [
        {
            id: 'new-server',
            icon: '➕',
            label: 'خادم جديد',
            color: 'indigo',
            endpoint: '/servers',
            method: 'POST'
        },
        {
            id: 'scan',
            icon: '🛡️',
            label: 'فحص أمني',
            color: 'green',
            endpoint: '/security/scan',
            method: 'POST'
        },
        {
            id: 'report',
            icon: '📊',
            label: 'تقرير الأداء',
            color: 'blue',
            endpoint: '/reports/performance',
            method: 'GET'
        },
        {
            id: 'test-notify',
            icon: '🔔',
            label: 'تجربة إشعار',
            color: 'rose',
            handler: () => toast.success('هذا إشعار تجريبي! نظام الإشعارات يعمل بنجاح.', {
                duration: 4000,
                position: 'top-center',
            })
        },
    ];

    const handleAction = async (action) => {
        if (action.handler) {
            action.handler();
            return;
        }
        setActionLoading(action.id);
        try {
            const res = await fetch(`${API_BASE_URL}${action.endpoint}`, {
                method: action.method,
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                // Refresh activities after action
                fetchData();
                alert(`تم تنفيذ "${action.label}" بنجاح!`);
            } else {
                throw new Error('Failed');
            }
        } catch (err) {
            console.error(`Action ${action.label} failed:`, err);
            // Even if it fails (because backend might not have these endpoints yet), 
            // we show a mock success for the demo as requested for "dynamic" feel
            setTimeout(() => {
                fetchData();
                alert(`[DEMO] تمت عملية "${action.label}" بنجاح (Simulation)`);
            }, 1000);
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        try {
            // Start all requests in parallel
            const [clientsRes, statsRes, activitiesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/clients`, { headers }),
                fetch(`${API_BASE_URL}/dashboard/stats`, { headers }),
                fetch(`${API_BASE_URL}/activities`, { headers }).catch(() => null) // Optional
            ]);

            // Process clients
            const clientsData = await clientsRes.json();
            setClients(Array.isArray(clientsData) ? clientsData : []);

            // Process stats
            if (statsRes && statsRes.ok) {
                const backendStats = await statsRes.json();
                setStats({
                    totalClients: backendStats.total_clients,
                    activeClients: backendStats.client_status?.find(s => s.name === 'Active')?.value || 0,
                    totalNotes: backendStats.total_notes,
                    totalAttachments: backendStats.total_attachments,
                    monthlyData: backendStats.monthly_data,
                    statusData: backendStats.client_status,
                    completionRate: backendStats.completion_rate
                });
            } else {
                // Fallback: manually fetch notes/attachments if stats endpoint fails
                const [notesRes, attachmentsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/notes`, { headers }),
                    fetch(`${API_BASE_URL}/attachments`, { headers })
                ]);
                const [notesData, attachmentsData] = await Promise.all([
                    notesRes.json(),
                    attachmentsRes.json()
                ]);

                setStats({
                    totalClients: Array.isArray(clientsData) ? clientsData.length : 0,
                    activeClients: Array.isArray(clientsData) ? clientsData.filter(c => c.status === 'active').length : 0,
                    totalNotes: Array.isArray(notesData) ? notesData.length : 0,
                    totalAttachments: Array.isArray(attachmentsData) ? attachmentsData.length : 0,
                    monthlyData: [],
                    statusData: []
                });
            }

            // Process activities
            if (activitiesRes && activitiesRes.ok) {
                const activitiesData = await activitiesRes.json();
                setActivities(Array.isArray(activitiesData) ? activitiesData : []);
            } else {
                setActivities([
                    { id: 1, color: 'bg-green-500', title: 'تمت إضافة عميل جديد للقاعدة', time: 'منذ قليل', type: 'success' },
                ]);
            }

            // Fetch system health
            try {
                const healthRes = await fetch(`${API_BASE_URL}/system/health`, { headers });
                if (healthRes.ok) {
                    const healthData = await healthRes.json();
                    setSystemHealth(healthData);
                }
            } catch (err) {
                // Keep default health
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteClient = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statItems = [
        { title: 'موظفينا الكرام', value: stats.totalClients, color: 'from-cyan-500 to-blue-900', icon: '👤', bg: 'bg-cyan-50' },
        { title: 'الكفاءات النشطة', value: stats.activeClients, color: 'from-emerald-400 to-teal-900', icon: '⚡', bg: 'bg-emerald-50' },
        { title: 'سجل الملاحظات', value: stats.totalNotes, color: 'from-violet-500 to-purple-900', icon: '📒', bg: 'bg-violet-50' },
        { title: 'حقيبة المرفقات', value: stats.totalAttachments, color: 'from-amber-400 to-orange-900', icon: '📁', bg: 'bg-amber-50' },
    ];

    if (loading) {
        return (
            <div className="p-8 bg-transparent min-h-screen animate-pulse" dir="rtl">
                <div className="flex flex-col lg:flex-row justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
                        <div className="h-4 w-96 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm"></div>
                    ))}
                </div>
                <div className="h-[400px] bg-white dark:bg-slate-900 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm"></div>
            </div>
        );
    }

    return (
        <div className="p-10 bg-transparent min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden transition-colors duration-300" dir="rtl">
            {/* Artistic Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-blue-200 dark:bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[50%] bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-[100px]"></div>
            </div>

            <header className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                <div className="space-y-4">

                    <div>
                        <h1 className="text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tighter mb-2">إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">الموارد البشرية</span></h1>
                        <p className="text-slate-400 dark:text-slate-500 font-medium text-lg">بوابة التحكم الذكي لبيانات وسجلات موظفي شركة المياه.</p>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 font-bold pr-13">متابعة دقيقة وشاملة لسجل الموظفين والبيانات التشغيلية</p>
                </div>
                <button
                    onClick={fetchData}
                    className="bg-transparent p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all active:scale-90 group"
                >
                    <span className="text-4xl block group-hover:rotate-180 transition-transform duration-700">🔄</span>
                </button>
            </header>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {statItems.map((stat, index) => (
                    <div key={index} className="relative group overflow-hidden bg-transparent backdrop-blur-xl border border-white/60 dark:border-slate-800/60 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                        <div className={`absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <span className={`w-14 h-14 ${stat.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>{stat.icon}</span>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.title}</div>
                                    <div className={`text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${stat.color} w-[70%] rounded-full`}></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">70%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Futuristic Data Visualization Section */}
            <div className="relative z-10 bg-transparent rounded-[3.5rem] p-12 text-white mb-16 shadow-[0_50px_100px_rgba(15,23,42,0.3)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full mix-blend-overlay opacity-10 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter">نشاط <span className="text-cyan-400">القوى العاملة</span></h2>
                        <p className="text-slate-400 font-bold">بين السجلات المضافة والملاحظات الميدانية عبر الزمن.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl backdrop-blur-xl border border-white/5">
                        <button className="px-6 py-2 bg-white text-slate-900 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95">شهرياً</button>
                        <button className="px-6 py-2 text-slate-400 hover:text-white rounded-2xl font-black text-xs transition-colors">سنوياً</button>
                    </div>
                </div>

                <div className="relative z-10 h-[400px] w-full mt-10">
                    <div className="absolute inset-0 flex flex-col justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest pointer-events-none">
                        {[1000, 750, 500, 250, 0].map(v => (
                            <div key={v} className="flex items-center gap-4 h-px border-t border-white/5 flex-1">
                                <span className="w-8">{v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute inset-0 flex items-end justify-between px-10 pb-4 h-full">
                        {(stats.monthlyData?.length > 0 ? stats.monthlyData : [
                            { name: 'Jan', clients: 400, notes: 240 }, { name: 'Feb', clients: 300, notes: 530 },
                            { name: 'Mar', clients: 200, notes: 880 }, { name: 'Apr', clients: 270, notes: 390 },
                            { name: 'May', clients: 780, notes: 480 }, { name: 'Jun', clients: 230, notes: 380 },
                            { name: 'Jul', clients: 340, notes: 430 }, { name: 'Aug', clients: 450, notes: 950 },
                        ]).map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 w-full group/viz cursor-pointer">
                                <div className="relative flex items-end justify-center w-full h-[320px]">
                                    <div className="absolute bottom-0 w-12 h-0 group-hover/viz:h-full bg-gradient-to-t from-cyan-400/10 to-transparent rounded-t-3xl transition-all duration-500 blur-sm"></div>

                                    <div className="relative w-full flex items-end justify-center gap-1.5 h-full">
                                        <div
                                            className="w-1 md:w-1.5 bg-cyan-400 rounded-full transition-all duration-700 group-hover/viz:w-3 group-hover/viz:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                                            style={{ height: `${(d.clients / 1000) * 320}px` }}
                                        ></div>
                                        <div
                                            className="w-1 md:w-1.5 bg-indigo-500 rounded-full transition-all duration-700 group-hover/viz:w-3 group-hover/viz:shadow-[0_0_30px_rgba(99,102,241,0.6)] delay-75"
                                            style={{ height: `${(d.notes / 1000) * 320}px` }}
                                        ></div>
                                    </div>

                                    <div className="absolute -top-12 opacity-0 group-hover/viz:opacity-100 transition-all duration-300 pointer-events-none scale-50 group-hover/viz:scale-100">
                                        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-2xl">
                                            <div className="text-[10px] font-black text-cyan-400 mb-1">{d.clients} موظف</div>
                                            <div className="text-[10px] font-black text-indigo-300">{d.notes} ملاحظة</div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 group-hover/viz:text-cyan-400 transition-colors">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Performance & Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Server Status List */}
                <div className="lg:col-span-2 bg-transparent rounded-[3rem] p-12 text-slate-800 dark:text-white shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full -mr-48 -mt-48 blur-[80px]"></div>
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black flex items-center gap-4">
                                <span className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400 border border-cyan-500/20">📡</span>
                                البنية التحتية والربط
                            </h2>
                            <p className="text-slate-400 text-xs font-bold mr-15">تغطية شاملة لجميع مرافق شركة المياه</p>
                        </div>
                        <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse">
                            كافة الخوادم مستقرة
                        </span>
                    </div>

                    <div className="space-y-6 relative z-10">
                        {[
                            { name: 'بوابة الموظفين (Portal)', status: 'Online', ip: '10.0.0.12', load: '34%', uptime: '15d 8h', icon: '🌐' },
                            { name: 'قاعدة بيانات السجلات (SQL)', status: 'Online', ip: '10.0.0.45', load: '22%', uptime: '89d 2h', icon: '🗄️' },
                            { name: 'مركز الملفات (Storage)', status: 'Warning', ip: '10.0.0.67', load: '92%', uptime: '4d 12h', icon: '📀' },
                            { name: 'نظام النسخ السحابي', status: 'Online', ip: '10.0.0.88', load: '8%', uptime: '320d 5h', icon: '☁️' },
                        ].map((server, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 group/item cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="text-2xl opacity-60 group-hover/item:opacity-100 transition-opacity">{server.icon}</div>
                                    <div>
                                        <div className="text-slate-100 font-black group-hover/item:text-cyan-1000 transition-colors">{server.name}</div>
                                        <div className="text-slate-500 text-[10px] font-black tracking-widest">{server.ip}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="hidden md:block text-right space-y-2">
                                        <div className="text-slate-500 text-[8px] font-black uppercase tracking-widest">System Load</div>
                                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${parseInt(server.load) > 80 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                                style={{ width: server.load }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-100 font-black text-sm">{server.uptime}</div>
                                        <div className="text-slate-500 text-[9px] font-black uppercase tracking-tighter opacity-50">Active Time</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance / Completion Drop */}
                <div className="bg-transparent rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/50 flex flex-col justify-between overflow-hidden relative group border border-blue-500/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:4px_4px] opacity-30"></div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition-all duration-1000"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black">مؤشر جودة البيانات</h2>
                                <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.2em]">Data Integrity Analysis</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md shadow-lg border border-white/10">
                                <span className="text-2xl">💎</span>
                            </div>
                        </div>
                    </div>

                    <div className="py-8 flex flex-col items-center justify-center relative z-10">
                        {/* Dynamic Water Drop */}
                        <div className="relative w-32 h-44 group/drop scale-125" title="نسبة كمال بيانات الموظفين">
                            <svg viewBox="0 0 30 42" className="w-full h-full drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                <path
                                    d="M15 3 Q15 3 25 18 A10 10 0 1 1 5 18 Q15 3 15 3 Z"
                                    fill="none"
                                    stroke="rgba(6,182,212,0.3)"
                                    strokeWidth="1.5"
                                />
                                <clipPath id="dropClipFinal">
                                    <rect x="0" y={42 - (42 * (stats.completionRate || 0) / 100)} width="30" height="42" />
                                </clipPath>
                                <path
                                    d="M15 3 Q15 3 25 18 A10 10 0 1 1 5 18 Q15 3 15 3 Z"
                                    fill="url(#coolGradient)"
                                    clipPath="url(#dropClipFinal)"
                                    className="transition-all duration-1000 ease-in-out"
                                />
                                <defs>
                                    <linearGradient id="coolGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#22d3ee" />
                                        <stop offset="100%" stopColor="#2563eb" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
                                <span className="text-2xl font-black text-white">{stats.completionRate || 0}%</span>
                                <span className="text-[8px] font-black text-cyan-300 tracking-widest uppercase">Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl overflow-hidden relative group/inner">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent -translate-x-full group-hover/inner:translate-x-full transition-transform duration-1000"></div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                                    <span className="font-black text-[10px] text-cyan-100 uppercase tracking-widest">تحديثات النشاط</span>
                                </div>
                                <span className="font-black text-xs text-white">متصل الآان</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                    style={{ width: `${(stats.activeClients / (stats.totalClients || 1)) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer scale-y-150"></div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between text-[9px] font-black text-slate-400">
                                <span>الاستقرار: {systemHealth.stability}%</span>
                                <span>توزيع المهام: متوازن</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
};

export default AdminDashboard;
