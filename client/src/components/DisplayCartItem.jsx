import React from 'react'
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong'
import { FaCaretRight, FaShoppingCart, FaTruck, FaGift } from "react-icons/fa"
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) close()
            return
        }
        toast("Please Login")
    }

    return (
        <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-80 z-50 backdrop-blur-sm'>
            <div className='bg-white w-full max-w-md min-h-screen max-h-screen ml-auto shadow-2xl relative overflow-hidden'>

                {/* Header */}
                <div className='relative flex items-center p-6 shadow-lg gap-3 justify-between bg-white/95 backdrop-blur-sm border-b border-gray-100'>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-xl">
                            <FaShoppingCart className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h2 className='font-bold text-xl text-gray-800'>Giỏ hàng</h2>
                            <p className="text-sm text-gray-500">{totalQty} sản phẩm</p>
                        </div>
                    </div>
                    <button onClick={close} className='p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group'>
                        <IoClose size={24} className="text-gray-600 group-hover:text-gray-800" />
                    </button>
                </div>

                {/* Content */}
<div className='min-h-[75vh] h-full max-h-[calc(100vh-200px)] p-4 flex flex-col gap-6 overflow-auto hide-scrollbar'>

                    {cartItem.length > 0 ? (
                        <>
                            {/* Tiết kiệm */}
                            <div className='flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg'>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <FaGift className="text-white" size={18} />
                                    </div>
                                    <p className="font-medium">Tổng số tiền tiết kiệm</p>
                                </div>
                                <p className="font-bold text-lg">{DisplayPriceInVietnamDong(notDiscountTotalPrice - totalPrice)}</p>
                            </div>

                            {/* Sản phẩm */}
                            <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'>
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                                    Sản phẩm đã chọn
                                </h3>
                                <div className="grid gap-6">
                                    {cartItem.map((item, index) => (
                                        <div key={item?._id} className='flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md'>
                                            <div className='w-20 h-20 bg-white border-2 border-gray-200 rounded-xl overflow-hidden'>
                                                <img
                                                    src={item?.productId?.image[0]}
                                                    alt={item?.productId?.name}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='font-medium text-gray-800 line-clamp-2 mb-1'>{item?.productId?.name}</h4>
                                                <p className='text-sm text-gray-500 mb-2'>{item?.productId?.unit}</p>
                                                <div className="flex items-center gap-2">
                                                    {item?.productId?.discount > 0 && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            {DisplayPriceInVietnamDong(item?.productId?.price)}
                                                        </span>
                                                    )}
                                                    <span className="font-bold ">
                                                        {DisplayPriceInVietnamDong(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}
                                                    </span>
                                                    {item?.productId?.discount > 0 && (
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                                            -{item?.productId?.discount}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <AddToCartButton data={item?.productId} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hóa đơn */}
                            <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'>
                                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                    Chi tiết hóa đơn
                                </h3>
                                <div className='space-y-3'>
                                    <div className='flex justify-between'>
                                        <p className="text-gray-600">Tổng số tiền</p>
                                        <div className='flex gap-2'>
                                            <span className='line-through text-gray-400 text-sm'>{DisplayPriceInVietnamDong(notDiscountTotalPrice)}</span>
                                            <span className="font-semibold text-gray-800">{DisplayPriceInVietnamDong(totalPrice)}</span>
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className="text-gray-600">Tổng số lượng</p>
                                        <p className="font-medium text-gray-800">{totalQty} sản phẩm</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className="text-gray-600 flex items-center gap-2"><FaTruck size={14} />Phí giao hàng</p>
                                        <p className="text-green-600 flex items-center gap-1"><IoCheckmarkCircle size={16} />Miễn phí</p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                                        <p className="font-bold text-lg text-gray-800">Tổng cộng</p>
                                        <p className="font-bold text-xl text-green-600">{DisplayPriceInVietnamDong(totalPrice)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='bg-white rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-lg'>
                            <img src={imageEmpty} className='w-40 h-40 object-contain mb-4' />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Giỏ hàng trống</h3>
                            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                            <Link to="/" onClick={close} className='bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition'>
                                Mua sắm ngay bây giờ
                            </Link>
                        </div>
                    )}
                </div>

                {/* Thanh toán */}
                {cartItem.length > 0 && (
                    <div className='p-4 bg-white border-t border-gray-100'>
                        <button
                            onClick={redirectToCheckoutPage}
                            className='w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-between group'
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-sm opacity-90">Tổng thanh toán</span>
                                <span className="text-xl">{DisplayPriceInVietnamDong(totalPrice)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Tiếp tục</span>
                                <FaCaretRight className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                )}
            </div>

        </section>
    )
}

export default DisplayCartItem
