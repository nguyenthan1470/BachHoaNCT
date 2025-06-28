import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';

const StaffAccounts = () => {
  const [staffList, setStaffList] = useState([]);
  const [modalData, setModalData] = useState({ name: '', email: '', password: '', role: 'ADMIN' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await Axios(SummaryApi.getAllStaff);
      if (res.data.success) {
        setStaffList(res.data.data);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách nhân viên");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá nhân viên này?")) return;
    try {
      await Axios({ ...SummaryApi.deleteStaff(id) });
      toast.success("Đã xoá");
      fetchStaff();
    } catch {
      toast.error("Xoá thất bại");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!modalData.name || !modalData.email || (!isEditing && !modalData.password)) {
        return toast.error("Vui lòng điền đầy đủ thông tin");
      }

      if (isEditing) {
        await Axios({
          ...SummaryApi.updateStaff(modalData._id),
          data: modalData
        });
        toast.success("Cập nhật thành công");
      } else {
        await Axios({
          ...SummaryApi.addStaff,
          data: modalData
        });
        toast.success("Thêm thành công");
      }

      fetchStaff();
      setShowModal(false);
      setModalData({ name: '', email: '', password: '', role: 'ADMIN' });
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tài khoản nhân viên</h1>
          <p className="text-gray-500">Danh sách nhân viên và phân quyền quản lý</p>
        </div>
        <button onClick={() => { setShowModal(true); setIsEditing(false); }} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition">
          <UserPlus className="w-5 h-5 mr-2" /> Thêm nhân viên
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">Họ tên</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Quyền</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{staff.name}</td>
                <td className="px-4 py-3">{staff.email}</td>
                <td className="px-4 py-3">{staff.role}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setModalData(staff);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(staff._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">{isEditing ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}</h2>
            <input
              type="text"
              className="border w-full p-2 rounded"
              placeholder="Họ tên"
              value={modalData.name}
              onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
            />
            <input
              type="email"
              className="border w-full p-2 rounded"
              placeholder="Email"
              value={modalData.email}
              onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
            />
            {!isEditing && (
              <input
                type="password"
                className="border w-full p-2 rounded"
                placeholder="Mật khẩu"
                value={modalData.password}
                onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
              />
            )}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={handleSubmit}
            >
              {isEditing ? 'Lưu thay đổi' : 'Tạo nhân viên'}
            </button>
            <button className="w-full text-gray-500 hover:text-black" onClick={() => setShowModal(false)}>
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAccounts;
