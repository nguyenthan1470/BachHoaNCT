import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users, Award } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với Bách Hóa NCT để được tư vấn tốt nhất!
            </p>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Phục vụ 24/7</h3>
                <p className="text-gray-600 text-sm">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">10,000+ Khách hàng</h3>
                <p className="text-gray-600 text-sm">Tin tưởng lựa chọn</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Chất lượng A+</h3>
                <p className="text-gray-600 text-sm">Cam kết hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
                <span className="w-1 h-8 bg-green-500 rounded-full mr-4"></span>
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group hover:bg-green-50 p-4 rounded-xl transition-all duration-300">
                  <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ cửa hàng</h3>
                    <p className="text-gray-600 leading-relaxed">99A Trần Quốc Thảo, Phường 7, Quận 3, Thành phố Hồ Chí Minh</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group hover:bg-blue-50 p-4 rounded-xl transition-all duration-300">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email liên hệ</h3>
                    <p className="text-gray-600">BachHoaNCT@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group hover:bg-purple-50 p-4 rounded-xl transition-all duration-300">
                  <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Số điện thoại</h3>
                    <p className="text-gray-600">0214.653.783</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Giờ làm việc</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span className="font-semibold">8:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7 - Chủ nhật:</span>
                  <span className="font-semibold">7:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày lễ:</span>
                  <span className="font-semibold">9:00 - 21:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
              <span className="w-1 h-8 bg-blue-500 rounded-full mr-4"></span>
              Gửi tin nhắn
            </h2>
            
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-700 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-semibold">Gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-2">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                  required
                />
              </div>
              
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                  required
                />
              </div>
              
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-2">Nội dung tin nhắn *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Vui lòng mô tả chi tiết nhu cầu của bạn..."
                  rows="5"
                  className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 group-hover:border-gray-300 resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg transform hover:-translate-y-1'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Gửi tin nhắn</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tìm đường đến cửa hàng</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi nằm tại vị trí thuận tiện, dễ dàng di chuyển bằng nhiều phương tiện giao thông khác nhau.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <iframe
              title="Bản đồ Bách Hóa NCT"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1076745483574!2d106.70387137486708!3d10.801998089341412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752929eaaaaaab%3A0xaaaaaaa!2zMTIzIMSQ4buTbmcgQUJDLCBRdeG6rW4gMSwgVGjDoCBQaOG7pyBI4buTIENow60!5e0!3m2!1svi!2s!4v1680500000000!5m2!1svi!2s"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="hover:contrast-110 transition-all duration-300"
            />
          </div>
        </div>
      </div>

     

      
    </div>
  );
};

export default Contact;