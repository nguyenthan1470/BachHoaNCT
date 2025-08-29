import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddAddress from '../components/AddAddress';
import { MdDelete, MdEdit, MdAdd, MdLocationOn, MdPhone, MdEmail, MdPerson, MdCheck } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success('Đã xóa địa chỉ');
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.setDefaultAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success('Đã đặt làm địa chỉ mặc định');
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const activeAddresses = addressList.filter(address => address.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col justify-between gap-4 bg-white p-4 rounded-lg md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">Quản lý địa chỉ</h1>
            <p className="text-sm text-gray-500 mt-1">{activeAddresses.length} địa chỉ đã lưu</p>
          </div>
          {/* <button
            onClick={() => setOpenAddress(true)}
            className="flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-500 transition-colors duration-200 md:text-base"
          >
            <MdAdd size={20} />
            Thêm địa chỉ mới
          </button> */}
        </div>
      </div>

      {/* Addresses Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeAddresses.map((address, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Address Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Địa chỉ #{index + 1}
                  </span>
                  {address.isDefault && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(address._id)}
                      className="p-1.5 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors duration-200"
                      aria-label="Đặt làm địa chỉ mặc định"
                      title="Đặt làm mặc định"
                    >
                      <MdCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(address);
                    }}
                    className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors duration-200"
                    aria-label="Chỉnh sửa địa chỉ"
                    title="Chỉnh sửa"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDisableAddress(address._id)}
                    className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200"
                    aria-label="Xóa địa chỉ"
                    title="Xóa"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MdPerson className="text-gray-400 text-base" />
                  <p className="text-sm font-medium text-gray-800">{address.fullname}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-gray-400 text-base" />
                  <p className="text-sm text-gray-600 truncate">{address.email}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MdLocationOn className="text-gray-400 text-base mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">{address.address_line}</p>
                    <p className="text-sm text-gray-500">
                      {address.district}, {address.city}, {address.state}, {address.country}
                    </p>
                    <p className="text-sm text-gray-500">Mã bưu điện: {address.pincode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MdPhone className="text-gray-400 text-base" />
                  <p className="text-sm text-gray-600">{address.mobile}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Address Card */}
          <div
            onClick={() => setOpenAddress(true)}
            className="flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-yellow-400 hover:bg-yellow-50 transition-colors duration-200 cursor-pointer"
          >
            <div className="text-center">
              <MdAdd className="mx-auto h-8 w-8 text-yellow-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">Thêm địa chỉ mới</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {activeAddresses.length === 0 && (
          <div className="text-center py-12">
            <MdLocationOn className="mx-auto h-12 w-12 text-yellow-400" />
            <h3 className="text-lg font-medium text-gray-800 mt-4">Chưa có địa chỉ nào</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Bạn chưa thêm địa chỉ nào. Hãy thêm địa chỉ đầu tiên để bắt đầu!
            </p>
            <button
              onClick={() => setOpenAddress(true)}
              className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-500 transition-colors duration-200"
            >
              <MdAdd size={20} />
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
    </div>
  );
};

export default Address;