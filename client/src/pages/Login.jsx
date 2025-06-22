import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import anhLogin from "../assets/anhLogin.png";

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(data).every(val => val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({ ...SummaryApi.login, data });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));
        setData({ email: '', password: '' });
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center px-4 py-10 bg-[#f6faff]">
      <div className="hidden md:flex w-1/2 items-center justify-center pr-6">
        <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-[750px] max-h-[1400px]" >
          <img
            className="w-full h-full object-cover"
            src={anhLogin}
            alt="Ảnh login"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium">Đăng nhập</h2>
          <p className="text-sm text-gray-500/90 mt-3">Chào mừng bạn! Vui lòng đăng nhập để tiếp tục</p>

          <button
            type="button"
            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="Đăng nhập với Google"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">hoặc đăng nhập bằng email</p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Email input */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
            />
          </div>

          {/* Password input */}
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 pr-4">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
            />
            <div onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-gray-500">
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-4 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input className="h-5" type="checkbox" id="remember" />
              <label className="text-sm" htmlFor="remember">Ghi nhớ đăng nhập</label>
            </div>
            <Link to="/forgot-password" className="text-sm underline">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            disabled={!valideValue}
            className={`mt-8 w-full h-11 rounded-full text-white ${valideValue ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-400 cursor-not-allowed'
              } transition-opacity`}
          >
            Đăng nhập
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-green-600 hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
