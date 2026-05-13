import React from 'react';

const AddNoteModel = ({ showAddModal, setShowAddModal, formData, setFormData, clients, handleCreate, error, setError }) => {
    const handleClose = () => {
        setError('');
        setShowAddModal(false);
    };

    if (!showAddModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-all" dir="rtl">
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border dark:border-slate-800">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 dark:bg-indigo-700 text-white">
                    <h2 className="text-2xl font-black">إضافة ملاحظة جديدة</h2>
                    <button onClick={handleClose} className="text-2xl hover:rotate-90 transition-transform">✕</button>
                </div>
                <form onSubmit={handleCreate} className="p-8 space-y-6">
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
                    <div className="space-y-2">
                        <label className="block text-sm font-black text-gray-700 dark:text-slate-300">اختر العميل</label>
                        <select 
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200"
                            value={formData.client_id}
                            onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                        >
                            <option value="" className="dark:bg-slate-900 text-gray-400">-- اختر العميل --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} className="dark:bg-slate-900">{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-black text-gray-700 dark:text-slate-300">الملاحظة</label>
                        <textarea 
                            rows="4"
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200"
                            placeholder="اكتب الملاحظة هنا..."
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full py-5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95">
                        حفظ الملاحظة
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNoteModel;
