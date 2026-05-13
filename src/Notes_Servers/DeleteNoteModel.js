import { toast } from 'react-hot-toast';

export const handleDelete = async (id, fetchData) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    if (window.confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
        try {
            const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchData();
                toast.success('تم حذف الملاحظة بنجاح');
            } else {
                toast.error('حدث خطأ أثناء حذف الملاحظة');
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error('خطأ في الاتصال بالسيرفر');
        }
    }
};
