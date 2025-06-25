
import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";


export async function getAllOrdersController(req, res) {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email mobile") 
      .populate("delivery_address") 
      .sort({ createdAt: -1 });

    return res.json({
      message: "Lấy tất cả đơn hàng thành công",
      data: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
      error: true,
      success: false,
    });
  }
}



export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "Thiếu orderId hoặc trạng thái",
        success: false,
        error: true,
      });
    }

    const updated = await OrderModel.findByIdAndUpdate(
      orderId,
      { payment_status: status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Cập nhật trạng thái thành công",
      data: updated,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
      success: false,
      error: true,
    });
  }
};
