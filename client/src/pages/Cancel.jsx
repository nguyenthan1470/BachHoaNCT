import React, { useState, useEffect } from 'react'
import { XCircle, Home, AlertTriangle, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  const [animateElements, setAnimateElements] = useState(false)
  const [showPulse, setShowPulse] = useState(true)

  useEffect(() => {
    setTimeout(() => setAnimateElements(true), 100)
    setTimeout(() => setShowPulse(false), 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className={`relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 w-full max-w-xs sm:max-w-sm md:max-w-md text-center border border-white/20 transition-all duration-1000 transform ${
        animateElements ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>

        <div className="relative mb-6">
          <XCircle className={`w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto ${showPulse ? 'animate-pulse' : ''}`} />
          {showPulse && (
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-red-200 rounded-full animate-ping"></div>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Có lỗi xảy ra! 😔
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-2">
          <span className="font-semibold text-red-600">Thanh toán</span> không thành công
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Đơn hàng của bạn đã bị hủy. Vui lòng thử lại sau
        </p>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 sm:p-6 mb-5 border border-red-100 text-xs text-gray-600 space-y-1">
          <div className="flex items-center justify-center mb-3 text-red-700 font-medium">
            <AlertTriangle size={16} className="mr-2" /> Thông tin giao dịch
          </div>
          <div className="flex justify-between">
            <span>Thời gian:</span>
            <span>{new Date().toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between">
            <span>Trạng thái:</span>
            <span className="text-red-600 font-medium">Đã hủy</span>
          </div>
          <div className="flex justify-between">
            <span>Mã lỗi:</span>
            <span className="text-gray-500 font-mono">ERR_PAYMENT_CANCELLED</span>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 mb-5 border border-amber-200 text-xs text-amber-700 text-left space-y-1">
          <h3 className="font-medium text-amber-800 mb-1">Nguyên nhân có thể:</h3>
          <ul className="list-disc list-inside">
            <li>Số dư tài khoản không đủ</li>
            <li>Thông tin thẻ không chính xác</li>
            <li>Phiên giao dịch đã hết hạn</li>
            <li>Bạn đã hủy giao dịch</li>
          </ul>
        </div>

        <button
          className="group w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
        >
          <Home size={18} />
          <Link to="/">Về trang chủ</Link>
        </button>

        <div className="mt-6 border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">Cần hỗ trợ? Liên hệ với chúng tôi:</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
              <Phone size={14} />
              <span>Hotline</span>
            </button>
            <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
              <Mail size={14} />
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cancel
