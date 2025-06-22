import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""])
  const navigate = useNavigate()
  const inputRef = useRef([])
  const location = useLocation()

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password")
    }
  }, [location, navigate])

  const valideValue = data.every((val) => val)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp: data.join(""),
          email: location?.state?.email,
        },
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setData(["", "", "", "", "", ""])
        navigate("/reset-password", {
          state: {
            success: true,
            email: location?.state?.email,
          },
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-[380px] md:max-w-[423px] bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <p className="text-2xl font-semibold text-gray-900">Xác minh OTP</p>
        <p className="mt-2 text-sm text-gray-700 text-center">
          Nhập mã gồm 6 chữ số đã gửi đến email của bạn.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="grid grid-cols-6 gap-2 sm:gap-3 w-11/12 mt-8">
            {data.map((value, index) => (
              <input
                key={"otp" + index}
                type="text"
                maxLength={1}
                className="w-full h-12 bg-indigo-50 text-gray-900 text-xl rounded-md outline-none text-center"
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value
                  if (!/^\d*$/.test(newValue)) return // chỉ cho số

                  const newData = [...data]
                  newData[index] = newValue
                  setData(newData)

                  if (newValue && index < 5) {
                    inputRef.current[index + 1]?.focus()
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !data[index] && index > 0) {
                    inputRef.current[index - 1]?.focus()
                  }
                }}
                ref={(ref) => (inputRef.current[index] = ref)}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!valideValue}
            className={`mt-8 w-full max-w-80 h-11 rounded-full text-white text-sm transition-opacity ${
              valideValue
                ? "bg-green-700 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Xác minh Email
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Bạn có tài khoản?{" "}
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

export default OtpVerification
