import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Mail, Send, X, MessageCircle, User, Clock, CheckCircle, Check } from 'lucide-react';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

const fetchFeedbacks = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.getFeedbacks,
      method: 'GET',
    });
      if (response.status === 200) {
        // Ensure feedbacks is always an array
        let data = response.data;
        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else if (Array.isArray(data.data)) {
          setFeedbacks(data.data);
        } else {
          setFeedbacks([]);
        }
    }
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    setShowError(true);
  }
};

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await Axios({
        ...SummaryApi.sendReply,
        data: {
          feedbackId: selectedFeedback._id,
          reply: replyMessage,
          email: selectedFeedback.email,
          name: selectedFeedback.name,
        },
      });

      if (response.status === 200) {
        setShowSuccess(true);
        setReplyMessage('');
        setSelectedFeedback(null);
        await fetchFeedbacks();
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Quản lý phản hồi khách hàng
          </h1>
          <p className="text-green-600 text-lg">Lắng nghe và phản hồi mọi ý kiến của khách hàng</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded-lg flex items-center shadow-md">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span>Phản hồi đã được gửi thành công!</span>
          </div>
        )}
        {showError && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg flex items-center shadow-md">
            <X className="w-5 h-5 text-red-600 mr-3" />
            <span>Đã xảy ra lỗi. Vui lòng thử lại.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 flex items-center">
            <Mail className="w-6 h-6 text-green-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Tổng phản hồi</p>
              <p className="text-2xl font-bold">{feedbacks.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-500 flex items-center">
            <CheckCircle className="w-6 h-6 text-emerald-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Đã phản hồi</p>
              <p className="text-2xl font-bold">{feedbacks.filter(f => f.reply).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-500 flex items-center">
            <Clock className="w-6 h-6 text-yellow-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Chờ phản hồi</p>
              <p className="text-2xl font-bold">{feedbacks.filter(f => !f.reply).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <MessageCircle className="w-6 h-6 mr-3" />
              Danh sách phản hồi
            </h2>
          </div>

          <div className="p-8 space-y-6">
            {feedbacks.length === 0 ? (
              <div className="text-center text-gray-500">Chưa có phản hồi nào.</div>
            ) : (
              feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className={`rounded-2xl p-6 border-l-4 ${
                    feedback.reply
                      ? 'bg-gray-100 border-gray-400'
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                  } hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-white bg-gradient-to-r from-green-400 to-emerald-400 rounded-full p-1 mr-3" />
                        <div>
                          <h3 className="text-lg font-bold">{feedback.name}</h3>
                          <p className="text-sm text-green-600">{feedback.email}</p>
                        </div>
                        <span className="ml-auto text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(feedback.createdAt)}
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                        <p className="text-gray-700">{feedback.message}</p>
                      </div>

                      {feedback.reply && (
                        <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg p-4 border-l-4 border-emerald-500 mb-3">
                          <div className="flex items-center mb-2">
                            <Send className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="font-semibold text-emerald-800">Phản hồi từ Admin:</span>
                          </div>
                          <p className="text-emerald-700">{feedback.reply}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {feedback.reply && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 mr-1" /> Đã phản hồi
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setReplyMessage(feedback.reply || '');
                        }}
                        className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 ${
                          feedback.reply
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>{feedback.reply ? 'Sửa phản hồi' : 'Trả lời'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Mail className="w-6 h-6 mr-3" />
                  Phản hồi: {selectedFeedback.name}
                </h2>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-white hover:text-green-200 p-1 hover:bg-white/20 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-1">Tin nhắn gốc:</p>
                  <p>{selectedFeedback.message}</p>
                </div>

                <form onSubmit={handleReplySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Nội dung phản hồi *</label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows="6"
                      className="w-full p-4 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="Nhập nội dung phản hồi..."
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setSelectedFeedback(null)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Gửi phản hồi
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
