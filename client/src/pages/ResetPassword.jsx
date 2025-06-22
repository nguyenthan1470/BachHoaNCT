import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const valideValue = Object.values(data).every(val => val)

  useEffect(() => {
    if (!(location?.state?.success)) {
      navigate("/")
    }
    if (location?.state?.email) {
      setData(prev => ({
        ...prev,
        email: location?.state?.email
      }))
    }
  }, [location, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận phải giống nhau")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })
        navigate("/login")
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-[380px] md:max-w-[423px] bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đặt lại mật khẩu</h2>
        <p className="text-sm text-gray-700 text-center mb-6">
          Nhập mật khẩu mới để đặt lại tài khoản của bạn.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-sm font-medium">Mật khẩu mới:</label>
            <div className="flex items-center bg-indigo-50 border rounded p-2 focus-within:ring-1 focus-within:ring-indigo-400">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Nhập mật khẩu mới"
              />
              <div onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-gray-600">
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Xác nhận mật khẩu:</label>
            <div className="flex items-center bg-indigo-50 border rounded p-2 focus-within:ring-1 focus-within:ring-indigo-400">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Nhập lại mật khẩu"
              />
              <div onClick={() => setShowConfirmPassword(prev => !prev)} className="cursor-pointer text-gray-600">
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!valideValue}
            className={`mt-2 w-full h-11 rounded-full text-white text-sm font-semibold transition-opacity ${
              valideValue
                ? "bg-green-700 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Đặt lại mật khẩu
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Bạn có tài khoản?{" "}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword
