import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddAddress from '../components/AddAddress';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id }
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

  return (
    <div className='p-2 md:p-4'>
      <div className='bg-white shadow px-2 py-2 flex justify-between items-center'>
        <h2 className='font-semibold text-lg md:text-xl'>Địa chỉ</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className='border border-primary-200 text-primary-200 px-2 md:px-3 text-sm md:text-base hover:bg-primary-200 hover:text-black py-1 rounded-full'
        >
          Thêm địa chỉ
        </button>
      </div>

      <div className='bg-blue-50 p-2 grid gap-3 md:gap-4'>
        {addressList.map((address, index) => (
          <div
            key={index}
            className={`border rounded p-3 flex flex-col md:flex-row md:gap-3 bg-white ${!address.status && 'hidden'}`}
          >
            <div className='text-sm md:text-base leading-relaxed w-full'>
              <p><span className='font-semibold'>Họ tên: </span>{address.fullname}</p>
              <p><span className='font-semibold'>Email: </span>{address.email}</p>
              <p><span className='font-semibold'>Địa chỉ cụ thể: </span>{address.address_line}, {address.state}, {address.district}, {address.city}, {address.country}</p>
              <p><span className='font-semibold'>Mã bưu điện: </span>{address.pincode}</p>
              <p><span className='font-semibold'>Số điện thoại: </span>{address.mobile}</p>
            </div>
            <div className='flex md:flex-col justify-end gap-4 mt-2 md:mt-0'>
              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(address);
                }}
                className='bg-green-200 p-2 rounded hover:text-white hover:bg-green-600'
              >
                <MdEdit size={18} />
              </button>
              <button
                onClick={() => handleDisableAddress(address._id)}
                className='bg-red-200 p-2 rounded hover:text-white hover:bg-red-600'
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => setOpenAddress(true)}
          className='h-14 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer text-sm md:text-base'
        >
          Thêm địa chỉ
        </div>
      </div>

      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}
      {OpenEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default Address;
