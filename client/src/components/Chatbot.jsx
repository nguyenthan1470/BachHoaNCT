import React, { useState } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [{ text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' }],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', parts: [{ text: input }] }];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios({
        ...SummaryApi.chatbot,
        data: { chatHistory: newMessages },
      });

      const replyText = res.data.reply || 'Xin lỗi, tôi chưa hiểu câu hỏi.';
      setMessages([...newMessages, { role: 'model', parts: [{ text: replyText }] }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'model',
          parts: [{ text: 'Lỗi máy chủ. Vui lòng thử lại sau.' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setOpen(true)}
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex justify-between items-center">
            <span className="font-semibold text-lg">Bách Hóa NCT Hỗ trợ 24/7</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50 text-sm scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'ml-auto bg-green-100 text-right'
                    : 'bg-white border border-gray-200 text-left'
                } shadow-md`}
              >
                {msg.parts[0]?.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 italic text-center">Đang trả lời...</div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center border-t border-gray-200 px-5 py-3 bg-white">
            <input
              type="text"
              className="flex-1 p-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 placeholder-gray-500"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;