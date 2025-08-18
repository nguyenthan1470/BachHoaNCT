import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import { MapPin, User, Mail, Phone, Home, Building, Globe } from 'lucide-react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useGlobalContext } from '../provider/GlobalProvider'

const vietnamCountry = ['Việt Nam']

const AddAddress = ({ close }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm()
  const selectedProvince = watch('province')
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { fetchAddress } = useGlobalContext()

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setDistricts([])
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts))
        .catch(console.error)
    }
  }, [selectedProvince])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          fullname: data.fullname,
          email: data.email,
          address_line: data.addressline,
          city: provinces.find((p) => p.code === +data.province)?.name,
          district: districts.find((d) => d.code === +data.district)?.name,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        close?.()
        reset()
        fetchAddress()
      }
    } catch (err) {
      AxiosToastError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm overflow-auto flex items-center justify-center p-4'>
      <div className='bg-white max-w-2xl w-full rounded-2xl shadow-2xl border-t-4 border-emerald-500 relative animate-in fade-in duration-300'>
        <div className='bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 rounded-t-2xl'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
                <MapPin className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-xl font-bold text-white'>Thêm địa chỉ mới</h2>
            </div>
            <button
              onClick={close}
              className='w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200'
            >
              <IoClose className='w-5 h-5 text-white' />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-5 '>
          <div className='grid md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <User className='w-4 h-4 text-emerald-500' /> Họ và tên
              </label>
              <input
                {...register('fullname', { required: 'Vui lòng nhập họ tên' })}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
                placeholder='Nhập họ và tên'
              />
              {errors.fullname && <p className='text-red-500 text-xs'>{errors.fullname.message}</p>}
            </div>

            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Mail className='w-4 h-4 text-emerald-500' /> Email
              </label>
              <input
                type='email'
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
                })}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
                placeholder='example@email.com'
              />
              {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
              <Home className='w-4 h-4 text-emerald-500' /> Địa chỉ cụ thể
            </label>
            <input
              {...register('addressline', { required: 'Vui lòng nhập địa chỉ cụ thể' })}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
              placeholder='Số nhà, tên đường'
            />
            {errors.addressline && <p className='text-red-500 text-xs'>{errors.addressline.message}</p>}
          </div>

          <div className='grid md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Building className='w-4 h-4 text-emerald-500' /> Tỉnh/Thành phố
              </label>
              <select
                {...register('province', { required: 'Vui lòng chọn tỉnh/thành phố' })}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
              >
                <option value=''>Chọn tỉnh/thành phố</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && <p className='text-red-500 text-xs'>{errors.province.message}</p>}
            </div>

            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Building className='w-4 h-4 text-emerald-500' /> Quận/Huyện
              </label>
              <select
                {...register('district', { required: 'Vui lòng chọn quận/huyện' })}
                disabled={!selectedProvince}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
              >
                <option value=''>Chọn quận/huyện</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && <p className='text-red-500 text-xs'>{errors.district.message}</p>}
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <MapPin className='w-4 h-4 text-emerald-500' /> Phường/Xã
              </label>
              <input
                {...register('state')}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
                placeholder='Nhập phường/xã'
              />
            </div>

            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Mail className='w-4 h-4 text-emerald-500' /> Mã bưu điện (nếu có)
              </label>
              <input
                {...register('pincode')}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
                placeholder='Mã bưu điện (không bắt buộc)'
              />
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Globe className='w-4 h-4 text-emerald-500' /> Quốc gia
              </label>
              <select
                {...register('country', { required: 'Vui lòng chọn quốc gia' })}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
              >
                <option value=''>Chọn quốc gia</option>
                {vietnamCountry.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && <p className='text-red-500 text-xs'>{errors.country.message}</p>}
            </div>

            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Phone className='w-4 h-4 text-emerald-500' /> Số điện thoại
              </label>
              <input
                {...register('mobile', {
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                })}
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white'
                placeholder='0123456789'
              />
              {errors.mobile && <p className='text-red-500 text-xs'>{errors.mobile.message}</p>}
            </div>
          </div>

          <div className='pt-4 border-t border-gray-100'>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Đang xử lý...
                </div>
              ) : (
                'Xác nhận thêm địa chỉ'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AddAddress
