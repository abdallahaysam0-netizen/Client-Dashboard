import React from 'react';
import { useAttachment } from '../Attach_Servers/hooks/useAttachment';
import AddAttachmentModel from '../Attach_Servers/AddAttachmentModel';
import EditAttachmentModel from '../Attach_Servers/EditAttachmentModel';
import ViewAttachmentModel from '../Attach_Servers/ViewAttachmentModel';

const Attachment = () => {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        showEditModal,
        setShowEditModal,
        showAddModal,
        setShowAddModal,
        showViewModal,
        setShowViewModal,
        selectedAttachment,
        editForm,
        setEditForm,
        addForm,
        setAddForm,
        handleDelete,
        handleDeleteAll,
        handleEdit,
        handleView,
        fetchAttachments,
        filteredAttachments,
        groupedAttachments,
        clients
    } = useAttachment();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-indigo-900 font-bold animate-pulse">جاري جلب المرفقات...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-transparent min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
                    <div className="space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-lg">📎</span>
                            <span className="tracking-wider text-sm uppercase">إدارة الملفات</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-slate-100 tracking-tight">مرفقات النظام</h1>
                        <p className="text-gray-500 dark:text-slate-500 font-medium">تنظيم وتبويب الوثائق والمستندات الخاصة بالعملاء.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
                    >
                        <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">+</span>
                        إضافة مرفق جديد
                    </button>
                </header>

                {/* Filter and Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-right">
                    <div className="md:col-span-2 relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-xl">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="ابحث باسم العميل، حالة المرفق، أو اسم الملف..."
                            className="w-full pr-12 pl-4 py-4 bg-white dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-0 focus:shadow-xl transition-all outline-none text-gray-700 dark:text-slate-200 font-medium placeholder:text-gray-400 dark:placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border dark:border-slate-800 flex items-center justify-between">
                        <span className="text-gray-400 dark:text-slate-500 font-bold text-sm">إجمالي المرفقات</span>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{filteredAttachments.length}</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-50 dark:border-slate-800 text-gray-400 dark:text-slate-500 text-sm font-black uppercase tracking-widest">
                                    <th className="px-8 py-6">العميل</th>
                                    <th className="px-8 py-6">الصور الشخصيه (Images)</th>
                                    <th className="px-8 py-6">ملفات CV</th>
                                    <th className="px-8 py-6 text-center"> عدد الملفات</th>
                                    <th className="px-8 py-6 text-center">أدوات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {groupedAttachments.map((group) => {
                                    return (
                                        <tr key={group.client_id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                                                        {group.client?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-900 dark:text-slate-200 font-bold text-lg">{group.client?.name || 'عميل غير معروف'}</div>
                                                        <div className="text-gray-400 dark:text-slate-500 text-xs font-bold mt-0.5 tracking-tighter uppercase">ID: #{group.client_id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* الصور Column */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2 max-w-[200px]">
                                                    {group.images.length > 0 ? group.images.map((img, idx) => (
                                                        <button
                                                            key={img.id}
                                                            onClick={() => handleView(img)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                            title={img.file_path?.split('/').pop()}
                                                        >
                                                            🖼️
                                                        </button>
                                                    )) : (
                                                        <span className="text-gray-300 dark:text-slate-600 text-xs italic">لا توجد صور</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* PDFs Column */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2 max-w-[200px]">
                                                    {group.pdfs.length > 0 ? group.pdfs.map((pdf, idx) => (
                                                        <button
                                                            key={pdf.id}
                                                            onClick={() => handleView(pdf)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            title={pdf.file_path?.split('/').pop()}
                                                        >
                                                            📄
                                                        </button>
                                                    )) : (
                                                        <span className="text-gray-300 dark:text-slate-600 text-xs italic">لا توجد ملفات PDF</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-8 py-6 text-center">
                                                <div className="flex justify-center">
                                                    {/* عرض ملخص للحالة - يمكن تطويره لاحقاً */}
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                        {group.images.length + group.pdfs.length} ملفات
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-3 min-w-[200px]">
                                                    {/* قائمة الصور في الأدوات */}
                                                    {group.images.map((img) => (
                                                        <div key={img.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl group/item transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">🖼️</span>
                                                                <span className="text-[10px] font-bold text-gray-600 dark:text-slate-400 truncate max-w-[70px]" title={img.file_path?.split('/').pop()}>
                                                                    {img.file_path?.split('/').pop()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => handleView(img)} className="w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all" title="عرض">👁️</button>
                                                                <button onClick={() => handleEdit(img)} className="w-8 h-8 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all" title="تعديل">✏️</button>
                                                                <button onClick={() => handleDelete(img.id)} className="w-8 h-8 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all" title="حذف">🗑️</button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* قائمة الـ PDF في الأدوات */}
                                                    {group.pdfs.map((pdf) => (
                                                        <div key={pdf.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl group/item transition-all hover:bg-red-50 dark:hover:bg-red-900/10 border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">📄</span>
                                                                <span className="text-[10px] font-bold text-gray-600 dark:text-slate-400 truncate max-w-[70px]" title={pdf.file_path?.split('/').pop()}>
                                                                    {pdf.file_path?.split('/').pop()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => handleView(pdf)} className="w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all" title="عرض">👁️</button>
                                                                <button onClick={() => handleEdit(pdf)} className="w-8 h-8 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all" title="تعديل">✏️</button>
                                                                <button onClick={() => handleDelete(pdf.id)} className="w-8 h-8 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all" title="حذف">🗑️</button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* زر الإضافة السريع */}
                                                    <button
                                                        onClick={() => {
                                                            setAddForm({ ...addForm, client_id: group.client_id });
                                                            setShowAddModal(true);
                                                        }}
                                                        className="w-full py-2.5 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30 rounded-xl text-indigo-400 dark:text-indigo-500 hover:border-indigo-400 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all font-black text-xs flex items-center justify-center gap-2"
                                                    >
                                                        <span>➕</span>
                                                        <span>إضافة مرفق</span>
                                                    </button>

                                                    {/* زر حذف الكل */}
                                                    <button
                                                        onClick={() => handleDeleteAll([...group.images, ...group.pdfs].map(a => a.id))}
                                                        className="w-full py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30"
                                                    >
                                                        <span>🗑️</span>
                                                        <span>حذف كل الملفات</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredAttachments.length === 0 && (
                            <div className="py-20 text-center bg-gray-50/50">
                                <div className="text-6xl mb-4 opacity-10 grayscale">📂</div>
                                <h3 className="text-gray-400 font-black text-xl">لا توجد مرفقات حالياً</h3>
                                <p className="text-gray-400 font-medium mt-2">ابدأ بإضافة مرفقات جديدة للعملاء لتظهر هنا.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Modals */}
            <AddAttachmentModel
                isOpen={showAddModal}
                setIsOpen={setShowAddModal}
                formData={addForm}
                setFormData={setAddForm}
                clients={clients}
                fetchAttachments={fetchAttachments}
            />

            <EditAttachmentModel
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                editForm={editForm}
                setEditForm={setEditForm}
                clients={clients}
                fetchAttachments={fetchAttachments}
                id={selectedAttachment?.id}
                selectedAttachment={selectedAttachment}
            />

            <ViewAttachmentModel
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                attachment={selectedAttachment}
                clientName={clients.find(c => c.id === selectedAttachment?.client_id)?.name}
            />
        </div>
    );
};

export default Attachment;
