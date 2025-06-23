import React, { useState, useEffect } from 'react'
import { XCircle, Home, AlertTriangle, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  const [animateElements, setAnimateElements] = useState(false)
  const [showPulse, setShowPulse] = useState(true)

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setAnimateElements(true), 100)
    
    // Stop pulse effect after 3 seconds
    setTimeout(() => setShowPulse(false), 3000)
  }, [])

  // Simulated navigation function
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`)
    // In real app, this would use react-router navigation
  }

  const handleRetry = () => {
    console.log('Retrying payment...')
    // In real app, this would redirect to payment page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content Card */}
      <div className={`relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-white/20 transition-all duration-1000 transform ${
        animateElements ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        
        {/* Error Icon */}
        <div className={`mx-auto mb-6 transition-all duration-1000 delay-300 transform ${
          animateElements ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'
        }`}>
          <div className="relative">
            <XCircle className={`w-20 h-20 text-red-500 mx-auto ${showPulse ? 'animate-pulse' : ''}`} />
            {showPulse && (
              <div className="absolute inset-0 w-20 h-20 border-4 border-red-200 rounded-full animate-ping"></div>
            )}
          </div>
        </div>

        {/* Error Message */}
        <div className={`mb-8 transition-all duration-1000 delay-500 transform ${
          animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Có lỗi xảy ra! 😔
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            <span className="font-semibold text-red-600">Thanh toán</span> không thành công
          </p>
          <p className="text-sm text-gray-500">
            Đơn hàng của bạn đã bị hủy. Vui lòng thử lại sau
          </p>
        </div>

        {/* Error Details Card */}
        <div className={`bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-100 transition-all duration-1000 delay-700 transform ${
          animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-700">Thông tin giao dịch</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
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
        </div>

        {/* Possible Reasons */}
        <div className={`bg-amber-50 rounded-2xl p-4 mb-8 border border-amber-200 transition-all duration-1000 delay-800 transform ${
          animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h3 className="text-sm font-medium text-amber-800 mb-2">Nguyên nhân có thể:</h3>
          <ul className="text-xs text-amber-700 space-y-1 text-left">
            <li>• Số dư tài khoản không đủ</li>
            <li>• Thông tin thẻ không chính xác</li>
            <li>• Phiên giao dịch đã hết hạn</li>
            <li>• Bạn đã hủy giao dịch</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-4 transition-all duration-1000 delay-900 transform ${
          animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {/* Retry Payment Button */}
          {/* <button 
            onClick={handleRetry}
            className="group w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Thử lại thanh toán</span>
          </button> */}

          {/* Back to Cart Button */}
          {/* <button 
            onClick={() => handleNavigation('/cart')}
            className="group w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại giỏ hàng</span>
          </button> */}

          {/* Home Button */}
          <button 
            onClick={() => handleNavigation('/')}
            className="group w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <Link to = "/">Về trang chủ</Link>
          </button>
        </div>

        {/* Support Section */}
        <div className={`mt-8 transition-all duration-1000 delay-1100 transform ${
          animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500 mb-3">Cần hỗ trợ? Liên hệ với chúng tôi:</p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">
                <Phone className="w-3 h-3" />
                <span>Hotline</span>
              </button>
              <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Warning Elements */}
      <div className="absolute top-20 left-10 w-6 h-6 bg-red-300 rounded-full opacity-40 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-orange-300 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-bounce" style={{animationDelay: '2.5s'}}></div>
    </div>
  )
}

export default Cancel