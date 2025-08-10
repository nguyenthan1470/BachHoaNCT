import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/SummaryApi';

const CancelOrderButton = ({ orderId, onCancelSuccess }) => {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async () => {
        const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Đơn hàng sẽ bị xóa.');
        if (!confirmCancel) return;

        setIsCancelling(true);
        try {
            const response = await fetch(SummaryApi.cancelOrder.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    orderId: orderId,
                    cancellationReason: 'Khách hàng hủy đơn'
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Đơn hàng đã được hủy và xóa!');
                if (onCancelSuccess) {
                    onCancelSuccess();
                }
            } else {
                toast.error(data.message || 'Không thể hủy đơn hàng');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi hủy đơn hàng');
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
        </button>
    );
};

export default CancelOrderButton;