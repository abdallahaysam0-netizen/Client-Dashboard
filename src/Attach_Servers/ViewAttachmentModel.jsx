// f:\client-Dashboard\client-dashboard\src\Attach_Servers\ViewAttachmentModel.jsx

import React, { useEffect, useState } from 'react';

const ViewAttachmentModel = ({ isOpen, onClose, attachment, clientName }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const SERVER_URL = API_BASE_URL.replace('/api', '');

    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState(false);

    const getFileUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const baseUrl = SERVER_URL.endsWith('/') ? SERVER_URL.slice(0, -1) : SERVER_URL;
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        if (cleanPath.startsWith('storage/')) return `${baseUrl}/${cleanPath}`;
        return `${baseUrl}/storage/${cleanPath}`;
    };

    const isImage = (path) => {
        if (!path) return false;
        if (path.startsWith('data:image/')) return true;
        return /\.(jpg|jpeg|png|gif|webp|jfif|svg|bmp)$/i.test(path.split('?')[0]);
    };

    const isPdf = (path) => {
        if (!path) return false;
        return /\.pdf$/i.test(path.split('?')[0]);
    };

    const fileUrl = getFileUrl(attachment?.file_path);

    // =====================================================
    // الحل النهائي لـ IDM:
    // 1. نطلب الـ PDF كـ JSON مشفر base64
    //    (IDM ما بيخطفش JSON responses)
    // 2. نفك تشفير الـ base64 في المتصفح
    // 3. نعمل Blob URL محلي للعرض
    // =====================================================
    useEffect(() => {
        if (!isOpen || !attachment || !isPdf(attachment.file_path)) return;

        let objectUrl = null;
        setPdfLoading(true);
        setPdfError(false);
        setPdfBlobUrl(null);

        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/attachments/${attachment.id}/base64`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(({ data, mime_type }) => {
                // فك تشفير base64 وتحويله لـ Blob
                const binary = atob(data);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: mime_type || 'application/pdf' });
                objectUrl = URL.createObjectURL(blob);
                setPdfBlobUrl(objectUrl);
                setPdfLoading(false);
            })
            .catch(err => {
                console.error('فشل تحميل PDF:', err);
                setPdfError(true);
                setPdfLoading(false);
            });

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [isOpen, attachment?.id]);

    const handleClose = () => {
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
        }
        onClose();
    };

    if (!isOpen || !attachment) return null;

    const fileName = attachment.file_path?.split('/').pop() || 'مستند';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-950/80 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border dark:border-slate-800"
                style={{ maxHeight: '92vh' }}
            >
                {/* ===== Header ===== */}
                <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 bg-gradient-to-l from-indigo-700 to-indigo-500 dark:from-indigo-800 dark:to-indigo-600 text-white" dir="rtl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                            {isPdf(attachment.file_path) ? '📄' : '🖼️'}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 font-black text-lg transition-all hover:rotate-90"
                    >✕</button>
                </div>

                {/* ===== Client Badge ===== */}
                <div className="flex-shrink-0 flex items-center justify-center gap-3 py-4 bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/20" dir="rtl">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center text-white font-black text-base shadow">
                        {clientName?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-indigo-400 dark:text-indigo-500 tracking-widest">العميل</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">{clientName || 'غير متوفر'}</p>
                    </div>
                </div>

                {/* ===== Content ===== */}
                <div className="flex-1 overflow-auto bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-6 min-h-[420px]">
                    {attachment.file_path ? (

                        isImage(attachment.file_path) ? (
                            /* ======= عرض الصورة مثل المعرض ======= */
                            <div className="relative w-full flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="absolute -inset-3 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl shadow-gray-400/30 dark:shadow-black/50" />
                                    <img
                                        src={fileUrl}
                                        alt={fileName}
                                        className="relative max-w-full rounded-[1.5rem] object-contain shadow-xl"
                                        style={{ maxHeight: '55vh' }}
                                        onError={(e) => {
                                            const baseUrl = SERVER_URL.endsWith('/') ? SERVER_URL.slice(0, -1) : SERVER_URL;
                                            const cleanPath = attachment.file_path.startsWith('/') ? attachment.file_path.substring(1) : attachment.file_path;
                                            e.target.src = `${baseUrl}/${cleanPath}`;
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold mt-6">{fileName}</p>
                            </div>

                        ) : isPdf(attachment.file_path) ? (
                            /* ======= عرض PDF عبر Base64 Blob (يتجاوز IDM كلياً) ======= */
                            <div className="w-full flex flex-col items-center gap-4">

                                {pdfLoading && (
                                    <div className="flex flex-col items-center justify-center py-24 gap-5">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/20" />
                                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-indigo-700 dark:text-indigo-400 font-black text-lg">جاري تحميل المستند...</p>
                                            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">يرجى الانتظار قليلاً</p>
                                        </div>
                                    </div>
                                )}

                                {pdfError && (
                                    <div className="flex flex-col items-center justify-center py-20 gap-5 w-full max-w-sm text-center">
                                        <div className="w-20 h-20 rounded-[2rem] bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-4xl shadow-inner">⚠️</div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-800 dark:text-white">تعذّر تحميل الملف</h4>
                                            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">تأكد أن السيرفر يعمل وأن الملف موجود</p>
                                        </div>
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50 hover:bg-indigo-700 transition-all"
                                        >
                                            ⬇️ تحميل الملف مباشرة
                                        </a>
                                    </div>
                                )}

                                {pdfBlobUrl && !pdfLoading && !pdfError && (
                                    <div className="relative w-full flex flex-col items-center">
                                        {/* نفس إطار الصورة تماماً */}
                                        <div className="w-full rounded-[1.5rem] overflow-hidden shadow-2xl shadow-gray-400/40 dark:shadow-black/50 border-8 border-white dark:border-slate-800">
                                            <iframe
                                                src={pdfBlobUrl}
                                                className="w-full"
                                                style={{ height: '55vh' }}
                                                title="PDF Preview"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 font-bold mt-4">{fileName}</p>
                                    </div>
                                )}
                            </div>

                        ) : null
                    ) : null}
                </div>

                {/* ===== Footer ===== */}
                <div className="flex-shrink-0 p-6 flex justify-center border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={handleClose}
                        className="px-12 py-3 bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black hover:bg-black dark:hover:bg-white transition-all text-sm shadow-xl shadow-gray-200 dark:shadow-black/20 active:scale-95"
                    >
                        إغلاق النافذة
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ViewAttachmentModel;
