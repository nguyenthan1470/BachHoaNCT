import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong';
import Divider from '../components/Divider';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';
import { ChevronLeft, ChevronRight, Star, StarHalf, Shield, Truck, RotateCcw, Award, Package, Timer, TrendingUp, Heart, Share2 } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split('-')?.slice(-1)[0];
  const [data, setData] = useState({
    name: '',
    image: [],
    price: 0,
    discount: 0,
    unit: '',
    stock: 0,
    description: '',
    more_details: {},
    sold: 0,
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewList, setReviewList] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false); // State for Heart button
  const imageContainer = useRef();
  const user = useSelector((state) => state?.user);

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        const updatedData = {
          ...responseData.data,
          more_details: responseData.data.more_details || {},
        };
        setData(updatedData);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getReviews,
        data: { productId: productId },
      });
      if (res.data.success) {
        setReviewList(res.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.addReview,
        data: {
          productId: productId,
          rating: userRating,
          comment,
        },
      });
      toast.success('Đánh giá của bạn đã được gửi!');
      setUserRating(0);
      setComment('');
      fetchProductDetails();
      fetchReviews();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // New function to handle like/unlike
  const handleLikeToggle = async () => {
    if (!user?.email) {
      toast.error('Vui lòng đăng nhập để thích sản phẩm!');
      return;
    }
    try {
      const res = await Axios({
        ...SummaryApi.toggleLike, // Assuming an API endpoint for toggling likes
        data: {
          productId: productId,
          userId: user._id,
        },
      });
      if (res.data.success) {
        setIsLiked(!isLiked);
        toast.success(isLiked ? 'Đã bỏ thích sản phẩm!' : 'Đã thích sản phẩm!');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // New function to handle sharing
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Đã sao chép liên kết sản phẩm!');
      })
      .catch(() => {
        toast.error('Không thể sao chép liên kết!');
      });
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    // Optionally fetch like status for the user
    const fetchLikeStatus = async () => {
      if (user?.email) {
        try {
          const res = await Axios({
            ...SummaryApi.getLikeStatus, // Assuming an API endpoint to check like status
            data: {
              productId: productId,
              userId: user._id,
            },
          });
          if (res.data.success) {
            setIsLiked(res.data.isLiked);
          }
        } catch (error) {
          AxiosToastError(error);
        }
      }
    };
    fetchLikeStatus();
  }, [params, user]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const averageRating = () => {
    if (reviewList.length === 0) return 0;
    const total = reviewList.reduce((sum, r) => sum + r.rating, 0);
    return total / reviewList.length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mt-7 sm:mt-1">
            <span>Trang chủ</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{data.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
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
                {/* Nút Like */}
                <button
                  onClick={handleLikeToggle}
                  className={`group p-2 rounded-full bg-white/80 transition-all duration-300 hover:bg-red-50 hover:shadow-md ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                  <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded  text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLiked ? 'Bỏ thích' : 'Thích sản phẩm'}
                  </span>
                </button>

                {/* Nút Share */}
                <button
                  onClick={handleShare}
                  className="group relative p-2 rounded-full bg-white/80 hover:bg-blue-50 hover:shadow-md transition-all duration-300"
                >
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded  text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Chia sẻ sản phẩm
                  </span>
                </button>
              </div>

              {data.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{data.discount}%
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2">
              {data.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === image ? 'bg-green-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>

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
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === image ? 'border-green-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

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

          <div className="space-y-6">
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

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">{renderStars(averageRating())}</div>
              <span className="text-sm font-medium text-gray-900">{averageRating().toFixed(1)}</span>
              <span className="text-sm text-gray-600">({reviewList.length} đánh giá)</span>
              <span className="text-sm text-gray-600">• {data.sold} đã bán</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Giá</h3>
              <div className="flex items-center gap-4">
                <div className="border-2 border-green-500 rounded-xl px-4 py-3">
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

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${data.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : data.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                  {data.stock > 0 ? `Còn ${data.stock} sản phẩm` : 'Tạm hết hàng'}
                </span>
                {data.stock > 0 && data.stock <= 10 && (
                  <span className="text-sm text-orange-600">Sắp hết hàng</span>
                )}
              </div>

              {data.stock > 0 ? (
                <div className="flex gap-3">
                  <div className="my-4">
                    <AddToCartButton data={data} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xl text-red-500 font-semibold">Hết hàng</p>
                  <p className="text-sm text-gray-600 mt-1">Sản phẩm sẽ có hàng trở lại sớm</p>
                </div>
              )}
            </div>

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

        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'description', label: 'Mô tả sản phẩm', icon: Package },
                { id: 'specifications', label: 'Thông số kỹ thuật', icon: TrendingUp },
                { id: 'reviews', label: 'Đánh giá', icon: Star },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${activeTab === tab.id
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

                  {data.more_details &&
                    Object.entries(data.more_details).map(([key, value]) => (
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
                  {data.more_details &&
                    Object.entries(data.more_details).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="font-medium text-gray-600">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Tất cả đánh giá</h3>

                {reviewList.length === 0 && <p className="text-gray-600">Chưa có đánh giá nào.</p>}

                {reviewList.map((review) => (
                  <div key={review._id} className="border p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={review.user?.avatar}
                        alt={review.user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-semibold">{review.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}

                {user?.email && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold">Gửi đánh giá</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setUserRating(star)}>
                          <Star
                            className={`w-6 h-6 ${userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows="3"
                      className="w-full border rounded-md p-2"
                      placeholder="Viết đánh giá..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      onClick={handleSubmitReview}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default ProductDisplayPage;