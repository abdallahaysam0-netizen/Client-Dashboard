import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const useNote = () => {
    const [notes, setNotes] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [formData, setFormData] = useState({ client_id: '', note: '' });
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };
        try {
            const notesRes = await fetch(`${API_BASE_URL}/notes`, { headers });
            const notesData = await notesRes.json();
            setNotes(Array.isArray(notesData) ? notesData : []);
            
            const clientsRes = await fetch(`${API_BASE_URL}/clients`, { headers });
            const clientsData = await clientsRes.json();
            setClients(Array.isArray(clientsData) ? clientsData : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setNotes([]);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!formData.client_id || !formData.note) {
            setError('يرجى اختيار العميل وكتابة الملاحظة');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ client_id: '', note: '' });
                setError('');
                fetchData();
                toast.success('تمت إضافة الملاحظة بنجاح');
                
                // إضافة للتنبيهات في الـ Navbar
                window.dispatchEvent(new CustomEvent('local-notification', {
                    detail: {
                        type: 'note',
                        title: 'إضافة ملاحظة',
                        message: formData.note
                    }
                }));
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'حدث خطأ أثناء إضافة الملاحظة');
                toast.error(errorData.message || 'حدث خطأ أثناء إضافة الملاحظة');
            }
        } catch (error) {
            console.error("Error creating note:", error);
            setError('خطأ في الاتصال بالسيرفر');
            toast.error('خطأ في الاتصال بالسيرفر');
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!formData.note) {
            setError('الملاحظة لا يمكن أن تكون فارغة');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/notes/${selectedNote.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowEditModal(false);
                setSelectedNote(null);
                setFormData({ client_id: '', note: '' });
                setError('');
                fetchData();
                toast.success('تم تحديث الملاحظة بنجاح');

                window.dispatchEvent(new CustomEvent('local-notification', {
                    detail: {
                        type: 'note',
                        title: 'تحديث ملاحظة',
                        message: formData.note
                    }
                }));
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'حدث خطأ أثناء تحديث الملاحظة');
                toast.error(errorData.message || 'حدث خطأ أثناء تحديث الملاحظة');
            }
        } catch (error) {
            console.error("Error updating note:", error);
            setError('خطأ في الاتصال بالسيرفر');
            toast.error('خطأ في الاتصال بالسيرفر');
        }
    };

    const openEditModal = (note) => {
        setSelectedNote(note);
        setFormData({ client_id: note.client_id, note: note.note });
        setShowEditModal(true);
    };

    const filteredNotes = notes.filter(note => 
        (note.note && note.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.client && note.client.name && note.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const isNoteChanged = selectedNote ? formData.note !== selectedNote.note : false;

    return {
        notes,
        clients,
        loading,
        searchTerm,
        setSearchTerm,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        selectedNote,
        formData,
        setFormData,
        handleCreate,
        handleUpdate,
        openEditModal,
        filteredNotes,
        fetchData,
        isNoteChanged,
        error,
        setError
    };
};
