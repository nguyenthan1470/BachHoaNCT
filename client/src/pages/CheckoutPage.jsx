import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
        if (fetchOrder) {
          fetchOrder();
        }
        navigate('/success', {
          state: {
            text: 'Đặt hàng',
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Đang tải...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      stripePromise.redirectToCheckout({ sessionId: responseData.id })

      if (fetchCartItem) {
        fetchCartItem()
      }
      if (fetchOrder) {
        fetchOrder()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

//  const handleVnpayPayment = async () => {
//   try {
//     toast.loading("Đang tải...");
//     const response = await Axios({
//       ...SummaryApi.vnPayCreatePayment,
//       data: {
//         amount: totalPrice,
//       },
//     });

//     const { data: responseData } = response;

//     if (responseData.paymentUrl) {
//       window.location.href = responseData.paymentUrl;
//     } else {
//       toast.error("Lỗi khi tạo liên kết thanh toán VNPAY");
//     }
//   } catch (error) {
//     AxiosToastError(error);
//   }
// };

  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Chọn địa chỉ của bạn</h3>
          <div className='bg-white p-2 grid gap-4'>
            {addressList.map((address, index) => {
              return (
                <label
                  key={address._id || index}
                  htmlFor={'address' + index}
                  className={!address.status ? 'hidden' : ''}
                >
                  <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                    <div>
                      <input
                        id={'address' + index}
                        type='radio'
                        value={index}
                        onChange={(e) => setSelectAddress(e.target.value)}
                        name='address'
                      />
                    </div>
                    <div className='text-lg leading-relaxed mt-1'>
                      <p><span className='font-semibold'>Họ tên: </span>{address.fullname}</p>
                      <p><span className='font-semibold'>Email: </span>{address.email}</p>
                      <p><span className='font-semibold'>Địa chỉ cụ thể: </span>{address.address_line}, {address.state},{address.district}, {address.city}, {address.country}</p>
                      <p><span className='font-semibold'>Mã bưu điện: </span>{address.pincode}</p>
                      <p><span className='font-semibold'>Số điện thoại: </span>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'
            >
              Thêm địa chỉ
            </div>
          </div>
        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          {/**summary**/}
          <h3 className='text-lg font-semibold'>Hóa đơn</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Chi tiết hóa đơn</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Tổng số tiền </p>
              <p className='flex items-center gap-2'>
                <span className='line-through text-neutral-400'>
                  {DisplayPriceInVietnamDong(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInVietnamDong(totalPrice)}</span>
              </p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Tổng số lượng</p>
              <p className='flex items-center gap-2'>{totalQty} sản phẩm</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Phí giao hàng</p>
              <p className='flex items-center gap-2'>Miễn phí</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p>Tổng cộng</p>
              <p>{DisplayPriceInVietnamDong(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button
              className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold'
              onClick={() => {
                if (addressList.length === 0 || !addressList[selectAddress]?._id) {
                  toast.error("Vui lòng chọn địa chỉ trước khi thanh toán");
                  return;
                }
                handleOnlinePayment();
              }}
              disabled={addressList.length === 0 || !addressList[selectAddress]?._id}
            >
              Thanh toán trực tuyến
            </button>
            <button
              className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white'
              onClick={() => {
                if (addressList.length === 0 || !addressList[selectAddress]?._id) {
                  toast.error("Vui lòng chọn địa chỉ trước khi thanh toán");
                  return;
                }
                handleCashOnDelivery();
              }}
              disabled={addressList.length === 0 || !addressList[selectAddress]?._id}
            >
              Thanh toán khi nhận hàng
            </button>
             {/* <button
              className='py-2 px-4 border-2 border-blue-600 font-semibold text-blue-600 hover:bg-blue-600 hover:text-white'
              onClick={handleVnpayPayment}
            >
              Thanh toán qua VNPAY
            </button> */}
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;