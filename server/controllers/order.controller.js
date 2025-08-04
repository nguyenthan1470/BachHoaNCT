import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        if (!addressId) {
            return response.status(400).json({
                message: "Vui lòng chọn địa chỉ trước khi thanh toán",
                error: true,
                success: false
            });
        }

        const payload = list_items.map(el => {
            // Calculate discounted price per product
            const discountedPrice = pricewithDiscount(el.productId.price, el.productId.discount) * el.quantity;

            return ({
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    image: el.productId.image,
                    quantity: el.quantity,
                    price: discountedPrice,
                },
                paymentId: "",
                payment_status: "Thanh toán khi nhận",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        // Cập nhật số lượng đã bán cho từng sản phẩm
        for (const el of list_items) {
            await ProductModel.findByIdAndUpdate(el.productId._id, {
                $inc: { sold: el.quantity }
            })
        }

        ///remove from the cart
        await CartProductModel.deleteMany({ userId: userId })
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        return response.json({
            message: "Đặt hàng thành công",
            error: false,
            success: true,
            data: generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const pricewithDiscount = (price, dis = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request, response) {
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        if (!addressId) {
            return response.status(400).json({
                message: "Vui lòng chọn địa chỉ trước khi thanh toán",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId)

        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: 'vnd',
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: pricewithDiscount(item.productId.price, item.productId.discount)
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = []

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)

            const payload = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images,
                    quantity: item.quantity


                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            }

            productList.push(payload)
        }
    }

    return productList
}


export async function webhookStripe(request, response) {
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event", event)

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            const userId = session.metadata.userId
            const orderProduct = await getOrderProductItems(
                {
                    lineItems: lineItems,
                    userId: userId,
                    addressId: session.metadata.addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                })

            const order = await OrderModel.insertMany(orderProduct)

            // Cập nhật số lượng đã bán cho từng sản phẩm
            for (const item of order) {
                await ProductModel.findByIdAndUpdate(item.productId, {
                    $inc: { sold: item.product_details.quantity }
                })
            }

            console.log(order)
            if (Boolean(order[0])) {
                await UserModel.findByIdAndUpdate(userId, {
                    shopping_cart: []
                })
                await CartProductModel.deleteMany({ userId: userId })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
}


export async function getOrderDetailsController(req, res) {
    try {
        const userId = req.userId

        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address')

        return res.json({
            message: "order list",
            data: orderlist,
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






export const getSalesStatistics = async (req, res) => {
    try {
        const { from, to } = req.query

        const match = {
            createdAt: { $gte: new Date(from), $lte: new Date(to) },
            payment_status: { $ne: "" }
        }

        // Doanh thu theo tháng
        const revenueByMonth = await OrderModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalRevenue: { $sum: "$totalAmt" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        // Top sản phẩm
        const topProducts = await OrderModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$productId",
                    totalSold: { $sum: "$product_details.quantity" },
                    revenue: { $sum: "$totalAmt" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    name: "$product.name",
                    totalSold: 1,
                    revenue: 1
                }
            }
        ])

        // Phân bố danh mục sản phẩm
        const categoryDistribution = await OrderModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },

            // Ép kiểu categoryId từ string sang ObjectId
            {
                $addFields: {
                    categoryObjectId: {
                        $cond: {
                            if: { $eq: [{ $type: "$product.categoryId" }, "string"] },
                            then: { $toObjectId: "$product.categoryId" },
                            else: "$product.categoryId"
                        }
                    }
                }
            },

            {
                $group: {
                    _id: "$categoryObjectId",
                    totalSold: { $sum: "$product_details.quantity" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    name: "$category.name",
                    value: "$totalSold"
                }
            }
        ])


        // Khách hàng mới trong tháng
        const newCustomers = await UserModel.countDocuments({
            createdAt: { $gte: new Date(from), $lte: new Date(to) }
        })

        // Tỷ lệ hoàn thành đơn hàng (tính tương đối đơn giản)
        const totalOrders = await OrderModel.countDocuments({ createdAt: { $gte: new Date(from), $lte: new Date(to) } })
        const completedOrders = await OrderModel.countDocuments({ createdAt: { $gte: new Date(from), $lte: new Date(to) }, payment_status: { $ne: "" } })
        const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

        res.json({
            success: true,
            revenueByMonth,
            topProducts,
            categoryDistribution,
            newCustomers,
            completionRate
        })
    } catch (err) {
        console.error("getSalesStatistics error:", err)
        res.status(500).json({ success: false, message: "Lỗi server", err })
    }
    
}