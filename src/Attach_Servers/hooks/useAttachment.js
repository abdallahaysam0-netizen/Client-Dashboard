import { useState, useEffect, useMemo } from 'react';
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
    const [editForm, setEditForm] = useState({ client_id: '', file: null});
    const [addForm, setAddForm] = useState({ client_id: '', images: null, pdfs: null});

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };
        try {
            const [attachRes, clientRes] = await Promise.all([
                fetch(`${API_BASE_URL}/attachments`, { headers }),
                fetch(`${API_BASE_URL}/clients`, { headers })
            ]);
            
            const attachData = await attachRes.json();
            const clientData = await clientRes.json();
            
            setAttachments(Array.isArray(attachData) ? attachData : []);
            setClients(Array.isArray(clientData) ? clientData : []);
        } catch (error) {
            console.error("Error fetching initial data:", error);
            setAttachments([]);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttachments = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/attachments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            setAttachments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching attachments:", error);
            setAttachments([]);
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
        });
        setShowEditModal(true);
    };

    const handleView = (attachment) => {
        setSelectedAttachment(attachment);
        setShowViewModal(true);
    };


    // Create a lookup map for clients to improve O(1) performance in filter/grouping
    const clientMap = useMemo(() => {
        const map = {};
        clients.forEach(c => { map[c.id] = c; });
        return map;
    }, [clients]);

    // Use memoized filtered attachments to avoid re-calculating on every render
    const filteredAttachments = useMemo(() => {
        const searchText = searchTerm.toLowerCase();
        if (!searchText) return attachments;

        return attachments.filter(attachment => {
            const client = clientMap[attachment.client_id];
            return (
                (client && client.name.toLowerCase().includes(searchText)) ||
                (attachment.status && attachment.status.toLowerCase().includes(searchText)) ||
                (attachment.file_path && attachment.file_path.toLowerCase().includes(searchText))
            );
        });
    }, [attachments, clientMap, searchTerm]);

    // Grouping logic for the UI, memoized to prevent expensive recalculation
    const groupedAttachments = useMemo(() => {
        const groups = {};
        filteredAttachments.forEach(attachment => {
            const clientId = attachment.client_id;
            if (!groups[clientId]) {
                groups[clientId] = {
                    client_id: clientId,
                    client: attachment.client || clientMap[clientId],
                    images: [],
                    pdfs: [],
                    total: 0
                };
            }
            if (attachment.type === 'personal_image' || !attachment.file_path?.toLowerCase().endsWith('.pdf')) {
                groups[clientId].images.push(attachment);
            } else {
                groups[clientId].pdfs.push(attachment);
            }
            groups[clientId].total++;
        });
        return Object.values(groups);
    }, [filteredAttachments, clientMap]);

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
        filteredAttachments,
        groupedAttachments
    };
};
