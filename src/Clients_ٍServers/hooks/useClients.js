import { useState, useEffect } from 'react';
import { handleDelete as deleteLogic } from '../handleDelete';

export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Data States
    const [selectedClient, setSelectedClient] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', status: 'active' });
    const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', status: 'active' });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/clients`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            setClients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    // Externalized handleDelete
    const handleDelete = (id) => deleteLogic(id, clients, setClients, API_BASE_URL);

    const handleViewDetails = (client) => {
        setSelectedClient(client);
        setShowDetailsModal(true);
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setEditForm({
            name: client.name || '',
            email: client.email || '',
            phone: client.phone || '',
            status: client.status || 'active'
        });
        setShowEditModal(true);
    };

    const filteredClients = clients.filter(client =>
        (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.phone && client.phone.includes(searchTerm))
    );

    return {
        clients,
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
        fetchClients, // Exported to be used by components
        filteredClients
    };
};
