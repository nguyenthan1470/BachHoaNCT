import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from "../components/Loading"
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6"
import { FaShoppingCart } from "react-icons/fa"

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [isAvailableCart, setIsAvailableCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartItemDetails, setCartItemDetails] = useState()

  // Handle adding item to cart with specified quantity
  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Validate quantity against stock
    if (data.quantity < 1) {
      toast.error("Số lượng phải lớn hơn hoặc bằng 1!")
      return
    }
    if (data.quantity > data.stock) {
      toast.error(`Chỉ còn ${data.stock} sản phẩm trong kho!`)
      return
    }

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
          quantity: data.quantity // Use quantity from ProductDisplayPage
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle quantity increase
  const increaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (qty >= data.stock) {
      toast.error(`Chỉ còn ${data.stock} sản phẩm trong kho!`)
      return
    }

    const newQty = qty + 1
    const response = await updateCartItem(cartItemDetails?._id, newQty)

    if (response.success) {
      
      setQty(newQty)
    }
  }

  // Handle quantity decrease
  const decreaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (qty <= 1) {
      deleteCartItem(cartItemDetails?._id)
    } else {
      const newQty = qty - 1
      const response = await updateCartItem(cartItemDetails?._id, newQty)

      if (response.success) {
       
        setQty(newQty)
      }
    }
  }

  // Handle manual quantity input
  const handleQuantityChange = (newQuantity) => {
    const parsedQuantity = Math.floor(Number(newQuantity))

    if (isNaN(parsedQuantity)) {
      toast.error("Vui lòng nhập số lượng hợp lệ!")
      return
    }

    if (parsedQuantity < 1) {
      toast.error("Số lượng phải lớn hơn hoặc bằng 1!")
      setQty(1)
    } else if (parsedQuantity > data.stock) {
      toast.error(`Chỉ còn ${data.stock} sản phẩm trong kho!`)
      setQty(data.stock)
    } else {
      setQty(parsedQuantity)
      updateCartItem(cartItemDetails?._id, parsedQuantity).then((response) => {
        if (response.success) {
          toast.success("Đã cập nhật số lượng sản phẩm")
        }
      })
    }
  }

  // Check if item is in cart and update qty
  useEffect(() => {
    const checkingItem = cartItem.some(item => item.productId._id === data._id)
    setIsAvailableCart(checkingItem)

    const product = cartItem.find(item => item.productId._id === data._id)
    setCartItemDetails(product)
    setQty(product?.quantity || 0)
  }, [data, cartItem])

  return (
    <div className='w-full flex justify-center'>
      {isAvailableCart ? (
        <div className='flex w-full h-full space-x-2'>
          <button
            onClick={decreaseQty}
            className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded-lg flex items-center justify-center'
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="min-w-[60px] flex-1 text-center border rounded-md p-1 font-semibold "
            min="1"
            max={data.stock}
            aria-label="Quantity"
          />
          <button
            onClick={increaseQty}
            className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded-lg flex items-center justify-center'
            aria-label="Increase quantity"
            disabled={qty >= data.stock}
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold text-sm flex items-center justify-center gap-3 p-4'
          aria-label="Add to cart"
        >
          {loading ? <Loading /> : (
            <>
              <FaShoppingCart className="text-base" />
              Thêm vào giỏ
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default AddToCartButton