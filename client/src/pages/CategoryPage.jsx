import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'



const CategoryPage = () => {

    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: ""
    })

    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)

    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    })

    // const allCategory = useSelector(state => state.product.allCategory)

    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },[allCategory])

    const fetchCategory = async () => {
        try {

            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })

            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }

        } catch (error) {

        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section>
            <div className='p-2 bg-white shadow-md items-center flex justify-between'>
                <h2 className='font-semibold'>Danh mục sản phẩm</h2>
                <button onClick={() => setOpenUploadCategory(true)} className='text-sm border border-primary-200
             hover:bg-primary-200 px-3 py-2 rounded'>Thêm sản phẩm </button>

            </div>

            {
                !categoryData[0] && !loading && (
                    <NoData />
                )
            }

            <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {
                    categoryData.map((category, index) => {
                        return (
                            <div className='w-full shadow-md rounded overflow-hidden border' key={category._id}>
                                <div className='h-36 flex justify-center items-center bg-white p-2'>
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className='max-h-full object-contain'
                                    />
                                </div>

                                <div className='text-center text-sm font-medium p-2 truncate'>
                                    {category.name}
                                </div>

                                <div className='flex gap-1 p-2'>
                                    <button
                                        onClick={() => {
                                            setOpenEdit(true)
                                            setEditData(category)
                                        }}
                                        className='flex-1 bg-green-100 text-green-600 text-sm font-medium py-1 rounded hover:bg-green-200 transition-all duration-200'
                                    >
                                        Cập nhật
                                    </button>

                                    <button
                                        onClick={() => {
                                            setOpenConfirmBoxDelete(true)
                                            setDeleteCategory(category)
                                        }}
                                        className='flex-1 bg-red-100 text-red-600 text-sm font-medium py-1 rounded hover:bg-red-200 transition-all duration-200'
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                loading && (
                    <Loading />
                )
            }


            {
                openUploadCategory && (
                    <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
                )
            }

            {
                openEdit && (
                    <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
                )
            }

            {
                openConfirmBoxDelete && (
                    <ConfirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory} />
                )
            }


        </section>
    )
}

export default CategoryPage
