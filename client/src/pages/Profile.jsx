import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, Phone, Edit2, Camera, Save, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { setUserDetails } from '../store/userSlice'
import fetchUserDetails from '../utils/fetchUserDetails'
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'

const Profile = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile
  })

  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [openUserProfileAvatarEdit, setUserProfileAvatarEdit] = useState(false)

  const formatLastLogin = (isoDateStr) => {
    const date = new Date(isoDateStr)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
  const [lastLogin, setLastLogin] = useState(user.lastLogin || new Date().toISOString())

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    })
    setLastLogin(user.lastLogin || new Date().toISOString())
  }, [user])
  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    })
  }, [user])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    })
    setIsEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData
      })

      if (response.data.success) {
        toast.success(response.data.message)
        const result = await fetchUserDetails()
        dispatch(setUserDetails(result.data))
        setIsEditing(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Cover */}
          <div className="relative bg-gradient-to-r from-green-500 to-green-700 h-32">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setUserProfileAvatarEdit(true)}
                  className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Camera size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Form content */}
          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
  

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Edit2 size={18} />
                  Chỉnh sửa thông tin
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <User size={16} className="inline mr-2" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleOnChange}
                  disabled={!isEditing}
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 ${isEditing
                    ? 'border-green-200 bg-green-50 focus:border-green-500 focus:bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    } outline-none`}
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleOnChange}
                  disabled={!isEditing}
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 ${isEditing
                    ? 'border-green-200 bg-green-50 focus:border-green-500 focus:bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    } outline-none`}
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <Phone size={16} className="inline mr-2" />
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleOnChange}
                  disabled={!isEditing}
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 ${isEditing
                    ? 'border-green-200 bg-green-50 focus:border-green-500 focus:bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    } outline-none`}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              {isEditing && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đăng nhập cuối</span>
              <span className="text-sm text-gray-500">
                {lastLogin ? formatLastLogin(lastLogin) : 'Không rõ'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trạng thái</span>
              <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                <Check size={16} />
                Hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Popup avatar */}
      {openUserProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setUserProfileAvatarEdit(false)} />
      )}
    </div>
  )
}

export default Profile
