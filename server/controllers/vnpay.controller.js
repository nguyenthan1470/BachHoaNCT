import crypto from 'crypto';
import qs from 'qs';
import Order from '../models/order.model.js'; // Assuming order model is here

// Helper function to sort object keys alphabetically
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

// Verify secure hash from VNPay query parameters
function verifySecureHash(query, secretKey) {
  const vnpSecureHash = query.vnp_SecureHash;
  const vnpSecureHashType = query.vnp_SecureHashType;
  const data = { ...query };
  delete data.vnp_SecureHash;
  delete data.vnp_SecureHashType;

  const sortedData = sortObject(data);
  const signData = qs.stringify(sortedData, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return signed === vnpSecureHash;
}

// Handle VNPay return URL
export const vnpayReturn = async (req, res) => {
  try {
    const secretKey = process.env.VNP_HASH_SECRET;
    const query = req.query;

    // Verify secure hash
    if (!verifySecureHash(query, secretKey)) {
      return res.status(400).send('Invalid signature');
    }

    const vnpResponseCode = query.vnp_ResponseCode;
    const orderId = query.vnp_TxnRef;

    // Find order by orderId (assuming orderId is stored as string in order model)
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    if (vnpResponseCode === '00') {
      // Payment success
      order.status = 'Paid';
      await order.save();
      // Redirect or respond with success page
      return res.redirect('/success?message=Thanh toán thành công');
    } else {
      // Payment failed or canceled
      order.status = 'Failed';
      await order.save();
      return res.redirect('/cancel?message=Thanh toán không thành công');
    }
  } catch (error) {
    console.error('VNPay return error:', error);
    return res.status(500).send('Internal Server Error');
  }
};

// Handle VNPay IPN (Instant Payment Notification)
export const vnpayIPN = async (req, res) => {
  try {
    const secretKey = process.env.VNP_HASH_SECRET;
    const query = req.query;

    // Verify secure hash
    if (!verifySecureHash(query, secretKey)) {
      return res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const vnpResponseCode = query.vnp_ResponseCode;
    const orderId = query.vnp_TxnRef;

    // Find order by orderId
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ RspCode: '01', Message: 'Order not found' });
    }

    if (vnpResponseCode === '00') {
      // Payment success
      order.status = 'Paid';
      await order.save();
      return res.json({ RspCode: '00', Message: 'Confirm Success' });
    } else {
      // Payment failed or canceled
      order.status = 'Failed';
      await order.save();
      return res.json({ RspCode: '02', Message: 'Confirm Fail' });
    }
  } catch (error) {
    console.error('VNPay IPN error:', error);
    return res.status(500).json({ RspCode: '99', Message: 'Internal Server Error' });
  }
};