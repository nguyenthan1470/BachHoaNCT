import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Nodata from '../components/NoData';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);

  if (!orders || orders.length === 0) return <Nodata />;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {orders.map((order, idx) => {
          const delivery = order?.delivery_address;
          const items = Array.isArray(order.product_details)
            ? order.product_details
            : [order.product_details];

          return (
            <div
              key={order._id || idx}
              className="bg-white rounded-lg p-6 shadow-sm border border-green-200 mb-8"
            >
              <Link
                to={`/dashboard/myordersdetail/${order.orderId}`}
                className="block mb-6"
              >
                {items.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="flex items-center p-4 border-b border-gray-100 hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center text-xl mr-4">
                      <img
                        src={item?.image?.[0] || '/vite.svg'}
                        alt={item?.name}
                        className="w-10 h-10 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity || 1}</p>
                      <p className="text-sm">Mã đơn hàng: {order?.orderId}</p>
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <p className="font-semibold">
                          Thông tin người nhận: {delivery?.fullname} | {delivery?.mobile}
                        </p>
                        <p className="flex items-start">
                          <span className="font-semibold mr-1">Địa chỉ giao hàng:</span>
                          <span>
                            {delivery?.address_line}, {delivery?.district}, {delivery?.city},{' '}
                            {delivery?.state}, {delivery?.country}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-semibold">
                        Giá: {formatPrice(item.price || order.totalAmt)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          Tổng:{' '}
                          {formatPrice(
                            (item.price || order.totalAmt) * item.quantity
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </Link>
            </div>
          );
        })}
        <div></div>
      </div>
    </div>
  );
};

export default MyOrders;
