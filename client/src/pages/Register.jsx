import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Leaf, Truck, ShoppingCart, Eye, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { GoogleLogin } from '@react-oauth/google';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(data).every((val) => val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error('Mật khẩu và nhập lại mật khẩu phải giống nhau');
      return;
    }

    setIsLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.register,
        data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: '', email: '', password: '', confirmPassword: '' });
        navigate('/login');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   setIsLoading(true);
  //   try {
  //     const tokenId = credentialResponse.credential;

  //     const res = await Axios({
  //       ...SummaryApi.googleLogin,
  //       data: { tokenId },
  //       withCredentials: true,
  //     });

  //     if (res.data.success) {
  //       toast.success('Đăng ký Google thành công');

  //       const { accessToken, refreshToken } = res.data.data;
  //       if (accessToken) localStorage.setItem('accessToken', accessToken);
  //       if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

  //       const userDetails = await fetchUserDetails();
  //       dispatch(setUserDetails(userDetails.data));
  //       navigate('/');
  //     } else {
  //       toast.error(res.data.message || 'Đăng ký thất bại');
  //     }
  //   } catch (error) {
  //     AxiosToastError(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleGoogleError = () => {
  //   toast.error('Đăng ký Google thất bại. Vui lòng thử lại sau.');
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/50 via-orange-500/50 to-yellow-500/50"></div>

        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Tươi ngon mỗi ngày!
            </h1>
            <p className="text-lg text-yellow-100 leading-relaxed max-w-md">
              Đăng ký để khám phá các sản phẩm thực phẩm tươi sạch, giao hàng nhanh chóng đến từng nhà.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Leaf className="w-5 h-5 text-yellow-200" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Sản phẩm tươi sạch</h3>
                <p className="text-yellow-100 text-sm">Nguồn gốc rõ ràng, chất lượng đảm bảo</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Truck className="w-5 h-5 text-yellow-200" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Giao hàng nhanh</h3>
                <p className="text-yellow-100 text-sm">Đặt hôm nay, nhận ngay trong ngày</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <ShoppingCart className="w-5 h-5 text-yellow-200" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Ưu đãi hấp dẫn</h3>
                <p className="text-yellow-100 text-sm">Giảm giá cho đơn hàng đầu tiên</p>
              </div>
            </div>
          </div>

          {/* Promotion */}
          <div className="mt-8 bg-white/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm font-medium">Ưu đãi đặc biệt: <span className="font-bold">Giảm 20% cho đơn hàng đầu tiên!</span></p>
            <button className="mt-2 text-sm text-yellow-200 underline hover:text-yellow-300">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng ký</h2>
            <p className="text-gray-600 text-sm">Tạo tài khoản để bắt đầu mua sắm thôi nào</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 text-sm"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 text-sm"
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 text-sm"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 text-sm"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!valideValue || isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-white text-sm font-medium transition-all duration-200 ${valideValue && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                <>
                  <span>Đăng ký</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {/* <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            /> */}
            {/* Login link */}
            <p className="text-center text-xs text-gray-600">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-500 font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <Link to="/terms" className="text-green-600 hover:underline">Điều khoản sử dụng</Link>
              {' '}và{' '}
              <Link to="/privacy" className="text-green-600 hover:underline">Chính sách bảo mật</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
