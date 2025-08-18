import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import { IoSearchOutline, IoGridOutline, IoListOutline, IoAdd } from 'react-icons/io5';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import ProductCardAdmin from '../components/ProductCartAdmin';
import EditProductAdmin from '../components/EditProductAdmin';

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      if (response.data.success) {
        setTotalPageCount(response.data.totalNoPage);
        setProductData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Title and Stats */}
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-600 text-base">
                {productData.length} sản phẩm • Trang {page} / {totalPageCount}
              </p>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="block w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                  value={search}
                  onChange={handleOnChange}
                  aria-label="Tìm kiếm sản phẩm"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  aria-label="Chế độ lưới"
                  title="Chế độ lưới"
                >
                  <IoGridOutline size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  aria-label="Chế độ danh sách"
                  title="Chế độ danh sách"
                >
                  <IoListOutline size={20} />
                </button>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => {
                  /* Replace with actual add product modal logic */
                  alert('Chức năng thêm sản phẩm chưa được triển khai');
                }}
                className="flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors duration-200"
                aria-label="Thêm sản phẩm mới"
              >
                <IoAdd size={20} />
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          {/* Products Grid */}
          <div className="min-h-[60vh] mb-8">
            {productData.length > 0 ? (
              <div className={`${getGridClasses()} gap-4 md:gap-6`}>
                {productData.map((product, index) => (
                  <ProductCardAdmin
                    key={product._id || index}
                    data={product}
                    fetchProductData={fetchProductData}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <IoAdd className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {search ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {search
                    ? `Không có sản phẩm nào phù hợp với từ khóa "${search}"`
                    : 'Hãy thêm sản phẩm đầu tiên để bắt đầu quản lý.'}
                </p>
                <button
                  onClick={() => {
                    /* Replace with actual add product modal logic */
                    alert('Chức năng thêm sản phẩm chưa được triển khai');
                  }}
                  className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors duration-200"
                  aria-label="Thêm sản phẩm đầu tiên"
                >
                  <IoAdd size={20} />
                  Thêm sản phẩm đầu tiên
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {productData.length > 0 && totalPageCount > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  page === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
                }`}
                aria-label="Trang trước"
              >
                <MdKeyboardArrowLeft size={20} />
                Trước
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPageCount)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === page;

                  // Show only current page and 2 pages around it
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPageCount ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          isCurrentPage
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-green-50'
                        }`}
                        aria-label={`Trang ${pageNumber}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                    return (
                      <span key={pageNumber} className="text-gray-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={page === totalPageCount}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  page === totalPageCount
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
                }`}
                aria-label="Trang tiếp theo"
              >
                Tiếp
                <MdKeyboardArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;