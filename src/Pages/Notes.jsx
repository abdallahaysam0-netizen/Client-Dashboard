import React from 'react';
import { useNote } from '../Notes_Servers/hooks/useNote';
import AddNoteModel from '../Notes_Servers/AddNoteModel';
import EditNoteModel from '../Notes_Servers/EditNoteModel';
import { handleDelete } from '../Notes_Servers/DeleteNoteModel';

const Notes = () => {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        formData,
        setFormData,
        handleCreate,
        handleUpdate,
        openEditModal,
        filteredNotes,
        clients,
        fetchData,
        isNoteChanged,
        error,
        setError
    } = useNote();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-indigo-900 font-bold animate-pulse">جاري جلب الملاحظات...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-transparent min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 text-right">
                    <div className="space-y-2">
                        <div className="flex items-center justify-end gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-lg">📝</span>
                            <span className="tracking-wider text-sm uppercase">النظام الإداري</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-slate-100 tracking-tight">ملاحظات العملاء</h1>
                        <p className="text-gray-500 dark:text-slate-500 font-medium">إدارة وتوثيق الملاحظات الخاصة بالعملاء بشكل منظم.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
                    >
                        <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">+</span>
                        إضافة ملاحظة جديدة
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="md:col-span-2 relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-xl">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="ابحث في الملاحظات أو اسم العميل..."
                            className="w-full pr-12 pl-4 py-4 bg-white dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-0 focus:shadow-xl transition-all outline-none text-gray-700 dark:text-slate-200 font-medium placeholder:text-gray-400 dark:placeholder:text-slate-600 text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border dark:border-slate-800 flex items-center justify-between">
                        <span className="text-gray-400 dark:text-slate-500 font-bold text-sm">عدد الملاحظات</span>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{filteredNotes.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div key={note.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-2xl transition-all group">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-lg">
                                        ID: #{note.id}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(note)} className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white transition-colors">
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDelete(note.id, fetchData)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-colors">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold">
                                        {note.client?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 dark:text-slate-100 font-bold">{note.client?.name || 'عميل غير معروف'}</h3>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{note.created_at ? new Date(note.created_at).toLocaleDateString('ar-EG') : 'تاريخ غير معروف'}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {note.note}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddNoteModel
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                formData={formData}
                setFormData={setFormData}
                clients={clients}
                handleCreate={handleCreate}
                error={error}
                setError={setError}
            />

            <EditNoteModel
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                formData={formData}
                setFormData={setFormData}
                handleUpdate={handleUpdate}
                isNoteChanged={isNoteChanged}
                error={error}
                setError={setError}
            />
        </div>
    );
};

export default Notes;

