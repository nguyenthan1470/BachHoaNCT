import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users, Award } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import ContactItem from '../components/ContactItem';
import ScheduleItem from '../components/ScheduleItem';
import AlertMessage from '../components/AlertMessage';
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
 
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await Axios({
        ...SummaryApi.sendContactMessage,
        data: formData
      });

      if (response.status === 200) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Liên hệ với chúng tôi</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với Bách Hóa NCT để được tư vấn tốt nhất!
          </p>
        </div>
      </div>

      {/* Info Highlights */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10 grid md:grid-cols-3 gap-6">
        {[
          { icon: Clock, title: 'Phục vụ 24/7', desc: 'Luôn sẵn sàng hỗ trợ', bg: 'green' },
          { icon: Users, title: '10,000+ Khách hàng', desc: 'Tin tưởng lựa chọn', bg: 'blue' },
          { icon: Award, title: 'Chất lượng A+', desc: 'Cam kết hài lòng', bg: 'yellow' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className={`p-3 bg-${item.bg}-100 rounded-full`}>
                <item.icon className={`w-6 h-6 text-${item.bg}-600`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
              <span className="w-1 h-8 bg-green-500 rounded-full mr-4"></span>Thông tin liên hệ
            </h2>
            <div className="space-y-6">
              <ContactItem icon={MapPin} color="green" title="Địa chỉ cửa hàng" desc="99A Trần Quốc Thảo, Phường 7, Quận 3, TP.HCM" />
              <ContactItem icon={Mail} color="blue" title="Email liên hệ" desc="BachHoaNCT@gmail.com" />
              <ContactItem icon={Phone} color="purple" title="Số điện thoại" desc="0214.653.783" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Giờ làm việc</h3>
            <ScheduleItem label="Thứ 2 - Thứ 6:" time="8:00 - 22:00" />
            <ScheduleItem label="Thứ 7 - Chủ nhật:" time="7:00 - 23:00" />
            <ScheduleItem label="Ngày lễ:" time="9:00 - 21:00" />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
            <span className="w-1 h-8 bg-blue-500 rounded-full mr-4"></span>Gửi tin nhắn
          </h2>

          {showSuccess && (
            <AlertMessage type="success" message="Gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất." />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Họ và tên *" name="name" value={formData.name} onChange={handleInputChange} />
            <InputField label="Email *" name="email" value={formData.email} onChange={handleInputChange} type="email" />
            <TextAreaField label="Nội dung tin nhắn *" name="message" value={formData.message} onChange={handleInputChange} />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition duration-300 flex items-center justify-center space-x-2 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:brightness-110'
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

      {/* Map */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tìm đường đến cửa hàng</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Chúng tôi nằm tại vị trí thuận tiện, dễ dàng di chuyển bằng nhiều phương tiện giao thông khác nhau.</p>
        </div>
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
          <iframe
            title="Bản đồ Bách Hóa NCT"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1076745483574!2d106.70387137486708!3d10.801998089341412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752929eaaaaaab%3A0xaaaaaaa!2zMTIzIMSQ4buTbmcgQUJDLCBRdeG6rW4gMSwgVGjDoCBQaOG7pyBI4buTIENow60!5e0!3m2!1svi!2s!4v1680500000000!5m2!1svi!2s"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="hover:contrast-110 transition duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
