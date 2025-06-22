import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import anhLogin from '../assets/anhLogin.png';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center px-4 py-10 bg-[#f6faff] transition-all duration-500 ease-in-out">
      {/* Form bên trái */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="md:w-96 w-80">
          <h2 className="text-4xl text-gray-900 font-medium text-center">Đăng ký</h2>
          <p className="text-sm text-gray-500/90 mt-3 text-center">Tạo tài khoản để bắt đầu mua sắm</p>

          <div className="mt-6 grid gap-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm outline-none"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm outline-none"
            />

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full outline-none text-sm bg-transparent"
              />
              <div onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer text-gray-500">
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full outline-none text-sm bg-transparent"
              />
              <div onClick={() => setShowConfirmPassword((prev) => !prev)} className="cursor-pointer text-gray-500">
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>

            <button
              type="submit"
              disabled={!valideValue}
              className={`mt-4 w-full h-11 rounded-full text-white ${
                valideValue ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-400 cursor-not-allowed'
              } transition-all`}
            >
              Đăng ký
            </button>
            <p className="text-gray-500/90 text-sm text-center">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-green-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Ảnh bên phải */}
      <div className="hidden md:flex w-1/2 items-center justify-center pl-6">
        <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-[750px] max-h-[1400px]">
          <img src={anhLogin} alt="Register Image" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Register;
