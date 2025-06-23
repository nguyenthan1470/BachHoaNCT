import React from 'react';
import banner from '../assets/banner1.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert'; 
import { Link, useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import { ShoppingBag, Star, TrendingUp, Zap, Gift, Truck, Shield } from 'lucide-react';
import bgBanner from '../assets/banner001.webp';

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
  return (
    <section className='bg-white'>


<div className="container mx-auto pt-8 px-4">
  <div
    className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center p-8 lg:p-12 min-h-96 mb-8"
    style={{ backgroundImage: `url(${bgBanner})` }}
  >
    {/* Màng tối phủ lên hình nền */}
    <div className="absolute inset-0 bg-black/20 z-0"></div>

    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10 z-0">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-lime-400 to-green-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full">
      {/* Text Content */}
      <div className="text-center lg:text-left lg:w-3/5 mb-8 lg:mb-0">
        <div className="flex items-center justify-center lg:justify-start mb-4">
          <Zap className="text-yellow-300 w-6 h-6 mr-2 animate-pulse" />
          <span className="text-yellow-300 font-semibold text-sm tracking-wider uppercase">Ưu đãi đặc biệt</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Bách Hóa NCT
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-300">
            Ưu đãi rực rỡ
          </span>
        </h1>

        <p className="text-xl text-gray-200 mb-6 leading-relaxed">
          Tiết Kiệm Lên Đến
          <span className="text-yellow-400 font-bold text-2xl mx-2 animate-bounce">33%</span>
          <br />
          Mua nhiều – Tặng lớn!
        </p>

        {/* Stats */}
        <div className="flex justify-center lg:justify-start gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">2.5K+</div>
            <div className="text-sm text-gray-300">Sản phẩm</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">15K+</div>
            <div className="text-sm text-gray-300">Khách hàng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.9</div>
            <div className="text-sm text-gray-300 flex items-center justify-center">
              <Star className="w-3 h-3 text-yellow-300 mr-1" fill="currentColor" />
              Đánh giá
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              MUA NGAY
            </div>
          </button>

          <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300">
            Khám phá thêm
          </button>
        </div>
      </div>

      {/* Visual Elements */}
      <div className="lg:w-2/5 flex justify-center lg:justify-end">
        <div className="relative">
          {/* Main Circle */}
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-green-300/20 to-lime-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl lg:text-7xl font-bold text-white mb-2">33%</div>
                <div className="text-lg text-gray-200 font-semibold">GIẢM GIÁ</div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>

          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-lime-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <Gift className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2  '>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => {
              return (
                <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse '>
                  <div className='bg-blue-100 min-h-20 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>

                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
                <div key={cat._id + "displayCategory"} className='w-full h-full' onClick={() => handleRedirectProductListPage(cat._id, cat.name)}>
                  <div>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className='w-fill h-full object-scale-down'
                    />
                  </div>
                  <div className='text-sm mt-1 text-gray-700 truncate text-center font-semibold '>
                    {cat.name}
                  </div>
                </div>
              )
            })
          )
        }
      </div>

      {/***display category product */}
      {
        categoryData.map((c, index) => {
          return (
            <CategoryWiseProductDisplay
              key={c?._id + "CategorywiseProduct"}
              id={c?._id}
              name={c?.name}
            />)
        })
      }

    </section>
  )
}

export default Home
