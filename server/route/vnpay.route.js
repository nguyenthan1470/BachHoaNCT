// import express from 'express';
// import crypto from 'crypto';
// import qs from 'qs';
// import { vnpayReturn, vnpayIPN } from '../controllers/vnpay.controller.js';

// const router = express.Router();

// // Sắp xếp tham số theo thứ tự alphabet
// function sortObject(obj) {
//   const sorted = {};
//   const keys = Object.keys(obj).sort();
//   for (const key of keys) {
//     sorted[key] = obj[key];
//   }
//   return sorted;
// }

// // Format ngày theo YYYYMMDDHHmmss
// function formatDate(date) {
//   const pad = (n) => (n < 10 ? '0' + n : n);
//   return (
//     date.getFullYear().toString() +
//     pad(date.getMonth() + 1) +
//     pad(date.getDate()) +
//     pad(date.getHours()) +
//     pad(date.getMinutes()) +
//     pad(date.getSeconds())
//   );
// }

// router.post('/create-payment', (req, res) => {
//   const tmnCode = process.env.VNP_TMN_CODE;
//   const secretKey = process.env.VNP_HASH_SECRET;
//   const vnpUrl = process.env.VNP_URL;
//   const returnUrl = process.env.VNP_RETURN_URL;

//   const orderId = Date.now();
//   const amount = req.body.amount || 50000;
//   const bankCode = req.body.bankCode || 'VNBANK';

//   const createDate = formatDate(new Date());
//   const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1'; // lấy IP thực của client

//   let vnp_Params = {
//     vnp_Version: '2.1.0',
//     vnp_Command: 'pay',
//     vnp_TmnCode: tmnCode,
//     vnp_Locale: 'vn',
//     vnp_CurrCode: 'VND',
//     vnp_TxnRef: orderId.toString(),
//     vnp_OrderInfo: `Thanh toan don hang #${orderId}`,
//     vnp_OrderType: 'other',
//     vnp_Amount: amount * 100,
//     vnp_ReturnUrl: returnUrl,
//     vnp_IpAddr: ipAddr,
//     vnp_CreateDate: createDate
//   };

//   if (bankCode) {
//     vnp_Params.vnp_BankCode = bankCode;
//   }

//   // Sắp xếp, ký
//   vnp_Params = sortObject(vnp_Params);
//   const signData = qs.stringify(vnp_Params, { encode: false });
//   const hmac = crypto.createHmac('sha512', secretKey);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
//   vnp_Params.vnp_SecureHash = signed;

//   const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true })}`;

//   // ✅ Trả về URL để client redirect
//   res.json({ paymentUrl });
// });

// // Route to handle VNPay return URL
// router.get('/vnpay_return', vnpayReturn);

// // Route to handle VNPay IPN notifications
// router.post('/vnpay-ipn', vnpayIPN);

// export default router;
