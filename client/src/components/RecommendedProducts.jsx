import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CardProduct from './CardProduct';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import Loading from './Loading';
import NoData from './NoData';
import { FaAngleLeft, FaAngleRight, FaFire } from 'react-icons/fa6';

const RecommendedProducts = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const cartItems = useSelector((state) => state.cartItem.cart);
    const firstRowRef = useRef(null);
    const secondRowRef = useRef(null);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const productIds = cartItems.map((item) => item.productId._id);

            let response;
            if (productIds.length === 0) {
                response = await Axios({
                    ...SummaryApi.getTrendingProducts,
                    data: { limit: 24 },
                });
            } else {
                response = await Axios({
                    ...SummaryApi.getRecommendations,
                    data: {
                        productIds: productIds,
                        limit: 24,
                    },
                });
            }

            if (response.data.success) {
                const uniqueProducts = Array.from(
                    new Map(
                        response.data.data.map((product) => [product._id, product])
                    ).values()
                );
                setRecommendedProducts(uniqueProducts);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, [cartItems]);

    const sectionTitle =
        cartItems.length > 0 ? 'Sản phẩm đề xuất cho bạn' : 'Sản phẩm thịnh hành';

    const handleScrollLeft = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
    };

    const handleScrollRight = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
                    <div className="relative p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="text-green-600 text-2xl mr-3 animate-pulse" />
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {sectionTitle}
                            </h2>
                            <div className="text-green-600 text-2xl ml-3 animate-pulse" />
                        </div>
                        <Loading />
                    </div>
                </div>
            </div>
        );
    }

    if (recommendedProducts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
                    <div className="relative p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="text-green-600 text-2xl mr-3" />
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {sectionTitle}
                            </h2>
                            <div className="text-green-600 text-2xl ml-3" />
                        </div>
                        <NoData message="Không có sản phẩm để hiển thị" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 relative">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-xl mb-12 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl"></div>
                
                <div className="relative p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <div className="text-green-600 text-xl" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {sectionTitle}
                        </h2>
                        <div className="bg-green-100 p-2 rounded-full ml-3">
                            <FaFire className="text-red-600 text-xl" />
                        </div>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
                </div>
            </div>

            {/* First Row */}
            <div className="relative mb-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                    <div className="relative flex items-center">
                        <div
                            className="flex gap-6 flex-nowrap overflow-x-scroll scrollbar-none scroll-smooth pb-2"
                            ref={firstRowRef}
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {recommendedProducts.slice(0, 12).map((product, index) => (
                                <div 
                                    key={product._id} 
                                    className="min-w-[220px] max-w-[240px] transform transition-all duration-300 hover:scale-105"
                                    style={{
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
                                        <CardProduct data={product} loading={false} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {recommendedProducts.length > 0 && (
                            <div className="w-full left-0 right-0 px-4 absolute hidden lg:flex justify-between pointer-events-none">
                                <button
                                    onClick={() => handleScrollLeft(firstRowRef)}
                                    className="pointer-events-auto z-10 relative bg-gradient-to-r bg-white shadow-lg hover:shadow-xl text-lg p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                                >
                                    <FaAngleLeft />
                                </button>
                                <button
                                    onClick={() => handleScrollRight(firstRowRef)}
                                    className="pointer-events-auto z-10 relative bg-gradient-to-r bg-white shadow-lg hover:shadow-xl text-lg p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                                >
                                    <FaAngleRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Second Row */}
            {recommendedProducts.length > 12 && (
                <div className="relative">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                        {/* <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-400 mr-3"></div>
                                <span className="text-gray-800 font-semibold text-lg">Khám phá thêm</span>
                                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-400 ml-3"></div>
                            </div>
                        </div> */}
                        
                        <div className="relative flex items-center">
                            <div
                                className="flex gap-6 flex-nowrap overflow-x-scroll scrollbar-none scroll-smooth pb-2"
                                ref={secondRowRef}
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {recommendedProducts.slice(12, 24).map((product, index) => (
                                    <div 
                                        key={product._id} 
                                        className="min-w-[220px] max-w-[240px] transform transition-all duration-300 hover:scale-105"
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
                                            <CardProduct data={product} loading={false} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full left-0 right-0 px-4 absolute hidden lg:flex justify-between pointer-events-none">
                                <button
                                    onClick={() => handleScrollLeft(secondRowRef)}
                                    className="pointer-events-auto z-10 relative bg-gradient-to-r bg-white shadow-lg hover:shadow-xl text-lg p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                                >
                                    <FaAngleLeft />
                                </button>
                                <button
                                    onClick={() => handleScrollRight(secondRowRef)}
                                    className="pointer-events-auto z-10 relative bg-gradient-to-r bg-white shadow-lg hover:shadow-xl text-lg p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                                >
                                    <FaAngleRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default RecommendedProducts;