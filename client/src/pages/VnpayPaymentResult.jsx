import React, { useEffect, useState } from 'react';
import { Result, Button } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const VnpayPaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('info');
  const [title, setTitle] = useState('Đang xử lý thanh toán...');

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const res = await Axios({
          ...SummaryApi.vnpayCheckPayment,
          params: Object.fromEntries([...searchParams])
        });

        if (res.data?.data?.vnp_ResponseCode === '00') {
          setStatus('success');
          setTitle('Thanh toán thành công');
        } else {
          setStatus('error');
          setTitle('Thanh toán thất bại hoặc bị hủy');
        }
      } catch (err) {
        setStatus('error');
        setTitle('Lỗi khi xác minh thanh toán');
      }
    };

    checkPayment();
  }, []);

  return (
    <Result
      status={status}
      title={title}
      subTitle="Cảm ơn bạn đã sử dụng dịch vụ."
      extra={[
        <Button type="primary" onClick={() => navigate('/')}>Quay về trang chủ</Button>
      ]}
    />
  );
};

export default VnpayPaymentResult;
