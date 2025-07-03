import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong'
import Divider from '../components/Divider'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { ChevronLeft, ChevronRight,  Star,  StarHalf,  Shield,   Truck,   RotateCcw,   Award,  Package,   Timer,   TrendingUp,  Heart,   Share2, } from 'lucide-react'
import Chatbot from '../components/Chatbot'
  

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: [],
    price: 0,
    discount: 0,
    unit: "",
    stock: 0,
    description: "",
    more_details: {},
    rating: 0,
    reviews: 0,
    sold: 0
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        // Đảm bảo more_details là một object, nếu không thì gán giá trị mặc định
        const updatedData = {
          ...responseData.data,
          more_details: responseData.data.more_details || {}
        }
        setData(updatedData)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    
    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Trang chủ</span>
            <ChevronRight className="w-4 h-4" />
            <span>Trái cây</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{data.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
              <div className="aspect-square lg:h-[500px] flex items-center justify-center">
                <img
                  src={data.image[image]}
                  alt={data.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Discount Badge */}
              {data.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{data.discount}%
                </div>
              )}
            </div>

            {/* Image Indicators */}
            <div className="flex justify-center gap-2">
              {data.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === image ? 'bg-green-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail Gallery */}
            <div className="relative">
              <div 
                ref={imageContainer}
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {data.image.map((img, index) => (
                  <button
                    key={img + index}
                    onClick={() => setImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === image 
                        ? 'border-green-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Scroll Buttons */}
              <div className="hidden lg:flex absolute inset-y-0 -left-4 -right-4 items-center justify-between pointer-events-none">
                <button
                  onClick={handleScrollLeft}
                  className="pointer-events-auto p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="pointer-events-auto p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  10 Phút
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Best Seller
                </span>
              </div>
              
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900">{data.name}</h1>
              <p className="text-gray-600">{data.unit}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(data.rating)}
                </div>
                <span className="text-sm font-medium text-gray-900">{data.rating}</span>
                <span className="text-sm text-gray-600">({data.reviews} đánh giá)</span>
                <span className="text-sm text-gray-600">• {data.sold} đã bán</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Giá</h3>
              <div className="flex items-center gap-4">
                <div className=" border-2 border-green-500 rounded-xl px-4 py-3">
                  <span className="text-xl lg:text-2xl font-bold text-green-600">
                    {DisplayPriceInVietnamDong(pricewithDiscount(data.price, data.discount))}
                  </span>
                </div>
                {data.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {DisplayPriceInVietnamDong(data.price)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-bold">
                      Tiết kiệm {data.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock & Add to Cart */}
            {data.stock === 0 ? (
              <div className="text-center py-4">
                <p className="text-xl text-red-500 font-semibold">Hết hàng</p>
                <p className="text-sm text-gray-600 mt-1">Sản phẩm sẽ có hàng trở lại sớm</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="my-4">
                  <AddToCartButton data={data} />
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Giao hàng nhanh</p>
                  <p className="text-sm text-blue-700">Trong 10 phút</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Đảm bảo chất lượng</p>
                  <p className="text-sm text-green-700">100% organic</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">Đổi trả dễ dàng</p>
                  <p className="text-sm text-purple-700">Trong 24h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-yellow-900">Giá tốt nhất</p>
                  <p className="text-sm text-yellow-700">Cam kết giá</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'description', label: 'Mô tả sản phẩm', icon: Package },
                { id: 'specifications', label: 'Thông số kỹ thuật', icon: TrendingUp },
                { id: 'reviews', label: 'Đánh giá', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Mô tả sản phẩm</h3>
                <p className="text-gray-700 leading-relaxed">{data.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Khối lượng</h4>
                    <p className="text-gray-700">{data.unit}</p>
                  </div>
                  
                  {data.more_details && Object.entries(data.more_details).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="font-semibold text-gray-900 mb-2">{key}</h4>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Thông số kỹ thuật</h3>
                <div className="grid gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-600">Khối lượng:</span>
                    <span className="text-gray-900">{data.unit}</span>
                  </div>
                  {data.more_details && Object.entries(data.more_details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-medium text-gray-600">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Đánh giá khách hàng</h3>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    Viết đánh giá
                  </button>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{data.rating}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {renderStars(data.rating)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{data.reviews} đánh giá</div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-8">{star} ⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
     <Chatbot />

    </div>
  )
}

export default ProductDisplayPage