import { useState, useEffect } from 'react';
import { handleDelete as deleteLogic } from '../DeleteAttachmentModel';

export const useAttachment = () => {
    const [attachments, setAttachments] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    // Data States
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [editForm, setEditForm] = useState({ client_id: '', file: null, status: 'pending' });
    const [addForm, setAddForm] = useState({ client_id: '', images: null, pdfs: null, status: 'pending' });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch both attachments and clients to match IDs with names
            const [attachRes, clientRes] = await Promise.all([
                fetch(`${API_BASE_URL}/attachments`),
                fetch(`${API_BASE_URL}/clients`)
            ]);
            
            const attachData = await attachRes.json();
            const clientData = await clientRes.json();
            
            setAttachments(attachData);
            setClients(clientData);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttachments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/attachments`);
            const data = await res.json();
            setAttachments(data);
        } catch (error) {
            console.error("Error fetching attachments:", error);
        }
    };

    const handleDeleteAll = async (attachmentIds) => {
        if (window.confirm(`هل أنت متأكد من حذف جميع المرفقات لهذا العميل؟ (${attachmentIds.length} ملفات)`)) {
            try {
                const results = await Promise.all(attachmentIds.map(id => 
                    fetch(`${API_BASE_URL}/attachments/${id}`, { method: 'DELETE' })
                ));
                
                if (results.every(res => res.ok)) {
                    setAttachments(prev => prev.filter(a => !attachmentIds.includes(a.id)));
                    alert('تم حذف جميع المرفقات بنجاح');
                } else {
                    fetchAttachments();
                    alert('تم حذف بعض المرفقات، وحدث خطأ في البعض الآخر');
                }
            } catch (error) {
                console.error("Error deleting multiple attachments:", error);
                alert('فشل الاتصال بالسيرفر');
            }
        }
    };

    const handleDelete = (id) => deleteLogic(id, attachments, setAttachments, API_BASE_URL);

    const handleEdit = (attachment) => {
        setSelectedAttachment(attachment);
        setEditForm({
            client_id: attachment.client_id || '',
            file: attachment.file_path || null,
            status: attachment.status || 'pending'
        });
        setShowEditModal(true);
    };

    const handleView = (attachment) => {
        setSelectedAttachment(attachment);
        setShowViewModal(true);
    };

    const filteredAttachments = attachments.filter(attachment => {
        const client = clients.find(c => c.id === attachment.client_id);
        const searchText = searchTerm.toLowerCase();
        
        return (
            (client && client.name.toLowerCase().includes(searchText)) ||
            (attachment.status && attachment.status.toLowerCase().includes(searchText)) ||
            (attachment.file_path && attachment.file_path.toLowerCase().includes(searchText))
        );
    });

    return {
        attachments,
        clients,
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
        filteredAttachments
    };
};
