import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const isValid = Object.values(data).every((val) => val)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/verification-otp', {
          state: data,
        })
        setData({ email: '' })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${
              isValid
                ? 'bg-green-800 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Gửi mã xác thực
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Bạn đã có tài khoản?{' '}
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ForgotPassword
