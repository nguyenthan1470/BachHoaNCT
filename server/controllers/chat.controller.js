import ProductModel from '../models/product.model.js';
import fetch from 'node-fetch';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const chatWithGemini = async (req, res) => {
  const { chatHistory } = req.body;
  const userMessage = chatHistory[chatHistory.length - 1]?.parts[0]?.text?.toLowerCase();

  try {
   // tạo ngữ cảnh cho các câu hỏi thường gặp
    if (userMessage.includes('sản phẩm') || userMessage.includes('giá') || userMessage.includes('có gì')) {

      const products = await ProductModel.find({ publish: true })
        .populate('category subCategory')
        .lean();


      const productList = products.map(p => {
        const discountPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        return `${p.name} - ${discountPrice} VNĐ${p.discount > 0 ? ` (Giảm ${p.discount}%)` : ''} - ${p.description || 'Không có mô tả'}`;
      }).join(', ');

      // Tạo ngữ cảnh cho Gemini
      const context = `Bạn là chatbot hỗ trợ cho một website bán thực phẩm. Các sản phẩm hiện có: ${productList}. Hãy trả lời câu hỏi: "${userMessage}" dựa trên thông tin này.
       Nếu khách hỏi giá hoặc chi tiết cụ thể (ví dụ: mô tả, tồn kho), yêu cầu họ cung cấp tên sản phẩm.`;
      chatHistory.push({
        role: 'user',
        parts: [{ text: context }],
      });
    }
    if (userMessage.includes('giờ mở cửa') || userMessage.includes('mấy giờ mở')) {
      const context = `Cửa hàng Bách Hóa NCT mở cửa từ 7:00 sáng đến 22:00 tối mỗi ngày (bao gồm cả cuối tuần và ngày lễ). 
  Trả lời dựa trên thông tin này.`;
      chatHistory.push({
        role: 'user',
        parts: [{ text: context }],
      });
    }

    if (userMessage.includes('địa chỉ') || userMessage.includes('ở đâu') || userMessage.includes('chỉ đường')) {
      const context = `Địa chỉ cửa hàng Bách Hóa NCT: 99A Trần Quốc Thảo, Phường 7, Quận 3, TP.HCM. Số điện thoại: 0214.653.783 , Email liên hệ: BachHoaNCT@gmail.com
  Hãy đưa thông tin này khi khách hỏi về địa chỉ.`;
      chatHistory.push({
        role: 'user',
        parts: [{ text: context }],
      });
    }

    if (userMessage.includes('giao hàng') || userMessage.includes('ship') || userMessage.includes('vận chuyển')) {
      const context = `Bách Hóa NCT có dịch vụ giao hàng tận nơi trong TP.HCM. 
  Phí ship dao động từ 20.000 VNĐ đến 30.000 VNĐ tùy khu vực. 
  Thời gian giao trong ngày hoặc tối đa 24h.`;
      chatHistory.push({
        role: 'user',
        parts: [{ text: context }],
      });
    }

    if (userMessage.includes('thanh toán') || userMessage.includes('trả tiền') || userMessage.includes('payment')) {
      const context = `Bách Hóa NCT chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng và ví điện tử (Momo, ZaloPay, VNPay).`;
      chatHistory.push({
        role: 'user',
        parts: [{ text: context }],
      });
    }

    if (userMessage.includes('đổi trả') || userMessage.includes('bảo hành') || userMessage.includes('refund')) {
      const context = `Chính sách đổi trả tại Bách Hóa NCT: 
  - Đổi trả trong vòng 7 ngày kể từ khi nhận hàng. 
  - Sản phẩm còn nguyên tem, bao bì. 
  - Không áp dụng cho hàng khuyến mãi hoặc đã sử dụng.`;
      chatHistory.push({
        role: 'user',
        parts: [{ text: context }],
      });
    }


    // Gửi yêu cầu đến API Gemini
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Lỗi từ API Gemini' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ mô hình.';
    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};