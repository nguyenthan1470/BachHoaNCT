import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import ConfirmBox from './ConfirmBox';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete } from 'react-icons/md';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchProductData();
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={data?.image[0]}
          alt={data?.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        {/* Overlay Actions - Hidden by default, shown on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
              aria-label="Cập nhật sản phẩm"
              title="Cập nhật"
            >
              <MdEdit size={16} className="text-green-600" />
            </button>
            <button
              onClick={() => setOpenDelete(true)}
              className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
              aria-label="Xóa sản phẩm"
              title="Xóa"
            >
              <MdDelete size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-800 line-clamp-2 text-sm mb-1 leading-tight">
          {data?.name}
        </h3>
        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
          {data?.unit}
        </p>

        {/* Action Buttons for Mobile */}
        <div className="flex gap-2 mt-3 md:hidden">
          <button
            onClick={() => setEditOpen(true)}
            className="flex-1 p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors duration-200 text-xs font-medium"
            aria-label="Cập nhật sản phẩm"
          >
            Cập nhật
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="flex-1 p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200 text-xs font-medium"
            aria-label="Xóa sản phẩm"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Xác nhận xóa</h3>
              <button
                onClick={() => setOpenDelete(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Đóng"
              >
                <IoClose size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <span className="font-medium text-gray-800">"{data?.name}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCardAdmin;