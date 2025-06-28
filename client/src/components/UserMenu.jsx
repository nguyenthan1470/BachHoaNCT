import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FiExternalLink, FiX } from "react-icons/fi"
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response.data.success) {
        if (close) close()
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) close()
  }

  return (
    <div className="w-full sm:w-72 bg-white shadow-lg rounded-lg p-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-gray-800">Tài khoản của tôi</div>
        <button onClick={handleClose} className="sm:hidden text-gray-500 hover:text-red-500 transition">
          <FiX size={20} />
        </button>
      </div>

      {/* User Info */}
      <div className="flex items-center justify-between mb-2">
        <span className="max-w-[12rem] truncate font-medium text-gray-700">
          {user.name || user.mobile}
          <span className="text-red-600 font-semibold ml-1">{user.role === "ADMIN" && "(Quản trị viên)"}</span>
        </span>
        <Link onClick={handleClose} to={'/dashboard/profile'} className="text-blue-500 hover:text-blue-600">
          <FiExternalLink size={16} />
        </Link>
      </div>

      <Divider />

      {/* Menu Items */}
      <div className="grid gap-2 mt-2">

        {/* Admin Only */}
        {isAdmin(user.role) && (
          <>
            <Link onClick={handleClose} to="/dashboard/category" className="block px-3 py-2 rounded hover:bg-green-100">
              Danh mục
            </Link>
            <Link onClick={handleClose} to="/dashboard/subcategory" className="block px-3 py-2 rounded hover:bg-green-100">
              Danh mục phụ
            </Link>
            <Link onClick={handleClose} to="/dashboard/upload-product" className="block px-3 py-2 rounded hover:bg-green-100">
              Tải lên sản phẩm
            </Link>
            <Link onClick={handleClose} to="/dashboard/product" className="block px-3 py-2 rounded hover:bg-green-100">
              Sản phẩm
            </Link>
            {/* Quản lý đơn hàng */}
            <Link onClick={handleClose} to="/dashboard/manage-orders" className="block px-3 py-2 rounded hover:bg-green-100">
              Quản lý đơn hàng
            </Link>
            
            <Link onClick={handleClose} to="/dashboard/sales-report" className="block px-3 py-2 rounded hover:bg-green-100">
              Báo cáo doanh số
            </Link>

            {/* Quản lý người dùng */}
            <Link onClick={handleClose} to="/dashboard/customer-accounts" className="block px-3 py-2 rounded hover:bg-green-100">
              Tài khoản khách hàng
            </Link>
              
            <Link onClick={handleClose} to="/dashboard/staff-accounts" className="block px-3 py-2 rounded hover:bg-green-100">
              Tài khoản nhân viên
            </Link>

           
          </>
        )}

        {/* Common User Links */}
        <Link onClick={handleClose} to="/dashboard/myorders" className="block px-3 py-2 rounded hover:bg-green-100">
          Đơn hàng của tôi
        </Link>
        <Link onClick={handleClose} to="/dashboard/address" className="block px-3 py-2 rounded hover:bg-green-100">
          Lưu địa chỉ
        </Link>

        <button
          onClick={handleLogout}
          className="text-left px-3 py-2 rounded hover:bg-red-100 text-red-600 font-medium transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

export default UserMenu
