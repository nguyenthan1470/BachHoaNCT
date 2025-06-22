import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId
        const { productId } = request.body

        if (!productId) {
            return response.status(402).json({
                message: "Provide productId",
                error: true,
                success: false
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if (checkItemCart) {
            return response.status(400).json({
                message: "Sản phẩm đã có trong giỏ hàng",
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })
        const save = await cartItem.save()

        const updateCartUser = await UserModel.updateOne({ _id: userId }, {
            $push: {
                shopping_cart: productId
            }
        })

        return response.json({
            data: save,
            message: "Sản phẩm được thêm thành công",
            error: false,
            success: true
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getCartItemController = async (req, res) => {
    try {
        const userId = req.userId

        const cartItem = await CartProductModel.find({
            userId: userId

        }).populate("productId")

        return res.json({
            data: cartItem,
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId
        
        const { _id, qty } = req.body

        if (!_id || !qty) {
            return res.status(400).json({
                message: "provide _id, qty"
            })
        }

        const updateCartItem = await CartProductModel.updateOne({
            _id: _id,
            userId: userId
        }, {
            quantity: qty
        })
        return res.json({
            message:"Cập nhậtnhật sản phẩm thành công! ",
            success: true,
            error: false,
            data: updateCartItem
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCartItemController = async(req,res)=>{
    try {
        const userId = req.userId //middleware
        const {_id} = req.body

        if (!_id) {
            return res.status(400).json({
                message : " provide_id",
                error: true,
                success: false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({
            _id: _id,
            userId: userId
            
        })

        return res.json({
            message: "Đã xoá sản phẩm khỏi giỏ hàng",
            error: false,
            success: true,
            data: deleteCartItem
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}