import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useGlobalContext } from "../provider/GlobalProvider";
import { toast } from "react-hot-toast";

const VnpayPaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCartItem, fetchOrder, refreshOrder } = useGlobalContext();

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const res = await Axios({
          ...SummaryApi.vnpayCheckPayment,
          params: Object.fromEntries([...searchParams]),
        });

        console.log("Response from checkPayment:", res.data);
        if (res.data.success) {
          await fetchCartItem();
          await refreshOrder();
          setTimeout(() => navigate("/success", { state: { text: "Thanh toán VNPay" } }), 1000);
        } else {
          toast.error(res.data.message || "Thanh toán thất bại hoặc bị hủy");
          navigate("/cancel", {
            state: { text: res.data.message || "Thanh toán thất bại hoặc bị hủy" },
          });
        }
      } catch (err) {
        console.error(
          "Error in checkPayment:",
          err.response ? err.response.data : err.message
        );
        toast.error("Lỗi xác minh thanh toán");
        navigate("/cancel", { state: { text: "Lỗi xác minh thanh toán" } });
      }
    };

    checkPayment();
  }, [fetchCartItem, fetchOrder, refreshOrder, navigate, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">Đang xác minh kết quả thanh toán...</p>
    </div>
  );
};

export default VnpayPaymentResult;