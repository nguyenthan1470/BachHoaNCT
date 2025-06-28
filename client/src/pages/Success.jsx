import React, { useState, useEffect } from 'react'
import { CheckCircle, ShoppingBag, Home, Receipt, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider';

const Success = () => {
  // Simulated location state - in real app this would come from react-router
  const locationState = { text: "Thanh toán" }

  const [showConfetti, setShowConfetti] = useState(true)
  const [animateElements, setAnimateElements] = useState(false)
  const { fetchCartItem, fetchOrder } = useGlobalContext();

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setAnimateElements(true), 100)

    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000)
  
  }, [])

  const paymentText = Boolean(locationState?.text) ? locationState.text : "Thanh toán"

  // Simulated navigation function
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400 animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className={`relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-white/20 transition-all duration-1000 transform ${animateElements ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>

        {/* Success Icon */}
        <div className={`mx-auto mb-6 transition-all duration-1000 delay-300 transform ${animateElements ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'
          }`}>
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-200 rounded-full animate-ping"></div>
          </div>
        </div>


        <div className={`mb-8 transition-all duration-1000 delay-500 transform ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Thành công! 🎉
          </h1>
          <p className="text-green-800 font-bold text-lg text-center">
            <span className="font-semibold text-emerald-600">{paymentText}</span> thành công
          </p>
          <p className="text-sm text-gray-500">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
          </p>
        </div>


        <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-100 transition-all duration-1000 delay-700 transform ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
          <div className="flex items-center justify-center mb-3">
            <Receipt className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-700">Chi tiết giao dịch</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Thời gian:</span>
              <span>{new Date().toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <span className="text-emerald-600 font-medium">Hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-4 transition-all duration-1000 delay-900 transform ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>

          <button
            onClick={() => handleNavigation('/')}
            className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <Link to="/dashboard/myorders">Xem đơn hàng của tôi</Link>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Home Button */}
          <button
            onClick={() => handleNavigation('/')}
            className="group w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <Link to="/">Về trang chủ</Link>
          </button>
        </div>

        {/* Footer Note */}
        <div className={`mt-8 text-xs text-gray-400 transition-all duration-1000 delay-1100 transform ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
          <p>Cảm ơn bạn vì đã tin tưởng và mua sắm sản phẩm tại chúng tôi</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-6 h-6 bg-emerald-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-teal-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-green-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '2.5s' }}></div>
    </div>
  )
}

export default Success
