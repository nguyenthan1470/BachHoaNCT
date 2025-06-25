import qs from 'querystring';
import crypto from 'crypto';
import moment from 'moment';

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

// Tạo URL thanh toán VNPay
export const createPayment = (req, res) => {
  const { amount, bankCode = 'NCB', language = 'vn' } = req.query;

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const returnUrl = process.env.VNP_RETURN_URL;
  const vnp_Url = process.env.VNP_IPN_URL;

  const ipAddr = req.ip;
  const orderId = moment().format('YYYYMMDDHHmmss');
  const createDate = moment().format('YYYYMMDDHHmmss');
  const orderInfo = 'Thanh_toan_don_hang';
  const currCode = 'VND';

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
    vnp_CreateDate: createDate
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
  res.json({ paymentUrl });
};

// Kiểm tra kết quả thanh toán VNPay
export const checkPayment = (req, res) => {
  const query = req.query;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnp_SecureHash = query.vnp_SecureHash;

  delete query.vnp_SecureHash;
  const sortedQuery = sortObject(query);
  const signData = qs.stringify(sortedQuery);

  const hmac = crypto.createHmac('sha512', secretKey);
  const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (vnp_SecureHash === checkSum) {
    if (query.vnp_ResponseCode === '00') {
      res.json({ success: true, message: 'Thanh toán thành công', data: query });
    } else {
      res.json({ success: false, message: 'Thanh toán thất bại', data: query });
    }
  } else {
    res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
  }
};
