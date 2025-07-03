import React from 'react'
import { useSelector } from 'react-redux'
import Nodata from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order items", orders)

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>Đơn hàng của tôi</h1>
      </div>

      {!orders[0] && <Nodata />}

      {orders.map((order, index) => {
        const delivery = order?.delivery_address
        const product = order?.product_details

        return (
          <div
            key={order._id + index + "order"}
            className='bg-white shadow-md rounded p-4 my-3 text-sm space-y-2'
          >
            <p className='font-bold'>Mã đơn hàng: {order?.orderId}</p>

            <div className='flex gap-4 items-center'>
              <img
                src={product?.image?.[0]}
                alt='product'
                className='w-16 h-16 object-cover'
              />
              <div>
                <p className='font-medium'>{product?.name}</p>
                <p>Số lượng: {product?.quantity || 1}</p>
              </div>
            </div>

            <p>
              <span className='font-semibold'>Trạng thái thanh toán:</span>{" "}
              <span className={order?.payment_status === "Đã thanh toán" ? 'text-green-600' : 'text-yellow-600'}>
                {order?.payment_status === "Đã thanh toán"
                  ? "Đã thanh toán"
                  : order?.payment_status === "Chưa thanh toán"
                    ? "Chưa thanh toán"
                    : order?.payment_status === "cancelled"
                      ? "Đã hủy"
                      : order?.payment_status || "Không xác định"}
              </span>
            </p>
            <p><span className='font-semibold'>Ngày đặt:</span> {new Date(order?.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><span className='font-semibold'>Thời gian đặt:</span> {new Date(order?.createdAt).toLocaleTimeString('vi-VN')}</p>

            <div className='mt-2'>
              <p className='font-semibold underline'>Thông tin giao hàng:</p>
              <p>Họ tên: {delivery?.fullname}</p>
              <p>Email: {delivery?.email}</p>
              <p>Số điện thoại: {delivery?.mobile}</p>
              <p>Địa chỉ: {delivery?.address_line},{delivery?.state}, {delivery?.district}, {delivery?.city} </p>


            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MyOrders
