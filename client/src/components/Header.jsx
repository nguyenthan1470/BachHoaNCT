import React, { useState } from 'react'
// import logo from '../assets/logo1.png'
import logo from '../assets/Logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux'
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { useEffect } from 'react';
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';


const Header = () => {

    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    // const [totalPrice , setTotalPrice] = useState(0)
    // const [totalQty , setTotalQty] = useState(0)
    const {totalPrice, totalQty} = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    
    const redirectToLoginPage = () => {
        navigate("/login")

    }

    const handleCloseUserMenu = () =>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = () =>{
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    //total item and total price
    // useEffect(()=>{
    //     const qty = cartItem.reduce((preve,curr)=>{
    //         return preve + curr.quantity
    //     },0)
    //     setTotalQty(qty)
    //     const tPrice = cartItem.reduce((preve, curr)=>{
    //         return preve + (curr.productId.price * curr.quantity)
    //     },0)
    //    setTotalPrice(tPrice)
    // },[cartItem])

    return (
        <header className='h-28 lg:h-20 shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
            {
                !(isSearchPage && isMobile) && (
                    <div className="container mx-auto flex items-center px-2 justify-between">
                        {/*logo */}
                        <Link to={"/"} className="h-full">
                            <div className='h-full flex justify-center items-center mt-4 '>
                                <img
                                    src={logo}
                                    width={250}
                                    height={180}
                                    alt='logo'
                                    className='hidden lg:block mb-9 brightness-90 contrast-125'
                                />

                                <img
                                    src={logo}
                                    width={200}
                                    height={90}
                                    alt='logo'
                                    className='lg:hidden brightness-90 contrast-125'
                                />
                            </div>
                        </Link>


                        {/*Search */}
                        <div className='hidden lg:block  '>
                            <Search />
                        </div>



                        {/*login and my cart */}

                        <div className=''>
                            {/* user icons display in only mobile version */}
                            <div onClick={handleMobileUser} className='text-neutral-600 lg:hidden mt-6 ' >
                                <FaUserCircle size={26} />
                            </div>

                            {/* Desktop */}
                            <div className='hidden lg:flex items-center gap-10'>
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                                                <p>Tài khoản</p>

                                                {
                                                    openUserMenu ? (
                                                        <GoTriangleUp size={25} />
                                                    ) : (
                                                        <GoTriangleDown size={25} />
                                                    )
                                                }


                                            </div>

                                            {
                                                openUserMenu && (
                                                    < div className='absolute right-0 top-12'>
                                                        <div className='bg-white rounded p-4 min-w-52 lg: shadow-lg'>
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button onClick={redirectToLoginPage} className='text-lg px-2 hover:text-yellow-500 ' to={"/login"}>Đăng nhập</button>

                                    )

                                }
                                <button onClick={()=>setOpenCartSection(true)} className='flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-2 rounded text-white'>
                                    {/* add to cart icons */}
                                    <div className='animate-bounce'>
                                        < BsCart4 size={26} />
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        {
                                            cartItem[0] ? (
                                                <div>
                                                    <p>{totalQty} Sản phẩm</p>
                                                    <p>{DisplayPriceInVietnamDong(totalPrice)}</p>
                                                </div>
                                            ):(
                                                <p>Giỏ hàng</p>
                                            )
                                        }
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
           <div className='container mx-auto px-2 lg:hidden mb-10'>
    <Search />
</div>

             {
                openCartSection && (
                    <DisplayCartItem close={()=>setOpenCartSection(false)} /> )
             }
        </header>
    )
}

export default Header
