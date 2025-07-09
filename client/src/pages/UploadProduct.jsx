 import React, { useState } from 'react';
import { Upload, X, Plus, Package, ImagePlus, Trash2, Tag, DollarSign, FileText, Save } from 'lucide-react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import UploadImage from '../utils/UploadImage.js';
import Loading from '../components/Loading.jsx';
import ViewImage from '../components/ViewImage.jsx';
import AddFieldComponent from '../components/AddFieldComponent.jsx';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.jsx';
import AxiosToastError from '../utils/AxiosToastError.js';
import successAlert from '../utils/SuccessAlert.js';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: '',
    image: [],
    category: [],
    subCategory: [],
    unit: '',
    stock: '',
    price: '',
    discount: '',
    description: '',
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState('');
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const filteredSubCategories = allSubCategory.filter((sub) =>
    sub.category.some((cat) => data.category.map((c) => c._id).includes(cat._id || cat))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await UploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;
    setData((prev) => ({
      ...prev,
      image: [...prev.image, imageUrl],
    }));
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((prev) => ({ ...prev }));
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((prev) => ({ ...prev }));
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((prev) => ({ ...prev }));
  };

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: '',
      },
    }));
    setFieldName('');
    setOpenAddField(false);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await Axios({
      ...SummaryApi.createProduct,
      data: data,
    });
    const { data: responseData } = response;
    if (responseData.success) {
      successAlert(responseData.message);
      setData({
        name: '',
        image: [],
        category: [],
        subCategory: [],
        unit: '',
        stock: '',
        price: '',
        discount: '',
        description: '',
        more_details: {},
      });
    }
  } catch (error) {
    AxiosToastError(error);
  }
};

  const steps = [
    { number: 1, title: 'Thông tin cơ bản', icon: Package },
    { number: 2, title: 'Hình ảnh', icon: ImagePlus },
    { number: 3, title: 'Phân loại', icon: Tag },
    { number: 4, title: 'Giá & Kho', icon: DollarSign },
  ];

  // const StepIndicator = ({ step, isActive, isCompleted }) => {
  //   const IconComponent = step.icon;
  //   return (
  //     <div className={`flex items-center ${step.number !== 4 ? 'flex-1' : ''}`}>
  //       <div
  //         className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
  //           isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
  //         }`}
  //       >
  //         <IconComponent size={20} />
  //       </div>
  //       <div className="ml-3">
  //         <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
  //           Bước {step.number}
  //         </p>
  //         <p className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
  //           {step.title}
  //         </p>
  //       </div>
  //       {step.number !== 4 && (
  //         <div className={`flex-1 h-0.5 ml-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tải lên sản phẩm mới</h1>
              <p className="text-gray-600">Thêm sản phẩm vào cửa hàng của bạn</p>
            </div>
            
          </div>

          {/* Progress Steps */}
          {/* <div className="flex items-center justify-between">
            {steps.map((step) => (
              <StepIndicator
                key={step.number}
                step={step}
                isActive={currentStep === step.number}
                isCompleted={currentStep > step.number}
              />
            ))}
          </div> */}
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Nhập tên sản phẩm"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả sản phẩm
                      </label>
                      <textarea
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả chi tiết sản phẩm..."
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Tag size={20} />
                    Phân loại sản phẩm
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục
                      </label>
                      <select
                        value={selectCategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          const category = allCategory.find((el) => el._id === value);
                          if (category) {
                            setData((prev) => ({
                              ...prev,
                              category: [...prev.category, category],
                            }));
                            setSelectCategory('');
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Chọn danh mục</option>
                        {allCategory.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {data.category.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {data.category.map((c, index) => (
                            <span
                              key={c._id + index}
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {c.name}
                              <button
                                onClick={() => handleRemoveCategory(index)}
                                className="hover:bg-blue-200 rounded-full p-1"
                              >
                                <IoClose size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục phụ
                      </label>
                      <select
                        value={selectSubCategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          const subCategory = allSubCategory.find((el) => el._id === value);
                          if (subCategory) {
                            setData((prev) => ({
                              ...prev,
                              subCategory: [...prev.subCategory, subCategory],
                            }));
                            setSelectSubCategory('');
                          }
                        }}
                        disabled={data.category.length === 0}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                      >
                        <option value="">Chọn danh mục phụ</option>
                        {filteredSubCategories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {data.subCategory.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {data.subCategory.map((c, index) => (
                            <span
                              key={c._id + index}
                              className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                            >
                              {c.name}
                              <button
                                onClick={() => handleRemoveSubCategory(index)}
                                className="hover:bg-purple-200 rounded-full p-1"
                              >
                                <IoClose size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign size={20} />
                    Giá & Kho hàng
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đơn vị
                      </label>
                      <input
                        type="text"
                        name="unit"
                        value={data.unit}
                        onChange={handleChange}
                        placeholder="VD: Cái, Kg, Hộp"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng tồn kho
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={data.stock}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá bán (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giảm giá (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={data.discount}
                        onChange={handleChange}
                        placeholder="0"
                        max="100"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Thông tin bổ sung
                  </h3>
                  <div className="space-y-4">
                    {Object.keys(data.more_details).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={data.more_details[key]}
                          onChange={(e) => {
                            const value = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              more_details: {
                                ...prev.more_details,
                                [key]: value,
                              },
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setOpenAddField(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus size={16} />
                      Thêm thông tin mới
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload and Quick Stats */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImagePlus size={20} />
                    Hình ảnh sản phẩm
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                      {imageLoading ? (
                        <div className="flex items-center justify-center">
                          <Loading />
                          <span className="ml-2 text-gray-600">Đang tải...</span>
                        </div>
                      ) : (
                        <div className="text-gray-600">
                          <FaCloudUploadAlt size={48} className="mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium">Tải lên hình ảnh</p>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {data.image.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Hình ảnh đã tải ({data.image.length})
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {data.image.map((img, index) => (
                          <div key={img + index} className="relative group">
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => setViewImageUrl(img)}
                            />
                            <button
                              onClick={() => handleDeleteImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <MdDelete size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{data.image.length}</div>
                      <div className="text-sm opacity-80">Hình ảnh</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{data.category.length}</div>
                      <div className="text-sm opacity-80">Danh mục</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{data.subCategory.length}</div>
                      <div className="text-sm opacity-80">Danh mục phụ</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{Object.keys(data.more_details).length}</div>
                      <div className="text-sm opacity-80">Thông tin thêm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Tải lên sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ViewImage
            url={viewImageUrl}
            close={() => setViewImageUrl('')}
            className="bg-white rounded-2xl max-w-4xl max-h-full overflow-hidden"
          />
        </div>
      )}

      {/* Add Field Modal */}
      {openAddField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Thêm thông tin mới</h3>
              <button
                onClick={() => setOpenAddField(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên thông tin
              </label>
              <input
                type="text"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="VD: Kích thước, Màu sắc, Chất liệu..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setOpenAddField(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAddField}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProduct;