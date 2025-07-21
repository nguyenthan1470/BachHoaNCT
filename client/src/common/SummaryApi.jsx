export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
    register: {
        url: '/api/user/register',
        method: 'post'
    },
    login: {
        url: '/api/user/login',
        method: 'post'
    },
    forgot_password: {
        url: '/api/user/forgot-password',
        method: 'put'
    },
    forgot_password_otp_verification: {
        url: '/api/user/verify-forgot-password-otp',
        method: 'put'
    },
    resetPassword: {
        url: '/api/user/reset-password',
        method: 'put'
    },
    refreshToken: {
        url: '/api/user/refresh_token',
        method: 'post'
    },
    userDetails: {
        url: '/api/user/user-details',
        method: "get"
    },
    logout: {
        url: '/api/user/logout',
        method: 'get'
    },
    uploadAvatar: {
        url: '/api/user/upload-avatar',
        method: 'put'
    },
    updateUserDetails: {
        url: '/api/user/update-user',
        method: 'put'
    },
    addCategory: {
        url: '/api/category/add-category',
        method: 'post'
    },
    uploadImage: {
        url: 'api/file/upload',
        method: 'post'
    },
    getCategory: {
        url: '/api/category/get',
        method: 'get'
    },
    updateCategory: {
        url: '/api/category/update',
        method: 'put'
    },
    deleteCategory: {
        url: '/api/category/delete',
        method: 'delete'
    },
    createSubCategory: {
        url: '/api/subcategory/create',
        method: 'post'
    },
    getSubCategory: {
        url: '/api/subcategory/get',
        method: 'post'
    },
    updateSubCategory: {
        url: "/api/subcategory/update",
        method: 'put'
    },
    deleteSubCategory: {
        url: "/api/subcategory/delete",
        method: 'delete'
    },
    createProduct: {
        url: '/api/product/create',
        method: 'post'
    },
    getProduct: {
        url: '/api/product/get',
        method: 'post'
    },
    getProductByCategory: {
        url: '/api/product/get-product-by-category',
        method: 'post'
    },
    getProductByCategoryAndSubCategory: {
        url: '/api/product/get-product-by-category-and-subcategory',
        method: 'post'
    },
    getProductDetails: {
        url: '/api/product/get-product-details',
        method: "post"
    },
    updateProductDetails: {
        url: '/api/product/update-product-details',
        method: "put"
    },
    deleteProduct: {
        url: '/api/product/delete-product',
        method: "delete"
    },
    searchProduct: {
        url: '/api/product/search-product',
        method: 'post'
    },
    addToCart: {
        url: "/api/cart/create",
        method: "post"
    },
    getCartItem: {
        url: '/api/cart/get',
        method: 'get'
    },
    updateCartItemQty: {
        url: '/api/cart/update-qty',
        method: 'put'
    },
    deleteCartItem: {
        url: '/api/cart/delete-cart-item',
        method: 'delete'
    },
    createAddress: {
        url: '/api/address/create',
        method: 'post'
    },
    getAddress: {
        url: '/api/address/get',
        method: 'get'
    },
    updateAddress: {
        url: '/api/address/update',
        method: 'put'
    },
    disableAddress: {
        url: '/api/address/disable',
        method: 'delete'
    },
    CashOnDeliveryOrder: {
        url: "/api/order/cash-on-delivery",
        method: "post"
    },
    payment_url: {
        url: "/api/order/checkout",
        method: 'post'
    },
    getOrderItems: {
        url: '/api/order/order-list',
        method: 'get'
    },
    getAllOrders: {
        url: '/api/admin/orders/all-orders',
        method: 'get'
    },
    updateOrderStatus: {
        url: '/api/admin/orders/update-order-status',
        method: 'put'
    },
    vnpayCreatePayment: {
        url: "/api/vnpay/create_payment",
        method: "get"
    },
    vnpayCheckPayment: {
        url: "/api/vnpay/check_payment",
        method: "get"
    },
    getSalesStatistics: {
        url: '/api/order/statistics',
        method: 'get'
    },
    getAllStaff: {
        url: "/api/staff",
        method: "get",
    },
    addStaff: {
        url: "/api/staff",
        method: "post",

    },
    updateStaff: (id) => ({
        method: "PUT",
        url: `/api/staff/${id}`
    }),
    deleteStaff: (id) => ({
        method: "DELETE",
        url: `/api/staff/${id}`
    }),

    chatbot: {
        method: 'POST',
        url: '/api/chat'
    },
    googleLogin: {
        url: "/api/auth/google-login",
        method: "POST"
    },
    addReview: {
        url: '/api/review/add-review',
        method: 'post'
    },
    getReviews: {
        url: '/api/review/get-review',
        method: 'post'
    },
    sendContactMessage: {
        url: '/api/contact/submit',
        method: 'post'
    },
    sendContactMessage: {
        url: '/api/contact/submit-feedback',
        method: 'POST',
    },
    getFeedbacks: {
        url: '/api/contact/feedbacks',
        method: 'GET',
    },
    sendReply: {
        url: '/api/contact/reply',
        method: 'POST',
    },

}

export default SummaryApi;
