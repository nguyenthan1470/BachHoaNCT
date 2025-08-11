import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, CreditCard, User, Phone, Mail, ArrowLeft, DollarSign, Clock, XCircle, RotateCcw, Map } from 'lucide-react';
import Nodata from '../components/NoData';
import SummaryApi from '../common/SummaryApi';
import CancelOrderButton from "../components/CancelOrderButton"; // Import component mới (điều chỉnh path nếu cần)

const orderStatuses = ['Chờ xử lý', 'Đã hủy', 'Đang giao', 'Đã giao', 'Hoàn trả'];

const getStatusIcon = (status) => {
    switch (status) {
        case 'Chờ xử lý':
            return <Clock className="w-5 h-5" />;
        case 'Đã hủy':
            return <XCircle className="w-5 h-5" />;
        case 'Đang giao':
            return <Truck className="w-5 h-5" />;
        case 'Đã giao':
            return <CheckCircle className="w-5 h-5" />;
        case 'Hoàn trả':
            return <RotateCcw className="w-5 h-5 " />;
        default:
            return <Clock className="w-5 h-5 " />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Chờ xử lý':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Đã hủy':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'Đang giao':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Đã giao':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Hoàn trả':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const MyOrdersDetail = () => {
    const { orderId } = useParams();
    const orders = useSelector((state) => state.orders.order);
    const order = orders.find((o) => o.orderId === orderId);
    const [showMap, setShowMap] = useState(false);
    const [trackingData, setTrackingData] = useState(null);

    useEffect(() => {
        if (order?.payment_status === 'Đang giao') {
            fetchTrackingData();
        }
    }, [order]);

    const fetchTrackingData = async () => {
        try {
            const response = await fetch(`${SummaryApi.trackOrder.url}/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTrackingData(data.data);
            }
        } catch (error) {
            console.error('Error fetching tracking data:', error);
        }
    };

    if (!order) return <Nodata />;

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const orderData = {
        orderNumber: order.orderId,
        orderDate: new Date(order.createdAt).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        status: order.payment_status || 'Chờ xử lý',
        estimatedDelivery: new Date(order.estimatedDelivery || Date.now()).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }),
        paymentMethod: order.paymentId === '' ? 'Thanh toán khi nhận' : 'Thẻ tín dụng',
        customer: {
            name: order.delivery_address?.fullname || 'Không rõ',
            phone: order.delivery_address?.mobile || 'Không rõ',
            email: order.delivery_address?.email || 'Không rõ',
        },
        shippingAddress: {
            street: order.delivery_address?.address_line || 'Không rõ',
            district: order.delivery_address?.district || 'Không rõ',
            city: order.delivery_address?.city || 'Không rõ',
            pincode: order.delivery_address?.pincode || 'Không rõ',
        },
        items: Array.isArray(order.product_details)
            ? order.product_details.map((item, idx) => ({
                id: item._id || idx,
                name: item.name,
                image: item.image?.[0] || '📱',
                price: item.price,
                quantity: item.quantity || 1,
                color: item.color || 'Không rõ',
                warranty: item.warranty || 'Không rõ',
            }))
            : [
                {
                    id: order.product_details?._id || 0,
                    name: order.product_details?.name || 'Không rõ',
                    image: order.product_details?.image?.[0] || '📱',
                    price: order.product_details?.price || order.totalAmt,
                    quantity: order.product_details?.quantity || 1,
                    color: order.product_details?.color || 'Không rõ',
                    warranty: order.product_details?.warranty || 'Không rõ',
                },
            ],
        totalAmount: order.totalAmt ?? 0,
        timeline: orderStatuses.map((status) => {
            const completed = orderStatuses.indexOf(status) <= orderStatuses.indexOf(order.payment_status || 'Chờ xử lý');
            let time = 'Dự kiến';
            if (completed) {
                switch (status) {
                    case 'Chờ xử lý':
                        time = order.confirmedAt ? new Date(order.confirmedAt).toLocaleString('vi-VN') : '';
                        break;
                    case 'Đã hủy':
                        time = order.cancelledAt ? new Date(order.cancelledAt).toLocaleString('vi-VN') : '';
                        break;
                    case 'Đang giao':
                        time = order.shippingAt ? new Date(order.shippingAt).toLocaleString('vi-VN') : '';
                        break;
                    case 'Đã giao':
                        time = order.deliveredAt ? new Date(order.deliveredAt).toLocaleString('vi-VN') : '';
                        break;
                    case 'Hoàn trả':
                        time = order.returnedAt ? new Date(order.returnedAt).toLocaleString('vi-VN') : '';
                        break;
                    default:
                        time = 'Không rõ';
                }
            }
            return {
                status,
                time,
                completed,
            };
        }),
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <div className="mb-4">
                    <Link
                        to="/dashboard/myorders"
                        className="font-semibold inline-flex items-center gap-2 text-sm text-green-500 border border-green-200 px-3 py-3 rounded-lg bg-white hover:bg-green-50 hover:shadow transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại đơn hàng của tôi
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-green-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                            <div className='space-y-2'>
                                <h1 className="text-xl font-bold text-gray-800">Đặt Hàng Thành Công!</h1>
                                <p className="text-sm text-gray-800">Mã đơn hàng: {orderData.orderNumber}</p>
                                <p className="text-sm text-gray-800">Ngày đặt: {orderData.orderDate}</p>
                            </div>
                        </div>
                        <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                                orderData.status
                            )}`}
                        >
                            {getStatusIcon(orderData.status)}
                            {orderData.status}
                        </span>
                    </div>
                </div>

                {/* Timeline - Horizontal */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-green-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Truck className="w-5 h-5 text-green-500 mr-2" />
                        Trạng Thái Đơn Hàng
                    </h2>
                    <div>
                        <div className="flex flex-wrap items-start gap-6 relative pl-2 before:content-[''] before:absolute before:top-[18px] before:left-0 before:right-0 before:h-0.5 before:bg-green-200">
                            {orderData.timeline.map((step, index) => (
                                <div key={index} className="relative z-10 flex flex-col items-center text-center w-40">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-sm border-2 transition-all ${step.completed
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-400 border-gray-300'
                                            }`}
                                    >
                                        {getStatusIcon(step.status)}
                                    </div>
                                    <p
                                        className={`text-sm font-medium ${step.completed ? 'text-green-600' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.status}
                                    </p>
                                    <p className="text-xs text-gray-400">{step.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tracking Map */}
                {order.payment_status === 'Đang giao' && trackingData && (
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-green-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Map className="w-5 h-5 text-green-500 mr-2" />
                            Theo Dõi Vị Trí Giao Hàng
                        </h2>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            {showMap ? 'Ẩn Bản Đồ' : 'Xem Bản Đồ'}
                        </button>
                        {showMap && (
                            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                               
                                <p className="text-gray-600">Bản đồ hiển thị vị trí giao hàng: {trackingData?.location || 'Đang tải...'}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Products */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Package className="w-5 h-5 text-green-500 mr-2" />
                                Chi Tiết Sản Phẩm
                            </h2>
                            {orderData.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-4 border-b border-gray-100 hover:bg-green-50 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded flex folding items-center justify-center text-xl mr-4">
                                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-900 mt-2">Số lượng: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 font-semibold">{formatPrice(item.price)}</p>
                                        {item.quantity > 1 && (
                                            <p className="text-sm text-gray-500">
                                                Tổng: {formatPrice(item.price * item.quantity)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {orderData.items.map((item) => (
                                <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {item.quantity > 1 && (
                                            <div className="text-xl  ">
                                                Tổng cộng: <span className='text-green-600'>{formatPrice(item.price * item.quantity)} </span>
                                                    
                                            </div>
                                        )}
                                    </p>
                                </div>

                            ))}

                        </div>
                    </div>

                    {/* Customer + Payment */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <User className="w-5 h-5 text-green-500 mr-2" />
                                Thông Tin Khách Hàng
                            </h3>
                            <div className="text-sm text-gray-900 space-y-2 ">
                                <p className="flex items-center">
                                    <User className="w-4 h-4 mr-2" /> {orderData.customer.name}
                                </p>
                                <p className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2" /> {orderData.customer.phone}
                                </p>
                                <p className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2" /> {orderData.customer.email}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 text-green-500 mr-2" />
                                Địa Chỉ Giao Hàng
                            </h3>
                            <div className="text-sm text-gray-900  space-y-1">
                                <p>
                                    {orderData.customer.name} | {orderData.customer.phone}
                                </p>
                                <p>
                                    {orderData.shippingAddress.street}, {orderData.shippingAddress.district}
                                </p>
                                <p>
                                    {orderData.shippingAddress.city}, {orderData.shippingAddress.pincode}
                                </p>
                                <p className="text-gray-900">Dự kiến giao: {orderData.estimatedDelivery}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 text-green-500 mr-2" />
                                Phương Thức Thanh Toán
                            </h3>
                            <p className="text-sm text-gray-900">{orderData.paymentMethod}</p>
                        </div>

                        <div className="space-y-3">
                            <Link to="/contact">
                                <p className="text-center w-full border bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-500 transition-colors">
                                    Liên Hệ Hỗ Trợ
                                </p>
                            </Link>

                            {order.payment_status === 'Chờ xử lý' && order.paymentId === '' && (
                                <CancelOrderButton 
                                    orderId={order.orderId}
                                    onCancelSuccess={() => window.location.href = '/dashboard/myorders'} 
                                />
                            )}

                            {order.payment_status === 'Đang giao' && (
                                <button
                                    disabled
                                    className="w-full bg-gray-400 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                                >
                                    Đang giao hàng
                                </button>
                            )}

                            {order.payment_status === 'Đã hủy' && (
                                <button
                                    disabled
                                    className="w-full bg-gray-400 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                                >
                                    Đã hủy
                                </button>
                            )}

                            {order.payment_status === 'Đã giao' && (
                                <button
                                    disabled
                                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                                >
                                    Đã giao hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border border-green-100 text-center">
                    <p className="text-sm text-gray-600">
                        Cảm ơn bạn đã mua sắm! Liên hệ{' '}
                        <span className="text-green-600 font-semibold">Bách Hóa </span>
                        <span className="font-semibold text-primary-200">NCT</span> nếu có thắc mắc.
                    </p>
                </div>
            </div>
            
        </div>
        
    );
    
};


export default MyOrdersDetail;