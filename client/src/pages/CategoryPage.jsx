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

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({ name: "", image: "" })
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({ _id: "" })

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({ ...SummaryApi.getCategory })
            if (response.data.success) {
                setCategoryData(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
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
            if (response.data.success) {
                toast.success(response.data.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section>
            <div className='p-3 bg-white shadow-md flex items-center justify-between flex-wrap gap-2'>
                <h2 className='font-semibold text-base md:text-lg'>Danh mục sản phẩm</h2>
                <button
                    onClick={() => setOpenUploadCategory(true)}
                    className='text-sm md:text-base border border-primary-200 hover:bg-primary-200 px-3 py-1.5 rounded'
                >
                    Thêm danh mục
                </button>
            </div>

            {!categoryData.length && !loading && (
                <div className='py-6 flex flex-col items-center'>
                    <NoData />
                    <button
                        onClick={() => setOpenUploadCategory(true)}
                        className='mt-4 bg-primary-500 hover:bg-primary-600 text-white text-sm px-3 py-2 rounded'
                    >
                        Thêm danh mục đầu tiên
                    </button>
                </div>
            )}

            <div className='p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
                {categoryData.map((category) => (
                    <div className='w-full shadow-md rounded overflow-hidden border' key={category._id}>
                        <div className='h-28 md:h-36 flex justify-center items-center bg-white p-2'>
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
                                className='flex-1 bg-green-100 text-green-600 text-xs md:text-sm font-medium py-1 rounded hover:bg-green-200'
                            >
                                Cập nhật
                            </button>

                            <button
                                onClick={() => {
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteCategory(category)
                                }}
                                className='flex-1 bg-red-100 text-red-600 text-xs md:text-sm font-medium py-1 rounded hover:bg-red-200'
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <Loading />}

            {openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
            )}

            {openEdit && (
                <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
            )}

            {openConfirmBoxDelete && (
                <ConfirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteCategory}
                />
            )}
        </section>
    )
}

export default CategoryPage
