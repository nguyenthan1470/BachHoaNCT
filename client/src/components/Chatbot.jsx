import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, X, Bot, User } from 'lucide-react';
import axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [{ text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' }],
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => setVisible(e.detail);
    window.addEventListener('toggle-chatbot', handler);
    return () => window.removeEventListener('toggle-chatbot', handler);
  }, []);

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
      setMessages([
        ...newMessages,
        { role: 'model', parts: [{ text: replyText }] },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'model',
          parts: [{ text: 'Rất tiếc, có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ qua hotline 0214.653.783!' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm định dạng chính sách đổi trả
  const formatMessage = (text) => {
    if (text.toLowerCase().includes('chính sách đổi trả')) {
      const lines = text.split('\n').filter(line => line.trim());
      return (
        <div className="space-y-1">
          <p className="font-semibold">Chính sách đổi trả:</p>
          <ul className="list-disc pl-5">
            {lines.slice(1).map((line, index) => (
              <li key={index} className="text-sm">{line.replace('-', '').trim()}</li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="text-emerald-600 hover:underline text-sm"
          >
            Liên hệ ngay để được hỗ trợ!
          </Link>
        </div>
      );
    }
    return <p className="text-sm leading-relaxed">{text}</p>;
  };

  return visible ? (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            className="group relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-3 border-2 border-white/20"
            onClick={() => setOpen(true)}
          >
            <MessageCircle size={24} className="group-hover:animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[95%] sm:w-96 h-[80vh] sm:h-[600px] max-w-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50"></div>
          <div className="relative h-full flex flex-col overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white px-6 py-4">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Bách Hóa NCT</h3>
                    <p className="text-sm text-green-100">Hỗ trợ 24/7 • Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 scrollbar-thin scrollbar-thumb-green-300/50 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-2 ${
                    msg.role === 'user'
                      ? 'flex-row-reverse space-x-reverse'
                      : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md'
                        : 'bg-white/80 border border-gray-200/50 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {formatMessage(msg.parts[0]?.text)}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white/80 border border-gray-200/50 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="relative border-t border-gray-200/50 bg-white/80 backdrop-blur-sm p-4">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
              <div className="relative flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full pl-4 pr-12 py-3 text-sm bg-gray-100/80 border-2 border-transparent rounded-full focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 placeholder-gray-500"
                    placeholder="Nhập tin nhắn của bạn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <MessageCircle
                    size={16}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="relative bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Send
                    size={16}
                    className={`relative z-10 transition-transform duration-200 ${
                      loading ? 'animate-pulse' : 'group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setInput('Giờ mở cửa là bao giờ?')}
                  className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors duration-200"
                >
                  Giờ mở cửa
                </button>
                <button
                  onClick={() => setInput('Có những sản phẩm gì?')}
                  className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
                >
                  Sản phẩm
                </button>
                <button
                  onClick={() => setInput('Địa chỉ cửa hàng')}
                  className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200"
                >
                  Địa chỉ
                </button>
                <button
                  onClick={() => setInput('Chính sách đổi trả ra sao?')}
                  className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors duration-200"
                >
                  Đổi trả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : null;
};

export default Chatbot;