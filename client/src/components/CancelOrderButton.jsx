import React, { useState } from 'react';
import { X, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'react-toastify';

const CancelOrderButton = ({ orderId, onCancelSuccess }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCancel = async () => {
        setIsCancelling(true);
        setShowConfirmModal(false);
        const token = localStorage.getItem('accessToken');
        console.log('Sending token:', token); 
        if (!token) {
            toast.error('Vui lòng đăng nhập lại');
            setIsCancelling(false);
            return;
        }

        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}${SummaryApi.cancelOrder.url}`;
            const response = await fetch(
                apiUrl,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        cancellationReason: 'Khách hàng hủy đơn',
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Cancel order error:', errorText);
                toast.error('Không thể hủy đơn hàng (404 hoặc lỗi server)');
                setIsCancelling(false);
                return;
            }

            const data = await response.json();
            console.log('API response:', data); 

            if (data.success) {
                toast.success('Đơn hàng đã được hủy và xóa thành công!');
                if (onCancelSuccess) {
                    onCancelSuccess();
                }
            } else {
                toast.error(data.message || 'Không thể hủy đơn hàng');
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            toast.error('Có lỗi xảy ra khi hủy đơn hàng');
        } finally {
            setIsCancelling(false);
        }
    };
    const ConfirmModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100 animate-in">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Xác nhận hủy đơn hàng
                            </h3>
                        </div>
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                            Bạn có chắc chắn muốn hủy đơn hàng #{orderId}?
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Hành động này không thể hoàn tác
                            </p>
                            <p className="text-amber-700 text-sm mt-1">
                                Đơn hàng sẽ được đánh dấu là "Đã hủy" và không thể khôi phục.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                            Giữ đơn hàng
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xác nhận hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isCancelling}
                className={`
                    relative w-full py-3 px-4 rounded-xl font-medium text-white
                    transition-all duration-200 shadow-lg hover:shadow-xl
                    transform hover:-translate-y-0.5 active:translate-y-0
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                    disabled:hover:shadow-lg
                    ${isCancelling
                        ? 'bg-gray-400'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }
                `}
            >
                {isCancelling && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                )}

                <div className={`flex items-center justify-center gap-2 ${isCancelling ? 'opacity-0' : 'opacity-100'}`}>
                    <Trash2 className="w-4 h-4" />
                    <span>Hủy đơn hàng</span>
                </div>

                {isCancelling && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="ml-8">Đang hủy...</span>
                    </div>
                )}
            </button>

            {showConfirmModal && <ConfirmModal />}
        </>
    );
};

export default CancelOrderButton;