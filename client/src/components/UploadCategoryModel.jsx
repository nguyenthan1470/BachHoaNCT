import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })

    const [loading, setLoading] = useState(false)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({

                ...SummaryApi.addCategory,
                data: data

            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                fetchData()

            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await uploadImage(file)
        const { data: ImageResponse } = response

        setData((preve) => {
            return {
                ...preve,
                image: ImageResponse.data.url
            }
        })

    }

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 items-center flex justify-center'>
            <div className='bg-white max-w-4xl w-full p-4 rounded'>
                <div className='flex items-center justify-center'>
                    <h1 className='font-semibold'>Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-2 ' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Tên</label>
                        <input type="text"
                            id='categoryName'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-100 
                            focus-within:border-primary-200 outline-none rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Hình ảnh</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center
                         justify-center rounded' >
                                {
                                    data.image ? (
                                        <img
                                            alt="category"
                                            src={data.image}
                                            className='2-full h-full object-scale-down'

                                        />

                                    ) : (
                                        <p className='text-sm text-neutral-500'> Chưa có ảnh </p>

                                    )
                                }

                            </div>
                            <label htmlFor="uploadCategoryImage">
                                <div className={`${!data.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"} 
                                px-4 py-2 rounded cursor-pointer border font-medium
                                `}>Thêm ảnh</div>

                                <input disabled={!data.name} onChange={handleUploadCategoryImage} type="file" id='uploadCategoryImage'
                                    className='hidden' />
                            </label>
                        </div>
                    </div>
                    <button
                        className={
                            `${data.name && data.image ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300"}
                        py-2 font-semibold
                        
                        `
                        }
                    >
                        Add Category
                    </button>

                </form>
            </div>
        </section>
    )
}

export default UploadCategoryModel
