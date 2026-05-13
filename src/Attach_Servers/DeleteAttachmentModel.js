import { toast } from 'react-hot-toast';

export const handleDelete = async (id, attachments, setAttachments, API_BASE_URL) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المرفق')) {
        try {
            const res = await fetch(`${API_BASE_URL}/attachments/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setAttachments(attachments.filter(attachment => attachment.id !== id));
                toast.success('تم حذف المرفق بنجاح');
            } else {
                toast.error('حدث خطأ أثناء حذف المرفق');
            }
        } catch (error) {
            console.error("Error deleting attachment:", error);
            toast.error('خطأ في الاتصال بالسيرفر');
        }
    }
};
