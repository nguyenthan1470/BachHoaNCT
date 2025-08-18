import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong';
import { MapPin, Plus, Package, CheckCircle, Clock, Wallet, Truck, CreditCard } from 'lucide-react';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import { loadStripe } from '@stripe/stripe-js';
import AddAddress from '../components/AddAddress';
import { MdDelete, MdEdit, MdCheck } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
    fetchAddress,
  } = useGlobalContext();

  const addressList = useSelector((state) => state.addresses.addressList);
  const cartItemsList = useSelector((state) => state.cartItem.cart);

  const [selectAddress, setSelectAddress] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const finalTotalPrice = isFastDelivery ? totalPrice + 30000 : totalPrice;

  useEffect(() => {
    if (addressList.length > 0) {
      const defaultAddress = addressList.find(addr => addr.isDefault === true);
      if (defaultAddress) {
        setSelectAddress(defaultAddress._id);
      } else {
        const activeAddresses = addressList.filter(addr => addr.status !== false);
        if (activeAddresses.length > 0) {
          setSelectAddress(activeAddresses[0]._id);
        }
      }
    } else {
      setSelectAddress(null);
    }
  }, [addressList]);

  const handleSetDefaultAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.setDefaultAddress,
        data: { _id: id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAddress(); // Ensure this is awaited to update addressList
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });

      if (response.data.success) {
        toast.success('Đã xóa địa chỉ');
        await fetchAddress();
        // Reset selectAddress if the deleted address was selected
        if (selectAddress === id) {
          const activeAddresses = addressList.filter(addr => addr.status !== false && addr._id !== id);
          if (activeAddresses.length > 0) {
            const newDefault = activeAddresses.find(addr => addr.isDefault) || activeAddresses[0];
            setSelectAddress(newDefault._id);
          } else {
            setSelectAddress(null);
          }
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!selectAddress) return toast.error('Vui lòng chọn địa chỉ');
    try {
      const res = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: selectAddress,
          subTotalAmt: totalPrice,
          totalAmt: finalTotalPrice,
        },
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate('/success', { state: { text: 'Đặt hàng' } });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectAddress) return toast.error('Vui lòng chọn địa chỉ');
    try {
      toast.loading('Đang chuyển hướng...');
      const stripePromise = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const res = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: selectAddress,
          subTotalAmt: totalPrice,
          totalAmt: finalTotalPrice,
        },
      });

      stripePromise?.redirectToCheckout({ sessionId: res.data.id });
      fetchCartItem?.();
      fetchOrder?.();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleVnpayPayment = async () => {
    if (!selectAddress) return toast.error('Vui lòng chọn địa chỉ');
    try {
      const token = localStorage.getItem('token');
      toast.loading('Đang chuyển hướng...');
      const response = await Axios({
        ...SummaryApi.vnpayCreatePayment,
        method: 'post',
        headers: { Authorization: `Bearer ${token}` },
        data: {
          amount: finalTotalPrice,
          bankCode: 'NCB',
          language: 'vn',
          list_items: cartItemsList,
          addressId: selectAddress,
          subTotalAmt: totalPrice,
        },
      });

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error('Không tạo được liên kết thanh toán VNPay');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex justify-center items-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-600 font-semibold text-sm sm:text-base">Trang chủ</span>
          </div>
          <div className="w-8 sm:w-12 h-px bg-green-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex justify-center items-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <span className="text-green-600 font-semibold text-sm sm:text-base">Thanh toán</span>
          </div>
          <div className="w-8 sm:w-12 h-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center">
              <span className="text-gray-400 font-bold text-sm">3</span>
            </div>
            <span className="text-gray-400 font-medium text-sm sm:text-base">Hoàn thành</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 bg-green-100 rounded-full flex justify-center items-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Địa chỉ giao hàng</h3>
            </div>
            <div className="space-y-4">
              {addressList.filter((addr) => addr.status !== false).map((address, index) => (
                <label key={address._id}>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${selectAddress === address._id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                      <div className="sm:col-span-1">
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          onChange={(e) => setSelectAddress(e.target.value)}
                          checked={selectAddress === address._id}
                          className="w-5 h-5 text-green-600 border-gray-300"
                        />
                      </div>
                      <div className="sm:col-span-10 space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{address.fullname}</span>
                          {address.isDefault && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p><span className="font-semibold">SĐT: </span>{address.mobile}</p>
                        <p><span className="font-semibold">Email: </span>{address.email}</p>
                        <p><span className="font-semibold">Mã bưu điện: </span>{address.pincode}</p>
                        <p><span className="font-semibold">Địa chỉ: </span>{address.address_line}, {address.district}, {address.city}, {address.state}, {address.country}</p>
                      </div>
                      <div className="sm:col-span-1 flex gap-2 justify-end">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address._id)}
                            className="p-1.5 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors duration-200"
                            aria-label="Đặt làm địa chỉ mặc định"
                            title="Đặt làm mặc định"
                          >
                            <MdCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setOpenEdit(true);
                            setEditData(address);
                          }}
                          className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors duration-200"
                          aria-label="Chỉnh sửa địa chỉ"
                          title="Chỉnh sửa"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDisableAddress(address._id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200"
                          aria-label="Xóa địa chỉ"
                          title="Xóa"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
              <button
                onClick={() => setOpenAddress(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-gray-700 hover:border-green-400 hover:bg-green-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex justify-center items-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">Thêm địa chỉ mới</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 bg-green-100 rounded-full flex justify-center items-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Phương thức giao hàng</h3>
            </div>
            <div className="border rounded-lg bg-green-50 p-4 space-y-4">
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="delivery"
                  checked={!isFastDelivery}
                  onChange={() => setIsFastDelivery(false)}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <div>
                  <h4 className="font-medium text-gray-800">Giao hàng tiêu chuẩn</h4>
                  <p className="text-sm text-gray-600">Miễn phí • Giao trong 2-3 ngày làm việc</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="delivery"
                  checked={isFastDelivery}
                  onChange={() => setIsFastDelivery(true)}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <div>
                  <h4 className="font-medium text-gray-800">Giao hàng hỏa tốc</h4>
                  <p className="text-sm text-gray-600">Giao trong 24h • +30.000₫</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky top-4">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h3>
            </div>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({totalQty} sản phẩm)</span>
                <span className="line-through">{DisplayPriceInVietnamDong(notDiscountTotalPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Giảm giá</span>
                <span>-{DisplayPriceInVietnamDong(notDiscountTotalPrice - totalPrice)}</span>
              </div>
              {isFastDelivery && (
                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng hỏa tốc</span>
                  <span>{DisplayPriceInVietnamDong(30000)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base sm:text-lg text-gray-800 border-t pt-4">
                <span>Tổng cộng</span>
                <span>{DisplayPriceInVietnamDong(finalTotalPrice)}</span>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleOnlinePayment}
                disabled={!selectAddress}
                className="w-full flex items-center justify-center gap-2 border-2 border-pink-600 text-pink-600 font-medium py-2 px-4 rounded-lg hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard size={20} />
                <span>Thanh toán thẻ tín dụng</span>
              </button>
              <button
                onClick={handleVnpayPayment}
                disabled={!selectAddress}
                className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet size={20} />
                <span>Thanh toán VNPAY</span>
              </button>
              <button
                onClick={handleCashOnDelivery}
                disabled={!selectAddress}
                className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package size={20} />
                <span>Thanh toán khi nhận hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
    </div>
  );
};

export default CheckoutPage;