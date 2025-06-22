import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadImage from '../utils/UploadImage.js'
import Loading from '../components/Loading.jsx';
import ViewImage from '../components/ViewImage.jsx'
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux"
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../components/AddFieldComponent.jsx';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.jsx';
import AxiosToastError from '../utils/AxiosToastError.js';
import successAlert from '../utils/SuccessAlert.js';
import { useEffect } from 'react';


const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {}


  })

  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageUrl, setViewImageUrl] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [moreField, setMoreField] = useState([])
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const filteredSubCategories = allSubCategory.filter(sub =>
    sub.category.some(cat => data.category.map(c => c._id).includes(cat._id || cat))
  );
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

    const response = await UploadImage(file)

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
        ...SummaryApi.createProduct,
        data: data
      })

      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
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
          more_details: {}
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // useEffect(() => {
  //   successAlert("Upload Successfully")
  // }, [])


  return (
    <section>
      <div className='p-2 bg-white shadow-md items-center flex justify-between'>
        <h2 className='font-semibold'>Tải lên sản phẩm</h2>
      </div>

      <div className='grid p-4' onSubmit={handleSubmit}>
        <form className='grid gap-2' >
          {/* name */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor='name'>Tên sản phẩm</label>
            <input
              id='name '
              type="text"
              placeholder='Nhập tên sản phẩm'
              name='name'
              value={data.name}
              onChange={handleChange}
              required
              className='rounded bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

            />
          </div>
          {/* Description */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor='description'>Mô tả</label>
            <textarea
              id='description '
              type="text"
              placeholder='Nhập mô tả sản phẩm'
              name='description'
              value={data.description}
              onChange={handleChange}
              required
              multiple
              rows={3}
              className='rounded resize-none bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

            />
          </div>

          {/* image */}
          <div>
            <p className='font-medium'>Hình ảnh</p>
            <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded justify-center items-center flex cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {
                    imageLoading ? <Loading /> : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Thêm hình ảnh </p>
                      </>
                    )
                  }

                </div>
                <input type="file"
                  id='productImage'
                  className='hidden'
                  accept='image/*'
                  onChange={handleUploadImage}
                />

              </label>

              {/* display upload image */}

              <div className=' flex flex-wrap gap-4'>
                {
                  data.image.map((img, index) => {
                    return (
                      <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                        <img
                          src={img}
                          alt={img}
                          className='w-full h-full object-scale-down cursor-pointer '
                          onClick={() => setViewImageUrl(img)}
                        />
                        <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer' >
                          <MdDelete />
                        </div>
                      </div>
                    )
                  })
                }
              </div>

            </div>
          </div>
          {/* Category */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor="">
              Danh mục
            </label>
            <div>
              <select
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const category = allCategory.find(el => el._id === value)
                  console.log(category)

                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category]
                    }
                  })
                  setSelectCategory("")
                }}
                className='bg-blue-50 border w-full p-2 rounded'>
                <option value="">Chọn danh mục</option>
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
                      <div key={c._id + index + "subCategorySEction"} className='text-sm flex items-center gap-1 bg-blue-50 mt-1 '>
                        <p>{c.name}</p>
                        <div className='hover:bg-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          {/* sub category */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor="">
              Danh mục phụ
            </label>
            <div>
              {/* <select
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
                className='bg-blue-50 border w-full p-2 rounded'>
                <option value="" className='text-neutral-600'>Chọn danh mục phụ</option>
                {
                  allSubCategory.map((c, index) => {
                    return (
                      <option value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select> */}
              <select
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const subCategory = allSubCategory.find(el => el._id === value)
                  setData((preve) => ({
                    ...preve,
                    subCategory: [...preve.subCategory, subCategory]
                  }))
                  setSelectSubCategory("")
                }}
                className='bg-blue-50 border w-full p-2 rounded'
                disabled={data.category.length === 0} // Chặn chọn nếu chưa có danh mục
              >
                <option value="" className='text-neutral-600'>Chọn danh mục phụ</option>
                {
                  filteredSubCategories.map((c, index) => (
                    <option value={c?._id} key={c._id}>{c.name}</option>
                  ))
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.subCategory.map((c, index) => {
                    return (
                      <div key={c._id + index + "productsection"}
                        className='text-sm flex items-center gap-1 bg-blue-50 mt-1 '>
                        <p>{c.name}</p>
                        <div className='hover:bg-red-500 cursor-pointer'
                          onClick={() => handleRemoveSubCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          {/* unit */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor='unit'>Đơn vị</label>
            <input
              id='unit '
              type="text"
              placeholder='Nhập đơn vị'
              name='unit'
              value={data.unit}
              onChange={handleChange}
              required
              className='rounded bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

            />
          </div>
          {/* stock */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor='name'>Số lượng tồn kho</label>
            <input
              id='stock '
              type="text"
              placeholder='Nhập số lượng tồn kho'
              name='stock'
              value={data.stock}
              onChange={handleChange}
              required
              className='rounded bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

            />
          </div>
          {/* Price */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor='price'>Đơn giá</label>
            <input
              id='price'
              type="number"
              placeholder='Nhập đơn giá'
              name='price'
              value={data.price}
              onChange={handleChange}
              required
              className='rounded bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

            />
          </div>
          {/* Discount */}
          <div className='grid gap-1'>
            <label className='font-medium' htmlFor='discount'>Chiết khấu</label>
            <input
              id='discount'
              type="number"
              placeholder='Nhập chiếc khấu'
              name='discount'
              value={data.discount}
              onChange={handleChange}
              required
              className='rounded bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

            />
          </div>
          {/* more details */}


          {
            Object?.keys(data?.more_details)?.map((k, index) => {
              return (
                <div className='grid gap-1'>
                  <label className='font-medium' htmlFor={k}>{k}</label>
                  <input
                    id={k}
                    type="text"
                    value={data.more_details[k]}
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
                    className='rounded bg-blue-50 p-2 outline-none border focus-within:border-primary-200'

                  />
                </div>
              )
            })
          }


          <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-36 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded mt-1'>
            Thêm mục mới
          </div>
          <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
            Xác nhận
          </button>

        </form>
      </div>
      {
        ViewImageUrl && (
          <ViewImage url={ViewImageUrl} close={() => setViewImageUrl("")} />
        )
      }
      {
        openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)} />
        )
      }
    </section>
  )
}

export default UploadProduct
