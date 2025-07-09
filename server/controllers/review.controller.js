
import ReviewModel from '../models/review.model.js'
import ProductModel from '../models/product.model.js'

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body
    const userId = req.userId


    // Tạo đánh giá mới
    const newReview = await ReviewModel.create({
      user: userId,
      product: productId,
      rating,
      comment
    })

    // Cập nhật sản phẩm
    const reviews = await ReviewModel.find({ product: productId })

    const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0)
    const averageRating = (totalRating / reviews.length).toFixed(1)

    await ProductModel.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviews: reviews.length
    })

    res.json({ success: true, message: "Đánh giá đã được gửi thành công" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: error.message })
  }
}

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body
    const reviews = await ReviewModel.find({ product: productId }).populate('user', 'name avatar')
    res.json({ success: true, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: error.message })
  }
}
