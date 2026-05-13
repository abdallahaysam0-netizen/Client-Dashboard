import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const AddAttachmentModel = ({ isOpen, setIsOpen, formData, setFormData, clients, fetchAttachments }) => {
    const [error, setError] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

    if (!isOpen) return null;

    const handleClose = () => {
        setError('');
        setIsOpen(false);
    };

    const handleAddAttachment = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.client_id) {
            setError('يرجى اختيار اسم العميل');
            return;
        }

        try {
            const data = new FormData();
            data.append('client_id', formData.client_id);

            // إضافة الصور
            if (formData.images && formData.images.length > 0) {
                Array.from(formData.images).forEach(file => {
                    data.append('files[]', file);
                });
            }

            // إضافة ملفات PDF
            if (formData.pdfs && formData.pdfs.length > 0) {
                Array.from(formData.pdfs).forEach(file => {
                    data.append('files[]', file);
                });
            }

            if ((!formData.images || formData.images.length === 0) && (!formData.pdfs || formData.pdfs.length === 0)) {
                setError("يرجى اختيار ملف واحد على الأقل (صورة أو CV)");
                return;
            }

            setError('');

            const res = await fetch(`${API_BASE_URL}/attachments`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: data
            });

            if (res.ok) {
                toast.success("تم إضافة المرفقات بنجاح");
                fetchAttachments();
                setIsOpen(false);
                setFormData({ client_id: '', images: null, pdfs: null });

                window.dispatchEvent(new CustomEvent('local-notification', {
                    detail: {
                        type: 'attachment',
                        title: 'إرفاق ملفات',
                        message: `تم رفع ${(formData.images?.length || 0) + (formData.pdfs?.length || 0)} ملفات جديدة`
                    }
                }));
            } else {
                const errorData = await res.json();
                setError(errorData.message || "حدث خطأ أثناء إضافة المرفقات");
                toast.error(errorData.message || "حدث خطأ أثناء إضافة المرفقات");
            }
        } catch (error) {
            console.error(error);
            setError("فشل الاتصال بالسيرفر");
            toast.error("فشل الاتصال بالسيرفر");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-all" dir="rtl">
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border dark:border-slate-800">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 dark:bg-indigo-700 text-white">
                    <h2 className="text-2xl font-black">إضافة مرفقات جديدة</h2>
                    <button onClick={handleClose} className="text-2xl hover:rotate-90 transition-transform">✕</button>
                </div>

                <form onSubmit={handleAddAttachment} className='p-8 space-y-6'>
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
                    <div className='space-y-2'>
                        <label className='block font-black text-gray-700 dark:text-slate-300'>اختر اسم العميل</label>
                        <select
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200"
                            value={formData.client_id || ''}
                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                        >
                            <option value="" className="dark:bg-slate-900">-- اختر اسم العميل --</option>
                            {
                                clients.map(client => (
                                    <option key={client.id} value={client.id} className="dark:bg-slate-900">
                                        {client.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='grid grid-cols-1 gap-6'>
                        {/* Image Upload Box */}
                        <div className='space-y-2'>
                            <label className='block font-black text-gray-700 dark:text-slate-300'>صور شخصيه (Images)</label>
                            <div className="relative">
                                <input
                                    type='file'
                                    multiple
                                    accept="image/*"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500"
                                    onChange={(e) => setFormData({ ...formData, images: e.target.files })}
                                />
                                {formData.images && formData.images.length > 0 && (
                                    <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold">
                                        📸 تم اختيار {formData.images.length} صور
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PDF Upload Box */}
                        <div className='space-y-2'>
                            <label className='block font-black text-gray-700 dark:text-slate-300'>ملفات السيره الذاتيه (CV)</label>
                            <div className="relative">
                                <input
                                    type='file'
                                    multiple
                                    accept=".pdf"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500"
                                    onChange={(e) => setFormData({ ...formData, pdfs: e.target.files })}
                                />
                                {formData.pdfs && formData.pdfs.length > 0 && (
                                    <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-bold">
                                        📄 تم اختيار {formData.pdfs.length} ملفات CV
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button type='submit' className='w-full py-5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95'>
                            حفظ الملفات
                        </button>
                        <button type='button' onClick={handleClose} className='w-full py-5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black text-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all'>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAttachmentModel;