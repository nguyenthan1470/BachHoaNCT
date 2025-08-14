import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  const subCategoryId = params.subCategory.split('-').slice(-1)[0]
  const subCategoryName = params.subCategory.split('-').slice(0, -1).join('-')
  const categoryId = params.category.split('-').slice(-1)[0]

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 8,
        },
      })

      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data || [])
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setData([])
    setPage(1)
    fetchProductData()
  }, [params.category, params.subCategory])

  useEffect(() => {
    const filtered = AllSubCategory.filter(sub =>
      sub.category.some(cat => cat._id === categoryId)
    )
    setDisplaySubCategory(filtered)
  }, [categoryId, AllSubCategory])

  return (
    <section className='sticky top-24 lg:top-20 pt-1'>
      <div className='container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[220px,1fr] lg:grid-cols-[240px,1fr] gap-4 mt-8 sm:mt-1'>

        {/* Sub Category Navigation */}
        <div className='h-[85vh] overflow-y-auto border rounded bg-white shadow scrollbarCustom'>
          {DisplaySubCategory.map((s, index) => {
            const link = `/${valideURLConvert(s.category[0].name)}-${s.category[0]._id}/${valideURLConvert(s.name)}-${s._id}`
            return (
              <Link key={s._id} to={link} className={`flex items-center gap-3 px-3 py-2 border-b hover:bg-green-100 transition ${subCategoryId === s._id ? "bg-green-100" : ""}`}>
                <img src={s.image} alt={s.name} className='w-10 h-10 object-contain' />
                <span className='text-sm'>{s.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Product Listing */}
        <div>
          <div className='bg-white px-4 py-3 shadow rounded mb-3 sticky top-20 z-10'>
            <h2 className='text-lg font-semibold capitalize'>{subCategoryName.replace(/-/g, ' ')}</h2>
          </div>

          <div className='min-h-[70vh]'>
            {loading ? (
              <Loading />
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2'>
                {data.length ? (
                  data.map((product, i) => (
                    <CardProduct key={product._id + i} data={product} />
                  ))
                ) : (
                  <div className='col-span-full text-center text-gray-500'>Không có sản phẩm nào.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
