import qs from 'querystring';
import crypto from 'crypto';
import moment from 'moment';
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export const createPayment = async (req, res) => {
  const { amount, bankCode = 'NCB', language = 'vn', list_items, addressId, subTotalAmt } = req.body;
  const userId = req.userId;

  console.log('Request body:', req.body);

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const returnUrl = process.env.VNP_RETURN_URL;
  const vnp_Url = process.env.VNP_IPN_URL;

  if (!tmnCode || !secretKey || !returnUrl || !vnp_Url) {
    console.error('Missing environment variables:', { tmnCode, secretKey, returnUrl, vnp_Url });
    return res.status(500).json({ error: 'Cấu hình VNPay không hợp lệ' });
  }

  const ipAddr = req.ip || '127.0.0.1';
  const orderId = moment().format('YYYYMMDDHHmmss');
  const createDate = moment().format('YYYYMMDDHHmmss');
  const orderInfo = 'Thanh_toan_don_hang';
  const currCode = 'VND';

  req.session.vnpayData = {
    userId,
    list_items,
    addressId,
    subTotalAmt,
    totalAmt: amount,
    orderId,
  };
  console.log('Session data saved:', req.session.vnpayData);

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'billpayment',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params);
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params.vnp_SecureHash = signed;

  const paymentUrl = `${vnp_Url}?${qs.stringify(vnp_Params)}`;
  console.log('Generated paymentUrl:', paymentUrl);
  res.json({ paymentUrl });
};

export const checkPayment = async (req, res) => {
  const query = req.query;
  console.log('Query received from VNPay:', query);
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnp_SecureHash = query.vnp_SecureHash;

  delete query.vnp_SecureHash;
  const sortedQuery = sortObject(query);
  const signData = qs.stringify(sortedQuery);

  const hmac = crypto.createHmac('sha512', secretKey);
  const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  console.log('Calculated checkSum:', checkSum);
  console.log('Received vnp_SecureHash:', vnp_SecureHash);

  if (vnp_SecureHash === checkSum) {
    if (query.vnp_ResponseCode === '00') {
      try {
        let vnpayData = req.session.vnpayData;
        console.log('Session data from session:', vnpayData);

        if (!vnpayData || !vnpayData.list_items || vnpayData.list_items.length === 0) {
          console.warn('Session data missing or list_items empty, attempting to recover from query');
          vnpayData = {
            userId: req.userId,
            list_items: req.body.list_items || [],
            addressId: req.body.addressId,
            subTotalAmt: parseInt(query.vnp_Amount) / 100,
            totalAmt: parseInt(query.vnp_Amount) / 100,
            orderId: query.vnp_TxnRef,
          };
          console.log('Recovered vnpayData:', vnpayData);
        }

        if (!vnpayData || !vnpayData.userId) {
          throw new Error('Dữ liệu thanh toán hoặc userId không tồn tại');
        }

        const { userId, list_items, addressId, subTotalAmt, totalAmt } = vnpayData;
        console.log('UserId used for order:', userId);

        const payload = list_items.map((el) => {
          if (!el.productId || !el.productId._id || !mongoose.Types.ObjectId.isValid(el.productId._id)) {
            console.error('Invalid productId in list_items:', el.productId._id);
            throw new Error('Dữ liệu sản phẩm không hợp lệ');
          }
          if (!mongoose.Types.ObjectId.isValid(addressId)) {
            console.error('Invalid addressId:', addressId);
            throw new Error('Địa chỉ không hợp lệ');
          }
          // Calculate discounted price per product
          const discount = el.productId.discount || 0;
          const price = el.productId.price || 0;
          const discountedPrice = price - Math.ceil((price * discount) / 100);
          const totalPrice = discountedPrice * (el.quantity || 1);

          return {
            userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            product_details: {
              name: el.productId.name,
              image: el.productId.image || [],
              quantity: el.quantity || 1,
              price: totalPrice,
            },
            paymentId: query.vnp_TxnRef,
            payment_status: 'Đã thanh toán',
            delivery_address: addressId,
            subTotalAmt,
            totalAmt,
          };
        });

        console.log('Payload to insert:', payload);
        const generatedOrder = await OrderModel.insertMany(payload);
        console.log('Orders created successfully with IDs:', generatedOrder.map(o => o._id));

        for (const el of list_items) {
          await ProductModel.findByIdAndUpdate(el.productId._id, {
            $inc: { sold: el.quantity },
          }, { new: true, runValidators: true });
        }

        const deleteResult = await CartProductModel.deleteMany({ userId });
        console.log('Deleted cart items:', deleteResult);
        const updateUserResult = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
        console.log('Updated user shopping_cart:', updateUserResult);

        if (req.session.vnpayData) delete req.session.vnpayData;
        console.log('Session after delete:', req.session);

        res.json({
          success: true,
          message: 'Thanh toán thành công',
          data: query,
        });
      } catch (error) {
        console.error('Error in checkPayment:', error.message, error.stack);
        res.status(500).json({
          success: false,
          message: 'Lỗi khi xử lý đơn hàng: ' + error.message,
          error: error.message,
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Thanh toán thất bại',
        data: query,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
    });
  }
};