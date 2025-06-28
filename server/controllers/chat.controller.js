import ProductModel from '../models/product.model.js';
import fetch from 'node-fetch';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const chatWithGemini = async (req, res) => {
  const { chatHistory } = req.body;
  const userMessage = chatHistory[chatHistory.length - 1]?.parts[0]?.text?.toLowerCase();

  try {

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