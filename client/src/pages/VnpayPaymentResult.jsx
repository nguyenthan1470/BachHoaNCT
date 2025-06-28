import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useGlobalContext } from '../provider/GlobalProvider';

const VnpayPaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCartItem, fetchOrder } = useGlobalContext();

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const res = await Axios({
          ...SummaryApi.vnpayCheckPayment,
          params: Object.fromEntries([...searchParams])
        });

        const responseCode = res.data?.data?.vnp_ResponseCode;

        if (responseCode === '00') {
          await fetchCartItem(); // reset giỏ hàng
          await fetchOrder();    // load lại đơn hàng
          navigate('/success', { state: { text: 'Thanh toán VNPay' } });
        } else {
          navigate('/cancel', { state: { text: 'Thanh toán thất bại hoặc bị huỷ' } });
        }
      } catch (err) {
        navigate('/cancel', { state: { text: 'Lỗi xác minh thanh toán' } });
      }
    };

    checkPayment();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">Đang xác minh kết quả thanh toán...</p>
    </div>
  );
};

export default VnpayPaymentResult;
