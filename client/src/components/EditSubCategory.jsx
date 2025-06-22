import React, { useState } from 'react'
import { IoClose } from "react-icons/io5"
import uploadImage from '../utils/UploadImage'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios.js'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'



const EditSubCategory = ({ close,data,fetchData }) => {

    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name,
        image: data.image, 
        category: data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)


    const handleChange = (e) => {
        const { name, value } = e.target

        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name]: value

            }
        })
    }


    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }
        const response = await uploadImage(file)
        const { data: ImageResponse } = response

        setSubCategoryData((preve) => {
            return {
                ...preve,
                image: ImageResponse.data.url
            }
        })
    }

    const handleRemoveCategorySelected = (categoryId) => {
        const index = subCategoryData.category.findIndex(el => el._id === categoryId)
        subCategoryData.category.splice(index, 1)
        setSubCategoryData((preve) => {
            return {
                ...preve
            }
        })
    }

    const handleSubmitSubCategory = async(e) =>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi. updateSubCategory,
                data: subCategoryData
            })

            const {data : responseData} = response

            console.log('responseData', responseData)

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                }
                if (fetchData) {
                    fetchData()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    



    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-x-6xl bg-white p-4 rounded '>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>
                        Cập nhật danh mục phụ
                    </h1>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-3 ' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Tên</label>
                        <input
                            id='name'
                            name='name'
                            onChange={handleChange}
                            value={subCategoryData.name}
                            className='p-3 bg-blue-50 border outline-none 
                        focus-within: border-primary-200 rounded' />
                    </div>
                    <div className='grid gap-1'>
                        <p>Hình ảnh</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-sm text-neutral-400'>Không hình </p>
                                    ) : (
                                        <img
                                            alt="subCategory"
                                            src={subCategoryData.image}
                                            className='2-full h-full object-scale-down'

                                        />
                                    )
                                }
                            </div>
                            <label htmlFor="uploadSubCategoryImage">

                                <div className='px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200
                             hover:text-neutral-900 cursor-pointer'>
                                    Cập nhật hình ảnh
                                </div>
                                <input
                                    type="file"
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                    onChange={handleUploadSubCategoryImage}
                                />
                            </label>

                        </div>


                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="">Chọn danh mục</label>
                        <div className='border rounded focus-within:border-primary-200'>
                            {/* display value */}
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((cat, index) => {
                                        return (
                                            <div className='bg-white shadow-md px-1 m-1 flex items-center gap-2' key={cat._id + "selectedValue"}>{cat.name}
                                                <div className='cursor-pointer hover:text-red-500' onClick={() => handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={20} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            {/* select category */}
                            <select
                                className='w-full p-2 bg-transparent outline-none border'
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })
                                }}

                            >
                                <option value={""} >Chọn danh mục</option>
                                {
                                    allCategory.map((category, index) => {
                                        return (
                                            <option value={category?._id} key={category._id + "subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }

                            </select>
                        </div>

                    </div>
                    <button className={`px-4 py-1 border
                        ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-primary-200 hover:bg-primary-200" : "bg-gray-200"}
                        font-semibold
                        `}>
                        Xác nhận
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditSubCategory
