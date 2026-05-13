import React from 'react';
import { useClients } from '../Clients_ٍServers/hooks/useClients';
import AddClientModal from '../Clients_ٍServers/AddClientModal';
import EditClientModal from '../Clients_ٍServers/EditClientModal';
import ViewClientModal from '../Clients_ٍServers/ViewClientModal';

const Clients = () => {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        showDetailsModal,
        setShowDetailsModal,
        showEditModal,
        setShowEditModal,
        showAddModal,
        setShowAddModal,
        selectedClient,
        editForm,
        setEditForm,
        addForm,
        setAddForm,
        handleDelete,
        handleViewDetails,
        handleEdit,
        fetchClients,
        filteredClients
    } = useClients();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-indigo-900 font-bold animate-pulse">جاري جلب قائمة العملاء...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-transparent min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Modern Header */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 text-right">
                    <div className="space-y-2">
                        <div className="flex items-center justify-end gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-lg">👥</span>
                            <span className="tracking-wider text-sm uppercase">النظام الإداري</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-slate-100 tracking-tight">قاعدة بيانات العملاء</h1>
                        <p className="text-gray-500 dark:text-slate-500 font-medium">إدارة شاملة وتتبع دقيق لبيانات العملاء في منصتك.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
                    >
                        <span className="text-2xl group-hover:rotate-180 transition-transform duration-700">+</span>
                        إضافة عميل جديد
                    </button>
                </header>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="md:col-span-2 relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-xl">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="ابحث عن عميل بالاسم، البريد الإلكتروني أو الهاتف..."
                            className="w-full pr-12 pl-4 py-4 bg-white dark:bg-slate-900 border-2 border-transparent dark:border-slate-800 rounded-2xl shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-0 focus:shadow-xl transition-all outline-none text-gray-700 dark:text-slate-200 font-medium placeholder:text-gray-400 dark:placeholder:text-slate-600 text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border dark:border-slate-800 flex items-center justify-between">
                        <span className="text-gray-400 dark:text-slate-500 font-bold text-sm">النتائج النشطة</span>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{filteredClients.length}</span>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-50 dark:border-slate-800 text-gray-400 dark:text-slate-500 text-sm font-black uppercase tracking-widest">
                                    <th className="px-8 py-6">العميل الأساسي</th>
                                    <th className="px-8 py-6">بيانات الاتصال</th>
                                    <th className="px-8 py-6 text-center">حالة العميل</th>
                                    <th className="px-8 py-6 text-center">خيارات التحكم</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-all duration-300 group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                                                    {client.name ? client.name.charAt(0) : '?'}
                                                </div>
                                                <div>
                                                    <div className="text-gray-900 dark:text-slate-200 font-bold text-lg">{client.name}</div>
                                                    <div className="text-gray-400 dark:text-slate-500 text-xs font-bold mt-0.5 uppercase tracking-tighter">ID: #{client.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-gray-700 dark:text-slate-300 font-bold">{client.email}</div>
                                            <div className="text-gray-400 dark:text-slate-500 text-sm mt-1">{client.phone || '—'}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black shadow-sm ${client.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                                    {client.status === 'active' ? 'نشط' : 'معطل'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center items-center gap-3">
                                                <button
                                                    onClick={() => handleViewDetails(client)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white hover:scale-110 shadow-sm transition-all"
                                                    title="عرض البيانات"
                                                >
                                                    <span className="text-xl">👁️</span>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white hover:scale-110 shadow-sm transition-all"
                                                    title="تعديل الحساب"
                                                >
                                                    <span className="text-lg">✏️</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white hover:scale-110 shadow-sm transition-all"
                                                    title="حذف نهائي"
                                                >
                                                    <span className="text-lg">🗑️</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals with encapsulated logic */}
            <AddClientModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                addForm={addForm}
                setAddForm={setAddForm}
                fetchClients={fetchClients}
            />

            <EditClientModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                client={selectedClient}
                editForm={editForm}
                setEditForm={setEditForm}
                fetchClients={fetchClients}
            />

            <ViewClientModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                client={selectedClient}
            />
        </div>
    );
};

export default Clients;