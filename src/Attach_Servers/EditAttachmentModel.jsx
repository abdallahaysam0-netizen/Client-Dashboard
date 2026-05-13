import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const EditAttachmentModel = ({ isOpen, onClose, editForm, setEditForm, clients, fetchAttachments, id }) => {
    const [error, setError] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    const [fileType, setFileType] = useState(null); // 'image' or 'pdf'

    useEffect(() => {
        if (isOpen && editForm.file && typeof editForm.file === 'string') {
            if (isImage(editForm.file)) setFileType('image');
            else if (isPdf(editForm.file)) setFileType('pdf');
        }
    }, [isOpen, editForm.file]);

    if (!isOpen) return null;
    
    const handleInternalClose = () => {
        setError('');
        onClose();
    };

    const handleEditAttachment = async (e) => {
        e.preventDefault();
        setError('');

        if (!editForm.client_id) {
            setError('يرجى اختيار اسم العميل');
            return;
        }

        try {
            const data = new FormData();
            data.append('client_id', editForm.client_id);
            
            // Only append file if a new one is selected
            if (editForm.file && typeof editForm.file !== 'string') {
                data.append('file', editForm.file);
            }
            
            data.append('status', editForm.status);
            data.append('_method', 'PUT'); // Necessary for Laravel to handle multipart/form-data via POST as PUT

            const res = await fetch(`${API_BASE_URL}/attachments/${id}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                },
                body: data,
            });

            if (res.ok) {
                onClose();
                fetchAttachments();
                setError('');
                toast.success('تم تحديث بيانات المرفق بنجاح');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'حدث خطأ أثناء تحديث البيانات');
                toast.error(errorData.message || 'حدث خطأ أثناء تحديث البيانات');
            }
        } catch (error) {
            console.error('Error updating attachment:', error);
            setError('فشل الاتصال بالسيرفر');
            toast.error('فشل الاتصال بالسيرفر');
        }
    };

    const isImage = (path) => {
        if (!path) return false;
        return /\.(jpg|jpeg|png|gif|webp|jfif|svg|bmp)$/i.test(path.split('?')[0]);
    };

    const isPdf = (path) => {
        if (!path) return false;
        return /\.pdf$/i.test(path.split('?')[0]);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-all" dir="rtl">
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border dark:border-slate-800">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 dark:bg-indigo-700 text-white">
                    <h2 className="text-2xl font-black">تعديل بيانات المرفق</h2>
                    <button onClick={handleInternalClose} className="text-2xl hover:rotate-90 transition-transform">✕</button>
                </div>

                <form onSubmit={handleEditAttachment} className='p-8 space-y-6'>
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
                        <label className='block font-black text-gray-700 dark:text-slate-300 mr-2'>اسم العميل</label>
                        <select 
                            value={editForm.client_id || ''} 
                            onChange={(e) => setEditForm({ ...editForm, client_id: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-gray-700 dark:text-slate-200"
                        >
                            <option value="" className="dark:bg-slate-900">-- اختر العميل --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} className="dark:bg-slate-900">{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='grid grid-cols-1 gap-4'>
                        {/* Image Section */}
                        {fileType === 'image' && (
                            <div className='space-y-2'>
                                <label className='block font-black text-gray-700 dark:text-indigo-400 mr-2 text-indigo-700'>تغيير الصورة الشخصية (Image)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className='w-full px-6 py-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 outline-none font-bold transition-all text-gray-700 dark:text-slate-200'
                                    onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                                />
                                {editForm.file && typeof editForm.file === 'string' && isImage(editForm.file) && (
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 mr-2 italic font-bold">📸 الصورة الحالية: {editForm.file.split('/').pop()}</p>
                                )}
                            </div>
                        )}

                        {/* PDF Section */}
                        {fileType === 'pdf' && (
                            <div className='space-y-2'>
                                <label className='block font-black text-gray-700 dark:text-red-400 mr-2 text-red-700'>تغيير ملف السيرة الذاتية (CV)</label>
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    className='w-full px-6 py-4 bg-red-50/50 dark:bg-red-900/10 border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-2xl focus:border-red-500 dark:focus:border-red-600 outline-none font-bold transition-all text-gray-700 dark:text-slate-200'
                                    onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                                />
                                {editForm.file && typeof editForm.file === 'string' && isPdf(editForm.file) && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 mr-2 italic font-bold">📄 ملف CV الحالي: {editForm.file.split('/').pop()}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label className='block font-black text-gray-700 dark:text-slate-300 mr-2'>حالة المرفق</label>
                        <select 
                            value={editForm.status || 'pending'} 
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} 
                            className='w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-600 outline-none font-bold transition-all text-gray-700 dark:text-slate-200'
                        >
                            <option value="pending" className="dark:bg-slate-900">قيد الانتظار</option>
                            <option value="done" className="dark:bg-slate-900">تم التنفيذ</option>
                            <option value="cancelled" className="dark:bg-slate-900">إلغاء</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button type='submit' className='w-full py-5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95'>
                            حفظ التعديلات
                        </button>
                        <button type='button' onClick={handleInternalClose} className='w-full py-5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black text-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all'>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAttachmentModel;