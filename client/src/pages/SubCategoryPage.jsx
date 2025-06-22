import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from "@tanstack/react-table"
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import { IoFlashlightOutline } from 'react-icons/io5'
import toast from 'react-hot-toast'


const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: "Tên sản phẩm"
    }),
    columnHelper.accessor('image', {
      header: "Hình ảnh",
      cell: ({ row }) => {
        console.log("row",)
        return <div className='flex justify-center items-center'>
          <img
            src={row.original.image}
            alt={row.original.name}
            className='w-8 h-8 cursor-pointer'
            onClick={() => {
              setImageURL(row.original.image)
            }}
          />
        </div>
      }
    }),
    columnHelper.accessor("category", {
      header: "Danh mục",
      cell: ({ row }) => {
        return (
          <>
            {
              row.original.category.map((c, index) => {
                return (
                  <p className='shadow-md px-1 inline-block' key={c._id + "table"}>
                    {
                      c.name
                    }
                  </p>
                )
              })
            }

          </>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <div className='items-center justify-center flex gap-3'>
            <button onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
              <HiPencil size={20} />
            </button>
            <button onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-100 rounded-full hover:text-red-600'>
              <MdDelete size={20} />
            </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })
      const {data : responseData} = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({_id:""})
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <section>
      <div className='p-2 bg-white shadow-md items-center flex justify-between'>
        <h2 className='font-semibold'>Danh mục phụ</h2>
        <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200
             hover:bg-primary-200 px-3 py-2 rounded'>Thêm danh mục phụ</button>

      </div>

      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable
          data={data}
          column={column}
        />
      </div>

      {
        openAddSubCategory && (
          <UploadSubCategoryModel
            close={() => setOpenAddSubCategory(false)}
            fetchData = {fetchSubCategory}
            />
        )
      }
      {
        ImageURL &&
        <ViewImage url={ImageURL} close={() => setImageURL("")} />
      }
      {
        openEdit &&
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      }
      {
        openDeleteConfirmBox && (
          <ConfirmBox
            cancel={() => setOpenDeleteConfirmBox(false)}
            close={() => setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteSubCategory}
          />
        )
      }

    </section>
  )
}

export default SubCategoryPage
