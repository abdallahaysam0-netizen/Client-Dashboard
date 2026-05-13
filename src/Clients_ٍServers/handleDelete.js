import { toast } from 'react-hot-toast';

export const handleDelete = async (id, clients, setClients, API_BASE_URL) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        try {
            const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setClients(clients.filter(client => client.id !== id));
                toast.success('تم حذف العميل بنجاح');
            } else {
                toast.error('حدث خطأ أثناء حذف العميل');
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            toast.error('خطأ في الاتصال بالسيرفر');
        }
    }
};
