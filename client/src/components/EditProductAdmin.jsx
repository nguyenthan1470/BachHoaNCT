import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const EditProductAdmin = ({ close ,data : propsData,fetchProductData}) => {
  const [data, setData] = useState({
    _id : propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")


  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        if(close){
          close()
        }
        fetchProductData()
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })

      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
      <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
        <section className=''>
          <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Cập nhật sản phẩm</h2>
            <button onClick={close}>
              <IoClose size={20}/>
            </button>
          </div>
          <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
              <div className='grid gap-1'>
                <label htmlFor='name' className='font-medium'>Tên sản phẩm </label>
                <input
                  id='name'
                  type='text'
                  placeholder='Nhập tên sản phẩm'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
              <div className='grid gap-1'>
                <label htmlFor='description' className='font-medium'>Mô tả</label>
                <textarea
                  id='description'
                  type='text'
                  placeholder='Nhập mô tả sản phẩm'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  multiple
                  rows={3}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                />
              </div>
              <div>
                <p className='font-medium'>Hình ảnh</p>
                <div>
                  <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {
                        imageLoading ? <Loading /> : (
                          <>
                            <FaCloudUploadAlt size={35} />
                            <p>Thêm hình ảnh</p>
                          </>
                        )
                      }
                    </div>
                    <input
                      type='file'
                      id='productImage'
                      className='hidden'
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/**display uploded image*/}
                  <div className='flex flex-wrap gap-4'>
                    {
                      data.image.map((img, index) => {
                        return (
                          <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                            <img
                              src={img}
                              alt={img}
                              className='w-full h-full object-scale-down cursor-pointer'
                              onClick={() => setViewImageURL(img)}
                            />
                            <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                              <MdDelete />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

              </div>
              <div className='grid gap-1'>
                <label className='font-medium'>Danh mục</label>
                <div>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded'
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const category = allCategory.find(el => el._id === value)

                      setData((preve) => {
                        return {
                          ...preve,
                          category: [...preve.category, category],
                        }
                      })
                      setSelectCategory("")
                    }}
                  >
                    <option value={""}>Chọn danh mục</option>
                    {
                      allCategory.map((c, index) => {
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className='flex flex-wrap gap-3'>
                    {
                      data.category.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                            <p>{c.name}</p>
                            <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                              <IoClose size={20} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className='grid gap-1'>
                <label className='font-medium'>Danh mục phụ</label>
                <div>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded'
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const subCategory = allSubCategory.find(el => el._id === value)

                      setData((preve) => {
                        return {
                          ...preve,
                          subCategory: [...preve.subCategory, subCategory]
                        }
                      })
                      setSelectSubCategory("")
                    }}
                  >
                    <option value={""} className='text-neutral-600'>Chọn Danh mục phụ</option>
                    {
                      allSubCategory.map((c, index) => {
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className='flex flex-wrap gap-3'>
                    {
                      data.subCategory.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                            <p>{c.name}</p>
                            <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                              <IoClose size={20} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

              <div className='grid gap-1'>
                <label htmlFor='unit' className='font-medium'>Đơn vị</label>
                <input
                  id='unit'
                  type='text'
                  placeholder='Enter product unit'
                  name='unit'
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='stock' className='font-medium'>Số lượng tồn kho</label>
                <input
                  id='stock'
                  type='number'
                  placeholder='Nhập số lượng tồn kho'
                  name='stock'
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='price' className='font-medium'>Đơn giá</label>
                <input
                  id='price'
                  type='number'
                  placeholder='Nhập đơn giá'
                  name='price'
                  value={data.price}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='discount' className='font-medium'>Chiết khấu</label>
                <input
                  id='discount'
                  type='number'
                  placeholder='Nhập chiết khấu'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>


              {/**add more field**/}
              {
                Object?.keys(data?.more_details)?.map((k, index) => {
                  return (
                    <div className='grid gap-1'>
                      <label htmlFor={k} className='font-medium'>{k}</label>
                      <input
                        id={k}
                        type='text'
                        value={data?.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value
                              }
                            }
                          })
                        }}
                        required
                        className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                      />
                    </div>
                  )
                })
              }

              <div onClick={() => setOpenAddField(true)} className=' hover:bg-primary-200 bg-white mt-1 py-1 px-3 w-36 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                Thêm mục mới
              </div>

              <button
                className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
              >
                Cập nhật sản phẩm 
              </button>
            </form>
          </div>

          {
            ViewImageURL && (
              <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
            )
          }

          {
            openAddField && (
              <AddFieldComponent
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                submit={handleAddField}
                close={() => setOpenAddField(false)}
              />
            )
          }
        </section>
      </div>
    </section>
  )
}

export default EditProductAdmin

