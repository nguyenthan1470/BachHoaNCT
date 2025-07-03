import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import MyOrders from "../pages/MyOrders";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import GroceryNewsPage from "../pages/GroceryNewsPage";
import ManageOrders from "../pages/ManageOrders";
import SalesReport from "../pages/SalesReport";
import StaffAccounts from "../pages/StaffAccounts";
import VnpayPaymentResult from "../pages/VnpayPaymentResult";
import  Contact from "../pages/Contact";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, //  là thành phần cha chứa tất cả nội dung của trang web.
        children: [
            {
                path: "",
                element: <Home /> // thành phân con chứa nội dung trang chủ 
            },
            {
                path: "search",
                element: <SearchPage /> // thành phân con chứa nội dung trang chủ 
            },
            {
                path: "Login",
                element: <Login />
            },
            {
                path: "Register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "category",
                        element: <AdminPermission> <CategoryPage /> </AdminPermission>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermission> <SubCategoryPage /> </AdminPermission>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermission><UploadProduct /> </AdminPermission>
                    },
                    {
                        path: "product",
                        element: <AdminPermission> <ProductAdmin /></AdminPermission>
                    },

                    // Quản lý người dùng
                    {
                        path: "manage-orders",
                        element: <AdminPermission> <ManageOrders /></AdminPermission>
                    },
                    
                    {
                        path: "sales-report",
                        element: <AdminPermission> <SalesReport /></AdminPermission>
                    },
                   
                    {
                        path: "staff-accounts",
                        element: <AdminPermission> <StaffAccounts /></AdminPermission>
                    },


                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            },
            {
                path: 'cart',
                element: <CartMobile />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: 'success',
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            },
            {
                path: 'new',
                element: <GroceryNewsPage />
            },
            {
                path:"vnpay-result",
                element: <VnpayPaymentResult />
            },
            {
                path:"contact",
                element:<Contact/>
            }
            

        ]
    }
])


export default router;


