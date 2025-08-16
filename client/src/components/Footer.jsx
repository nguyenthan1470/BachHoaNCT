import { Link } from 'react-router-dom'
import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import logo from '../assets/Logo.png'

const Footer = () => {
    return (
        <footer className='text-gray-500/80 pt-8 border-t bg-white shadow-lg'>
            {/* Thêm container để canh giữa và padding giống các trang khác */}
            <div className="container mx-auto px-4 lg:px-8">
                <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                    {/* Logo và mô tả */}
                    <div className='max-w-80'>
                        <div className='mb-4 h-8 md:h-9'>
                            <p className='text-primary-200 font-semibold text-lg'>
                              <Link to={'/'} >BÁCH HÓA <span className='text-green-600'>NCT</span> </Link>  
                            </p>
                        </div>
                        <p className='text-sm'>
                            Bách Hóa NCT chuyên cung cấp nhu yếu phẩm, thực phẩm, đồ gia dụng và hàng tạp hóa chất lượng với giá cả phải chăng cho mọi gia đình Việt.
                        </p>
                        <div className="flex items-center gap-3 mt-4 text-xl">
                            <a href="#" className="hover:text-[#1877F2]">
                                <FaFacebook />
                            </a>
                            <a href="#" className="hover:text-[#1DA1F2]">
                                <FaTwitter />
                            </a>
                            <a href="#" className="hover:text-[#E1306C]">
                                <FaInstagram />
                            </a>
                            <a href="#" className="hover:text-[#0A66C2]">
                                <FaLinkedin />
                            </a>
                        </div>

                    </div>

                    {/* Liên kết và thông tin liên hệ */}
                    <div className="flex-1 flex items-start md:justify-end gap-20">
                        <div>
                            <h2 className="font-semibold mb-2 text-gray-800">VỀ CHÚNG TÔI</h2>
                            <ul className="text-sm space-y-2 ">
                                <p className=' hover:text-yellow-500'><Link to="/">Trang chủ </Link> </p>
                                <p className=' hover:text-yellow-500'><Link to="/">Giới thiệu cửa hàng</Link></p>
                                <p className=' hover:text-yellow-500'><Link to="/contact">Liên hệ với chúng tôi</Link></p>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-semibold mb-2 text-gray-800">Liên hệ</h2>
                            <div className="text-sm space-y-2">
                                <p>+84-21-4653-783</p>
                                <p>BachHoaNCT@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='border-gray-300 mt-8' />
                <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-sm'>
                    <p className=''>© {new Date().getFullYear()} Bách Hóa NCT. Bản quyền thuộc về chúng tôi.</p>

                </div>
            </div>
        </footer>
    )
}

export default Footer
