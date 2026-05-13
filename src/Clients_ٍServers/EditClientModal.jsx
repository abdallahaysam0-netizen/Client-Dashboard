import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const EditClientModal = ({ isOpen, onClose, client, editForm, setEditForm, fetchClients }) => {
    const [error, setError] = useState('');
    if (!isOpen || !client) return null;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    const handleUpdateClient = async (e) => {
        e.preventDefault();
        setError('');

        if (!editForm.name || !editForm.email) {
            setError('يرجى ملء كافة الحقول المطلوبة');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/clients/${client.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                onClose();
                fetchClients();
                setError('');
                toast.success('تم تحديث بيانات العميل بنجاح');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'حدث خطأ أثناء تحديث البيانات');
                toast.error(errorData.message || 'حدث خطأ أثناء تحديث البيانات');
            }
        } catch (error) {
            console.error("Error updating client:", error);
            setError('خطأ في الاتصال بالسيرفر');
            toast.error('خطأ في الاتصال بالسيرفر');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-950 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-300 text-right border dark:border-slate-800" dir="rtl">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">×</button>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">تعديل بيانات العميل</h3>
                </div>
                
                <form onSubmit={handleUpdateClient} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                            <div className="bg-red-500 text-white p-2 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-red-700 dark:text-red-400 font-bold">{error}</span>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-black text-gray-400 dark:text-slate-500 mb-2 mr-2">اسم العميل</label>
                        <input 
                            type="text" 
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 outline-none font-bold transition-all text-gray-700 dark:text-slate-200"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-gray-400 dark:text-slate-500 mb-2 mr-2">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 outline-none font-bold transition-all text-gray-700 dark:text-slate-200"
                                value={editForm.email}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-gray-400 dark:text-slate-500 mb-2 mr-2">رقم الهاتف</label>
                            <input 
                                type="text" 
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 outline-none font-bold transition-all text-gray-700 dark:text-slate-200"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-black text-gray-400 dark:text-slate-500 mb-2 mr-2">الحالة</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                type="button"
                                onClick={() => setEditForm({...editForm, status: 'active'})}
                                className={`py-4 rounded-2xl font-black text-xs transition-all ${editForm.status === 'active' ? 'bg-green-600 text-white shadow-lg shadow-green-100 dark:shadow-green-900/20 scale-105' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                            >
                                نشط
                            </button>
                            <button 
                                type="button"
                                onClick={() => setEditForm({...editForm, status: 'pending'})}
                                className={`py-4 rounded-2xl font-black text-xs transition-all ${editForm.status === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100 dark:shadow-amber-900/20 scale-105' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                            >
                                قيد الانتظار
                            </button>
                            <button 
                                type="button"
                                onClick={() => setEditForm({...editForm, status: 'inactive'})}
                                className={`py-4 rounded-2xl font-black text-xs transition-all ${editForm.status === 'inactive' ? 'bg-red-600 text-white shadow-lg shadow-red-100 dark:shadow-red-900/20 scale-105' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                            >
                                معطل
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                        <button 
                            type="submit"
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            حفظ التعديلات
                        </button>
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;
