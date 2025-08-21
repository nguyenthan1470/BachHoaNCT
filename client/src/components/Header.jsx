import React, { useState, useEffect } from 'react';
import logo from '../assets/Logo.png';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import useMobile from '../hooks/useMobile';
import { BsCart4 } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import UserMenu from './UserMenu';
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const openCart = () => {
    setOpenCartSection(true);
    window.dispatchEvent(new CustomEvent('toggle-chatbot', { detail: false }));
  };

  const closeCart = () => {
    setOpenCartSection(false);
    window.dispatchEvent(new CustomEvent('toggle-chatbot', { detail: true }));
  };

  const redirectToLoginPage = () => {
    navigate('/login');
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate('/login');
      return;
    }
    navigate('/user');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="h-28 lg:h-20 shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!isSearchPage || !isMobile ? (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/* Logo */}
          <Link to="/" className="h-full">
            <div className="h-full flex justify-center items-center ">
              <img
                src={logo}
                width={250}
                height={180}
                alt="Company Logo"
                className="hidden lg:block brightness-90 contrast-125"
              />
              <img
                src={logo}
                width={200}
                height={90}
                alt="Company Logo"
                className="lg:hidden brightness-90 contrast-125"
              />
            </div>
          </Link>

          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login and Cart */}
          <div>
            {/* User icon for mobile */}
            <div
              onClick={handleMobileUser}
              className="text-neutral-600 lg:hidden mt-6"
              aria-label="User profile"
            >
              <FaUserCircle size={26} />
            </div>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative user-menu-container">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                    aria-label="Toggle user menu"
                  >
                    <p>Tài khoản</p>
                    {openUserMenu ? <GoTriangleUp size={25} /> : <GoTriangleDown size={25} />}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-lg px-2 hover:text-yellow-500"
                  aria-label="Log in"
                >
                  Đăng nhập
                </button>
              )}
              <button
                onClick={openCart}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-2 rounded text-white"
                aria-label="Open shopping cart"
              >
                <BsCart4 size={26} className={cartItem.length > 0 ? 'animate-bounce' : ''} />
                <div className="font-semibold text-sm">
                  {cartItem.length > 0 ? (
                    <div>
                      <p>{totalQty} Sản phẩm</p>
                      <p>{DisplayPriceInVietnamDong(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>Giỏ hàng</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
      {openCartSection && (
        <div className="fixed inset-0 z-[80]">
          <DisplayCartItem close={closeCart} />
        </div>
      )}
    </header>
  );
};

export default Header;