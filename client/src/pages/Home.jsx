import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Link, useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import { ShoppingBag, Star, TrendingUp, Zap, Gift, Truck, Shield, Leaf, Heart, Award, RefreshCw } from 'lucide-react';
import bgBanner from '../assets/banner001.webp';
import Chatbot from '../components/Chatbot'
import RecommendedProducts from '../components/RecommendedProducts';
import { FaStar } from 'react-icons/fa6';

const Home = () => {

  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const SubCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()


  const handleRedirectProductListPage = (id, cat) => {
    console.log(id, cat)
    const subcategory = SubCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })
      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
    console.log(url)
  }

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease-in-out';
        el.style.opacity = '1';
      }, index * 200);
    });
  }, []);
  return (
    <section className='bg-white'>


      <div className="container mx-auto pt-8 px-4 ">
        <div
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center p-8 lg:p-12 min-h-96 mb-8"
          style={{ backgroundImage: `url(${bgBanner})` }}
        >
          {/* Màng tối phủ lên hình nền */}
          <div className="absolute inset-0 bg-black/20 z-0"></div>

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-lime-400/30 to-green-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-lime-300/20 to-green-300/20 rounded-full blur-2xl animate-bounce animation-delay-2000"></div>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-10 right-10 text-lime-300/30 text-8xl animate-float">🌿</div>
          <div className="absolute bottom-10 left-10 text-green-300/30 text-6xl animate-float animation-delay-1000">🍃</div>
          <div className="absolute top-20 left-1/4 text-lime-200/20 text-5xl animate-float animation-delay-2000">🌱</div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full">
            {/* Text Content */}
            <div className="text-center lg:text-left lg:w-3/5 mb-8 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="bg-gradient-to-r from-lime-400 to-green-400 rounded-full px-4 py-2 flex items-center shadow-lg">
                  <span className="text-green-800 font-bold text-sm tracking-wider uppercase">Giảm Giá Sốc - Chọn Lựa Vô Tận!</span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="block text-yellow-300">Bách Hóa</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-500 via-green-400 to-emerald-400 animate-gradient">
                  NCT
                </span>
              </h1>

              <p className="text-xl text-green-100 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Mua Nhiều, Tiết Kiệm Nhiều - Chỉ Có Tại Bách Hóa NCT!
                <br />
                <span className="text-3xl font-bold text-lime-300 animate-bounce">GIẢM 40%</span>
                <br />
                <span className="text-lg text-lime-200">Mua Ngay Hôm Nay!</span>
              </p>

              {/* Enhanced Stats */}
              <div className="flex justify-center lg:justify-start gap-8 mb-8">
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-lime-300/20">
                    <div className="text-3xl font-bold text-white">8K+</div>
                    <div className="text-sm text-lime-200 flex items-center justify-center">
                      <Leaf className="w-3 h-3 mr-1" />
                      Sản phẩm
                    </div>
                  </div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-lime-300/20">
                    <div className="text-3xl font-bold text-white">48K+</div>
                    <div className="text-sm text-lime-200 flex items-center justify-center">
                      <Heart className="w-3 h-3 mr-1" />
                      Gia đình
                    </div>
                  </div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-lime-300/20">
                    <div className="text-3xl font-bold text-white">4.8</div>
                    <div className="text-sm text-lime-200 flex items-center justify-center">
                      <Star className="w-3 h-3 text-lime-300 mr-1" fill="currentColor" />
                      Đánh giá
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group relative bg-gradient-to-r from-lime-500 via-green-500 to-green-600 hover:from-lime-600 hover:via-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Link to={"/cart"} className="relative flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    MUA NGAY
                  </Link>
                </button>


              </div>
            </div>

            {/* Enhanced Visual Elements */}
            <div className="lg:w-2/5 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main promotional circle */}
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-2 border-lime-300/30 flex items-center justify-center shadow-2xl">
                  <div className="w-60 h-60 rounded-full bg-gradient-to-br from-lime-400/30 to-green-400/30 backdrop-blur-sm border border-lime-300/40 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl font-black text-white mb-2 animate-pulse">40%</div>
                      <div className="text-xl text-lime-100 font-bold tracking-wider">GIẢM GIÁ</div>
                      <div className="text-sm text-green-200 mt-2">Ưu Đãi Rực Rỡ </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce rotate-12">
                  <Leaf className="w-10 h-10 text-white" />
                </div>

                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse -rotate-12">
                  <Gift className="w-8 h-8 text-white" />
                </div>

                <div className="absolute top-8 -left-8 w-16 h-16 bg-gradient-to-br from-lime-300 to-green-400 rounded-full flex items-center justify-center shadow-xl animate-ping">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fast Delivery Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-full p-3 mr-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-800">Giao hàng nhanh</h3>
            </div>
            <p className="text-blue-600">Giao hàng trong 2 giờ, đảm bảo về thời gian và chất lượng sản phẩm</p>
          </div>

          {/* Safety Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-800">An toàn tuyệt đối</h3>
            </div>
            <p className="text-green-600">Giao dịch an toàn, thanh toán tiện lợi, sản phẩm chất lượng</p>
          </div>

          {/* Return Policy Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 mr-4 relative overflow-hidden animate-pulse-slow">
                <RefreshCw className="w-6 h-6 text-white relative z-10" />
                <Shield className="w-4 h-4 text-white absolute -top-1 -right-1 opacity-50" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800 transition-colors group-hover:text-amber-600">
                  Cam kết đổi trả
                </h3>
              </div>
            </div>
            <p className="text-amber-600 mt-2 leading-relaxed">
              Đổi trả trong 7 ngày với quy trình nhanh chóng, miễn phí vận chuyển đổi trả.
            </p>
          </div>
        </div>
      </div>
      {/* phân hiển thị danh mục sản phẩm */}
      <div className="container mx-auto px-4 ">
        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl"></div>

          {/* Nội dung tiêu đề */}
          <div className="relative p-8 text-center">

            <div className="flex items-center justify-center mb-3">
              <div className="bg-green-100 p-2 rounded-full mr-3 animate-pulse">

              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Danh mục sản phẩm
              </h2>
              <div className="bg-green-100 p-2 rounded-full ml-3 animate-pulse">

              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto animate-pulse-jump"></div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 my-2'>
        {/* Hiển thị sub-category cho mobile dạng scroll ngang */}
        <div className="lg:hidden mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="inline-flex gap-3">
            {SubCategoryData.map((sub) => (
              <div
                key={sub._id}
                className="flex-shrink-0 bg-green-100 text-green-800 font-medium text-sm px-4 py-2 rounded-full shadow cursor-pointer hover:bg-green-200 hover:shadow-neon transition-all duration-300"
                onClick={() => {
                  const parentCat = sub.category[0];
                  const url = `/${valideURLConvert(parentCat.name)}-${parentCat._id}/${valideURLConvert(sub.name)}-${sub._id}`;
                  navigate(url);
                }}
              >
                {sub.name}
              </div>
            ))}
          </div>
        </div>

        {/* Hiển thị danh mục chính dạng lưới */}
        <div className='category-grid grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100'>
          {loadingCategory ? (
            new Array(12).fill(null).map((_, index) => (
              <div
                key={index + "loadingcategory"}
                className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'
              >
                <div className='bg-blue-100 min-h-20 rounded'></div>
                <div className='bg-blue-100 h-8 rounded'></div>
              </div>
            ))
          ) : (
            categoryData.map((cat, index) => (
              <div
                key={cat._id + "displayCategory"}
                className={`category-item w-full h-full cursor-pointer group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-neon hover:scale-105 hover:bg-green-50/80`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleRedirectProductListPage(cat._id, cat.name)}
              >
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className='w-full h-full object-scale-down transition-transform duration-300 group-hover:scale-110'
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className='text-sm mt-1 text-gray-700 truncate text-center font-semibold group-hover:text-green-600 group-hover:text-shadow'>
                  {cat.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-12 fade-in">
        <RecommendedProducts />
      </div>


      {/* Hiển thị sản phẩm theo từng danh mục */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-400 mr-3"></div>
          <span className="text-gray-800 font-semibold text-3xl">Khám phá thêm</span>
          <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-400 ml-3"></div>
        </div>
      </div>
      {
        categoryData.map((c) => (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        ))
      }
     
        <Chatbot />
      




    </section>
  )
}

export default Home