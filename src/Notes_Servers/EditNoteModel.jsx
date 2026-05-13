import React from 'react';

const EditNoteModel = ({ showEditModal, setShowEditModal, formData, setFormData, handleUpdate, isNoteChanged, error, setError }) => {
    const handleClose = () => {
        setError('');
        setShowEditModal(false);
    };

    if (!showEditModal) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-all" dir="rtl">
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border dark:border-slate-800">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-amber-500 dark:bg-amber-600 text-white">
                    <h2 className="text-2xl font-black">تعديل الملاحظة</h2>
                    <button onClick={handleClose} className="text-2xl hover:rotate-90 transition-transform">✕</button>
                </div>
                <form onSubmit={handleUpdate} className="p-8 space-y-6">
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
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 dark:text-slate-300">تعديل الملاحظة</label>
                            <textarea
                                rows="4"
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-amber-500 dark:focus:border-amber-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200"
                                placeholder="اكتب الملاحظة هنا..."
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            ></textarea>
                        </div>

                        {!isNoteChanged && (
                            <div className="flex items-center p-4 text-sm text-amber-800 dark:text-amber-400 border-2 border-amber-200 dark:border-amber-900/30 rounded-2xl bg-amber-50 dark:bg-amber-900/10 animate-pulse" role="alert">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <div className="font-bold">
                                    لا يوجد تعديل في الملاحظة
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isNoteChanged}
                        className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                            isNoteChanged 
                            ? "bg-amber-500 dark:bg-amber-600 text-white shadow-amber-200 dark:shadow-amber-900/20 hover:bg-amber-600 dark:hover:bg-amber-700 hover:scale-[1.02]" 
                            : "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                        }`}
                    >
                        تحديث الملاحظة
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditNoteModel;
