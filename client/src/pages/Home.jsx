import React from 'react'
// import banner from '../assets/banner.jpg'
import banner from '../assets/banner1.jpg'

import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/ValideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

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


      {/* //banner cũ
      <div className='container mx-auto '>
        <div className={`w-full h-full bg-blue-100 rounded min-h-48 ${!banner && " animate-pulse my-2"}`}>

          <img src={banner}
            className='w-full h-full hidden lg:block'
            alt="banner" />

          <img src={bannerMobile}
            className='w-full h-full lg:hidden'
            alt="banner" />
        </div>

      </div> */}

      {/* banner mới */}
      <div className="container mx-auto pt-8 ">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-green-100 to-blue-100 p-4 flex flex-col lg:flex-row items-center justify-between min-h-60 ">
          <img
            src={banner}
            alt="banner"
            className="hidden lg:block w-2/3 h-auto object-contain rounded-2xl"
          />
          <img
            src={bannerMobile}
            alt="banner"
            className="lg:hidden w-full mb-4 rounded"
          />
          <div className="text-center lg:w-1/2">
            <h2 className="text-3xl font-bold text-green-800 mb-2 ">Deal cực đã, giá cực hời</h2>
            <p className="text-lg text-gray-700 mb-4 font-semibold">Flash Sale – Tiết Kiệm Lên Đến <span className="text-red-500 font-bold">33%</span> – Mua nhiều, tặng nhiều!</p>
            <Link to={"/"} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">
              MUA NGAY
            </Link>
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
