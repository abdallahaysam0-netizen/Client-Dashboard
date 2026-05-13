import React from 'react';

const ViewClientModal = ({ client, isOpen, onClose }) => {
    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 border dark:border-slate-800">
                <div className="h-32 bg-gradient-to-r from-red-200 via-indigo-400 to-indigo-900 dark:from-red-900/40 dark:via-indigo-900/60 dark:to-slate-950"></div>
                <div className="px-8 pb-8 -mt-16 text-right" dir="rtl">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-[2rem] bg-white dark:bg-slate-900 p-2 shadow-xl mb-4">
                            <div className="w-full h-full rounded-[1.8rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-4xl">
                                {client.name ? client.name.charAt(0) : '?'}
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{client.name}</h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-6">عميل مميز • ID {client.id}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-400 dark:text-slate-500 font-bold">البريد الإلكتروني</span>
                            <span className="text-gray-900 dark:text-slate-100 font-black">{client.email}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-400 dark:text-slate-500 font-bold">رقم الجوال</span>
                            <span className="text-gray-900 dark:text-slate-100 font-black">{client.phone || 'غير مسجل'}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-400 dark:text-slate-500 font-bold">حالة الحساب</span>
                            <span className={`font-black ${client.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {client.status === 'active' ? 'نشط بالكامل' : 'متوقف مؤقتاً'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 py-4 bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:bg-black dark:hover:bg-white transition-all active:scale-95"
                    >
                        إغلاق النافذة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewClientModal;
