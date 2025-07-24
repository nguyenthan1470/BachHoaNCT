import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import { createColumnHelper } from '@tanstack/react-table';
import { HiPencil, HiPlus, HiEye, HiTrash } from 'react-icons/hi2';
import { IoSearch, IoFilter, IoGridOutline, IoListOutline } from 'react-icons/io5';
import { BiRefresh } from 'react-icons/bi';
import toast from 'react-hot-toast';
import UploadSubCategoryModel from '../components/UploadSubCategoryModel';
import EditSubCategory from '../components/EditSubCategory';
import ConfirmBox from '../components/ConfirmBox';
import ViewImage from '../components/ViewImage';

// Modern Table Component
const ModernTable = ({
  data,
  columns,
  loading,
  viewMode,
  onViewImage,
  onEdit,
  onDelete,
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <div
            key={item._id || index}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={item.image || '/api/placeholder/200/200'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.category?.slice(0, 2).map((cat) => (
                  <span
                    key={cat._id}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    {cat.name}
                  </span>
                ))}
                {item.category?.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.category.length - 2}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewImage(item.image)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                  >
                    <HiEye className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                  >
                    <HiPencil className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                  </button>
                </div>
                <button
                  onClick={() => onDelete(item)}
                  className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <HiTrash className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="text-left py-4 px-6 font-semibold text-gray-700 text-sm"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              data.map((row, index) => (
                <tr key={row._id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="py-4 px-6 text-sm text-gray-800">
                      {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [ImageURL, setImageURL] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: '' });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: '' });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [sortOrder, setSortOrder] = useState('none'); // Sorting state: 'none', 'asc', 'desc'
  const columnHelper = createColumnHelper();

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
        setFilteredData(responseData.data);
        toast.success('Dữ liệu danh mục phụ đã được tải.');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  useEffect(() => {
    let sortedData = [...data];

    // Apply search filter
    sortedData = sortedData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.some((cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Apply sorting
    if (sortOrder === 'asc') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      sortedData.sort((a, b) => b.name.localeCompare(b.name));
    }

    setFilteredData(sortedData);
  }, [searchQuery, data, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prev) => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Tên sản phẩm',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image || '/api/placeholder/40/40'}
            alt={row.original.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Danh mục',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.category.slice(0, 3).map((c) => (
            <span
              key={c._id}
              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {c.name}
            </span>
          ))}
          {row.original.category.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{row.original.category.length - 3}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('_id', {
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setImageURL(row.original.image)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
          >
            <HiEye className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
          </button>
          <button
            onClick={() => {
              setOpenEdit(true);
              setEditData(row.original);
            }}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
          >
            <HiPencil className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true);
              setDeleteSubCategory(row.original);
            }}
            className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
          >
            <HiTrash className="w-4 h-4 text-red-500 group-hover:text-red-600" />
          </button>
        </div>
      ),
    }),
  ];

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: '' });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Danh mục phụ</h1>
              <p className="text-gray-600 text-sm mt-1">
                Quản lý các danh mục phụ của sản phẩm
              </p>
            </div>
            <button
              onClick={() => setOpenAddSubCategory(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <HiPlus className="w-5 h-5" />
              Thêm danh mục phụ
            </button>

          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={fetchSubCategory}
                disabled={loading}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <BiRefresh
                  className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`}
                />
              </button>

              {/* Filter Button */}
              <button
                onClick={handleSortToggle}
                className={`p-2 border border-gray-200 rounded-xl transition-colors ${sortOrder !== 'none' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-50'
                  }`}
                title={sortOrder === 'asc' ? 'Sắp xếp Z-A' : sortOrder === 'desc' ? 'Không sắp xếp' : 'Sắp xếp A-Z'}
              >
                <IoFilter className="w-5 h-5 text-gray-600" />
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'
                    }`}
                >
                  <IoListOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'
                    }`}
                >
                  <IoGridOutline className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredData.length} trên {data.length} danh mục phụ
            </div>
            <div className="text-sm text-green-600">
              {searchQuery && `Tìm thấy ${filteredData.length} kết quả cho "${searchQuery}"`}
              {sortOrder !== 'none' && (
                <span className="ml-2">
                  (Sắp xếp: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <ModernTable
            data={filteredData}
            columns={columns}
            loading={loading}
            viewMode={viewMode}
            onViewImage={(url) => setImageURL(url)}
            onEdit={(item) => {
              setOpenEdit(true);
              setEditData(item);
            }}
            onDelete={(item) => {
              setOpenDeleteConfirmBox(true);
              setDeleteSubCategory(item);
            }}
          />

          {!loading && filteredData.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có danh mục phụ nào'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `Không tìm thấy danh mục phụ nào phù hợp với "${searchQuery}"`
                  : 'Hãy thêm danh mục phụ đầu tiên của bạn'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setOpenAddSubCategory(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  <HiPlus className="w-5 h-5" />
                  Thêm danh mục phụ
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {openAddSubCategory && (
          <UploadSubCategoryModel
            close={() => setOpenAddSubCategory(false)}
            fetchData={fetchSubCategory}
          />
        )}
        {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL('')} />}
        {openEdit && (
          <EditSubCategory
            data={editData}
            close={() => setOpenEdit(false)}
            fetchData={fetchSubCategory}
          />
        )}
        {openDeleteConfirmBox && (
          <ConfirmBox
            cancel={() => setOpenDeleteConfirmBox(false)}
            close={() => setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteSubCategory}
          />
        )}
      </div>
    </div>
  );
};

export default SubCategoryPage;