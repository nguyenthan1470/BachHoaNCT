import crypto from 'crypto'
import qs from 'qs'

export default function handler(req, res) {
  const { amount, orderId } = req.body

  const tmnCode = process.env.VNP_TMN_CODE
  const secretKey = process.env.VNP_HASH_SECRET
  const returnUrl = process.env.VNP_RETURN_URL

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: amount * 100, // nhân 100 vì VNPay yêu cầu đơn vị là đồng
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId.toString(),
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14),
  }

  // Bước 1: Sắp xếp theo thứ tự alphabet
  vnp_Params = sortObject(vnp_Params)

  // Bước 2: Tạo chuỗi query không encode
  const signData = qs.stringify(vnp_Params, { encode: false })

  // Bước 3: Tạo hash
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(signData, 'utf-8').digest('hex')

  // Bước 4: Gắn vnp_SecureHash
  vnp_Params.vnp_SecureHash = signed

  // Bước 5: Tạo URL thanh toán
  const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${qs.stringify(vnp_Params, { encode: true })}`

  return res.status(200).json({ url: paymentUrl })
}

function sortObject(obj) {
  const sorted = {}
  const keys = Object.keys(obj).sort()
  for (const key of keys) {
    sorted[key] = obj[key]
  }
  return sorted
}
