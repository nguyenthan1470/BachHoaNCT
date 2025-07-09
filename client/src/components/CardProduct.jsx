import React, { useState } from 'react'
import { DisplayPriceInVietnamDong } from '../utils/DisplayPriceInVietnamDong'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton.jsx'

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [loading, setLoading] = useState(false)
  const discountedPrice = pricewithDiscount(data.price, data.discount || 0)
  const hasDiscount = Boolean(data.discount)

  return (
    <Link
      to={url}
      className="group block border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer min-w-36 lg:min-w-52"
    >
      {/* Image Container */}
      <div className="relative w-full h-32 lg:h-40 overflow-hidden rounded-t-lg bg-gray-50">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
            -{data.discount}%
          </div>
        )}
        {data.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
            <span className="text-white text-sm font-semibold">Hết hàng</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between h-[170px] lg:h-[200px]">
        {/* Sales and Discount Info */}
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-green-100 text-green-700 text-xs px-2 py-[2px] rounded-full font-semibold select-none">
            Đã bán {data.sold}
          </span>
          {hasDiscount && (
            <span className="text-green-700 bg-green-100 px-2 py-[2px] text-xs rounded-full font-semibold select-none">
              {data.discount}% Giảm giá
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-medium text-sm lg:text-base line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
          {data.name}
        </h3>

        {/* Unit */}
        <p className="text-gray-500 text-xs lg:text-sm mb-3">{data.unit}</p>

        {/* Price and AddToCart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {DisplayPriceInVietnamDong(data.price)}
              </span>
            )}
            <span className="font-semibold text-gray-900 text-base">
              {DisplayPriceInVietnamDong(discountedPrice)}
            </span>
          </div>

          <div>
            {data.stock === 0 ? (
              <button
                disabled
                className="cursor-not-allowed px-3 py-1 text-xs border border-gray-300 rounded text-red-500"
              >
                Hết hàng
              </button>
            ) : (
              <AddToCartButton data={data} />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CardProduct
