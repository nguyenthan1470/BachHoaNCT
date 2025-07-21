import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { FiExternalLink, FiX } from 'react-icons/fi';
import isAdmin from '../utils/isAdmin';
import { List, Package, Upload, ShoppingBag, Truck, BarChart, Users, MapPin, LogOut, Layers, Phone,Mail  } from 'lucide-react';

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  // Hàm kiểm tra xem mục có active không
  const isActive = (path) => location.pathname === path;

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
          <span className="text-red-600 font-semibold ml-1">{user.role === 'ADMIN' && '(Quản trị viên)'}</span>
        </span>
        <Link
          onClick={handleClose}
          to="/dashboard/profile"
          className={`text-blue-500 hover:text-blue-600 ${isActive('/dashboard/profile') ? 'text-blue-600' : ''}`}
          aria-current={isActive('/dashboard/profile') ? 'page' : undefined}
        >
          <FiExternalLink size={16} />
        </Link>
      </div>

      <Divider />

      {/* Menu Items */}
      <div className="grid gap-2 mt-2">
        {/* Admin Only */}
        {isAdmin(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/category"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/category') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Quản lý danh mục"
              aria-current={isActive('/dashboard/category') ? 'page' : undefined}
            >
              <List className="w-4 h-4" />
              <span>Danh mục</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/subcategory"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/subcategory') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Quản lý danh mục phụ"
              aria-current={isActive('/dashboard/subcategory') ? 'page' : undefined}
            >
              <Layers className="w-4 h-4" />
              <span>Danh mục phụ</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/upload-product"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/upload-product') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Tải lên sản phẩm"
              aria-current={isActive('/dashboard/upload-product') ? 'page' : undefined}
            >
              <Upload className="w-4 h-4" />
              <span>Tải lên sản phẩm</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/product"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/product') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Quản lý sản phẩm"
              aria-current={isActive('/dashboard/product') ? 'page' : undefined}
            >
              <Package className="w-4 h-4" />
              <span>Sản phẩm</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/manage-orders"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/manage-orders') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Quản lý đơn hàng"
              aria-current={isActive('/dashboard/manage-orders') ? 'page' : undefined}
            >
              <Truck className="w-4 h-4" />
              <span>Quản lý đơn hàng</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/sales-report"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/sales-report') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Báo cáo doanh số"
              aria-current={isActive('/dashboard/sales-report') ? 'page' : undefined}
            >
              <BarChart className="w-4 h-4" />
              <span>Báo cáo doanh số</span>
            </Link>

            <Link onClick={handleClose} to="/dashboard/staff-accounts"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/staff-accounts') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Quản lý tài khoản nhân viên" aria-current={isActive('/dashboard/staff-accounts') ? 'page' : undefined}
            >
              <Users className="w-4 h-4" />
              <span>Quản lí tài khoản nhân viên</span>
            </Link>

            <Link onClick={handleClose} to="/dashboard/feedback"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/feedback') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'
                }`}
              aria-label="Nhận phản hồi từ khách hàng" aria-current={isActive('/dashboard/feedback') ? 'page' : undefined}
            >
              <Mail className="w-4 h-4" />
              <span>Nhận phản hồi từ khách hàng</span>
            </Link>
          </>
        )}

        {/* Common User Links */}
        {/* Chỉ hiển thị với khách hàng, không phải admin */}
        {!isAdmin(user.role) && (
          <>

            <Link
              onClick={handleClose}
              to="/dashboard/myorders"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/myorders') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'}`}
              aria-label="Xem đơn hàng của tôi"
              aria-current={isActive('/dashboard/myorders') ? 'page' : undefined}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/address"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/dashboard/address') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'}`}
              aria-label="Quản lý địa chỉ"
              aria-current={isActive('/dashboard/address') ? 'page' : undefined}
            >
              <MapPin className="w-4 h-4" />
              <span>Lưu địa chỉ</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/contact"
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-gray-700 ${isActive('/contact') ? 'bg-green-100 border-l-4 border-green-600' : 'hover:bg-green-100'}`}
              aria-label="Quản lý địa chỉ"
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              <Phone className="w-4 h-4" />
              <span>Liên hệ </span>
            </Link>
          </>
        )}


        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-red-600 font-medium ${isActive('/logout') ? 'bg-red-100 border-l-4 border-red-600' : 'hover:bg-red-100'
            }`}
          aria-label="Đăng xuất"
          aria-current={isActive('/logout') ? 'page' : undefined}
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;