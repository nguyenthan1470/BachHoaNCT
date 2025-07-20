import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong';
import { MapPin, Plus, Package, CheckCircle, Clock } from 'lucide-react';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import { loadStripe } from '@stripe/stripe-js';
import AddAddress from '../components/AddAddress';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
    fetchAddress
  } = useGlobalContext();

  const addressList = useSelector((state) => state.addresses.addressList);
  const cartItemsList = useSelector((state) => state.cartItem.cart);

  const [selectAddress, setSelectAddress] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const finalTotalPrice = isFastDelivery ? totalPrice + 30000 : totalPrice;


  useEffect(() => {
    // Đảm bảo chọn địa chỉ mặc định khi danh sách thay đổi
    if (addressList.length > 0) {
      const activeAddresses = addressList.filter((addr) => addr.status !== false);
      if (activeAddresses.length > 0) {
        setSelectAddress(activeAddresses[0]._id);
      }
    } else {
      setSelectAddress(null);
    }
  }, [addressList]);

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id,
        },
      });

      if (response.data.success) {
        toast.success("Đã xóa địa chỉ");
        await fetchAddress(); // cập nhật lại store
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

        }
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

        }
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
      toast.loading("Đang chuyển hướng...");
      const response = await Axios({
        ...SummaryApi.vnpayCreatePayment, // trỏ tới /create_payment
        params: {
          amount: finalTotalPrice,   // truyền tổng tiền cần thanh toán
          bankCode: "NCB",      // nếu có chọn ngân hàng
          language: "vn"        // ngôn ngữ giao diện VNPay
        }
      });

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        //Redirect tới VNPay
        window.location.href = paymentUrl;
      } else {
        toast.error("Không tạo được liên kết thanh toán VNPay");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Steps */}
      <div className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex justify-center items-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-600 font-semibold">Trang chủ</span>
          </div>
          <div className="w-12 h-px bg-green-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex justify-center items-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <span className="text-green-600 font-semibold">Thanh toán</span>
          </div>
          <div className="w-12 h-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center">
              <span className="text-gray-400 font-bold text-sm">3</span>
            </div>
            <span className="text-gray-400 font-medium">Hoàn thành</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Địa chỉ */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex justify-center items-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Địa chỉ giao hàng</h3>
            </div>
            <div className="space-y-4">
              {addressList.filter(addr => addr.status !== false).map((address) => (
                <label key={address._id}>
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${selectAddress === address._id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300'
                      }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-1">
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          onChange={(e) => setSelectAddress(e.target.value)}
                          checked={selectAddress === address._id}
                          className="w-5 h-5 text-green-600 border-green-300 mt-1"
                        />
                      </div>
                      <div className="col-span-10 space-y-1 text-sm">
                        <p><span className="font-semibold text-gray-900">Họ tên: </span>{address.fullname}</p>
                        <p><span className="font-semibold text-gray-600">Số điện thoại: </span>{address.mobile}</p>
                        <p><span className="font-semibold text-gray-600">Email: </span>{address.email}</p>
                        <p><span className="font-semibold text-gray-600">Mã bưu điện: </span>{address.pincode}</p>
                        <p><span className="font-semibold text-gray-600">Địa chỉ cụ thể: </span>
                          {address.address_line}, {address.state}, {address.district}, {address.city}, {address.country}
                        </p>
                      </div>
                      <div className="col-span-1 flex flex-col gap-2 items-end">
                        <button
                          onClick={() => {
                            setOpenEdit(true);
                            setEditData(address);
                          }}
                          className="bg-green-200 p-1 rounded hover:text-white hover:bg-green-600"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDisableAddress(address._id)}
                          className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-600"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </label>
              ))}

              <button
                onClick={() => setOpenAddress(true)}
                className="w-full border-2 border-dashed border-green-300 rounded-xl p-6 text-green-600 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex justify-center items-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Thêm địa chỉ mới</span>
                </div>
              </button>
            </div>
          </div>
          {/* Giao hàng */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex justify-center items-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Phương thức giao hàng</h3>
            </div>
            <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="delivery"
                  checked={!isFastDelivery}
                  onChange={() => setIsFastDelivery(false)}
                  className="w-5 h-5 text-green-600"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Giao hàng tiêu chuẩn</h4>
                  <p className="text-sm text-gray-600">Miễn phí • Giao trong 2-3 ngày làm việc</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <input
                  type="radio"
                  name="delivery"
                  checked={isFastDelivery}
                  onChange={() => setIsFastDelivery(true)}
                  className="w-5 h-5 text-green-600"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Giao hàng hỏa tốc</h4>
                  <p className="text-sm text-gray-600">Giao trong 24h • +30.000₫</p>
                </div>
              </div>



            </div>
          </div>


        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 sticky top-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tóm tắt đơn hàng</h3>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính ({totalQty} sản phẩm)</span>
                <span className="line-through">{DisplayPriceInVietnamDong(notDiscountTotalPrice)}</span>
              </div>

              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Giảm giá</span>
                <span>-{DisplayPriceInVietnamDong(notDiscountTotalPrice - totalPrice)}</span>
              </div>

              {isFastDelivery && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí giao hàng hỏa tốc</span>
                  <span>{DisplayPriceInVietnamDong(30000)}</span>
                </div>
              )}
             

              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-4">
                <span>Tổng cộng</span>
                <span>{DisplayPriceInVietnamDong(finalTotalPrice)}</span>
              </div>

            </div>

            <div className="space-y-3">
              <button
                onClick={handleOnlinePayment}
                disabled={!selectAddress}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
              >
                Thanh toán thẻ tín dụng
              </button>

              <button
                onClick={handleVnpayPayment}
                disabled={!selectAddress}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
              >
                Thanh toán VNPAY
              </button>

              <button
                onClick={handleCashOnDelivery}
                disabled={!selectAddress}
                className="w-full border border-green-600 text-green-600 font-semibold py-2 rounded-xl hover:bg-green-600 hover:text-white transition"
              >
                Thanh toán khi nhận hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {OpenEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
    </div>
  );
};

export default CheckoutPage;