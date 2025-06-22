import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className='text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32 border-t bg-white shadow-lg'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                {/* Logo và mô tả */}
                <div className='max-w-80'>
                    <div className='mb-4 h-8 md:h-9'>
                        <p className='text-primary-200 font-semibold text-lg'>
                            BÁCH HÓA <span className='text-green-600'>NCT</span>
                        </p>
                    </div>
                    <p className='text-sm'>
                        Bách Hóa NCT chuyên cung cấp nhu yếu phẩm, thực phẩm, đồ gia dụng và hàng tạp hóa chất lượng với giá cả phải chăng cho mọi gia đình Việt.
                    </p>
                    <div className='flex items-center gap-3 mt-4 text-xl'>
                        <a href="#" className="hover:text-primary-100"><FaInstagram /></a>
                        <a href="#" className="hover:text-primary-100"><FaFacebook /></a>
                        <a href="#" className="hover:text-primary-100"><FaTwitter /></a>
                        <a href="#" className="hover:text-primary-100"><FaLinkedin /></a>
                    </div>
                </div>

                {/* Thông tin công ty */}
                <div>
                    <p className='text-lg text-gray-800'>VỀ CHÚNG TÔI</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Giới thiệu cửa hàng</a></li>
                        <li><a href="#">Tin tức & sự kiện</a></li>
                        <li><a href="#">Hợp tác nhà cung cấp</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Hỗ trợ khách hàng */}
                <div>
                    <p className='text-lg text-gray-800'>HỖ TRỢ KHÁCH HÀNG</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Hướng dẫn mua hàng</a></li>
                        <li><a href="#">Chính sách giao hàng</a></li>
                        <li><a href="#">Chính sách đổi trả</a></li>
                        <li><a href="#">Thanh toán & hoàn tiền</a></li>
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                    </ul>
                </div>

                {/* Đăng ký nhận tin */}
                <div className='max-w-80'>
                    <p className='text-lg text-gray-800'>ĐĂNG KÝ NHẬN ƯU ĐÃI</p>
                    <p className='mt-3 text-sm'>
                        Nhận thông tin khuyến mãi, mã giảm giá và tin tức sản phẩm mới nhất từ chúng tôi.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input
                            type="text"
                            className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none'
                            placeholder='Nhập email của bạn'
                        />
                        <button className='flex items-center justify-center bg-green-600 hover:bg-green-700 h-9 w-9 aspect-square rounded-r'>
                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-sm'>
                <p>© {new Date().getFullYear()} Bách Hóa NCT. Bản quyền thuộc về chúng tôi.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Chính sách bảo mật</a></li>
                    <li><a href="#">Điều khoản sử dụng</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
