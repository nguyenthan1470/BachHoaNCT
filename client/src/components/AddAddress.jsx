import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '../provider/GlobalProvider'

const vietnamCountry = ["Việt Nam"]

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, watch } = useForm()
    const selectedProvince = watch('province')
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const { fetchAddress } = useGlobalContext()

    // Lấy danh sách Tỉnh/Thành khi mount
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/?depth=1')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(console.error)
    }, [])

    // Khi chọn Tỉnh, lấy Quận/Huyện tương ứng
    useEffect(() => {
        setDistricts([])
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts))
                .catch(console.error)
        }
    }, [selectedProvince])

    const onSubmit = async (data) => {
        console.log("data", data)
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    fullname:data.fullname,
                    email:data.email,
                    address_line: data.addressline,
                    city: provinces.find(p => p.code === +data.province)?.name,
                    district: districts.find(d => d.code === +data.district)?.name,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
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
        }
    }

    return (
        <section className='bg-black fixed inset-0 z-50 bg-opacity-70 overflow-auto'>
            <div className='bg-white p-4 max-w-lg mx-auto mt-8 rounded'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold'>Thêm địa chỉ</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    {/* Họ và tên */}
                    <div>
                        <label>Họ và tên:</label>
                        <input
                            {...register("fullname", { required: true })}
                            className='border p-2 rounded w-full bg-blue-50'
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label>Email:</label>
                        <input
                            type='email'
                            {...register("email", { required: true })}
                            className='border p-2 rounded w-full bg-blue-50'
                        />
                    </div>

                    <div>
                        <label>Địa chỉ cụ thể :</label>
                        <input
                            {...register("addressline", { required: true })}
                            className='border p-2 rounded w-full bg-blue-50'
                        />
                    </div>
                    <div>
                        <label>Tỉnh/Thành phố :</label>
                        <select {...register("province", { required: true })} className='border p-2 rounded w-full bg-blue-50'>
                            <option value="">Chọn...</option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Quận/Huyện :</label>
                        <select {...register("district", { required: true })} className='border p-2 rounded w-full bg-blue-50'>
                            <option value="" >Chọn...</option>
                            {districts.map(d => (
                                <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Phường/Xã :</label>
                        <input
                            {...register("state")}
                            className='border p-2 rounded w-full bg-blue-50'
                        />
                    </div>
                    <div>
                        <label>Mã bưu điện (nếu có) :</label>
                        <input {...register("pincode")} className='border p-2 rounded w-full bg-blue-50' />
                    </div>

                    <div>
                        <label>Quốc gia :</label>
                        <select {...register("country", { required: true })} className='border p-2 rounded w-full bg-blue-50'>
                            <option value="">Chọn...</option>
                            {vietnamCountry.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Số điện thoại :</label>
                        <input {...register("mobile", { required: true })} className='border p-2 rounded w-full bg-blue-50' />
                    </div>
                    <button type='submit' className='bg-primary-200 py-2 font-semibold w-full hover:bg-primary-100 mt-4'>
                        Xác nhận
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress
