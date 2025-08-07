import ProductModel from "../models/product.model.js";

export const getProductRecommendations = async (req, res) => {
    try {
        const { productIds = [], limit = 10 } = req.body;
        
        if (!productIds.length) {
            return res.json({
                message: "Không có sản phẩm để đề xuất",
                data: [],
                error: false,
                success: true
            });
        }

        // Get products that were added to cart
        const cartProducts = await ProductModel.find({
            _id: { $in: productIds }
        }).populate('category subCategory');

        if (!cartProducts.length) {
            return res.json({
                message: "Không tìm thấy sản phẩm",
                data: [],
                error: false,
                success: true
            });
        }

        // Extract categories and subcategories from cart products
        const categories = [...new Set(cartProducts.flatMap(p => p.category.map(c => c._id)))];
        const subCategories = [...new Set(cartProducts.flatMap(p => p.subCategory.map(sc => sc._id)))];
        
        // Calculate price range
        const prices = cartProducts.map(p => p.price);
        const minPrice = Math.min(...prices) * 0.8; // 20% lower
        const maxPrice = Math.max(...prices) * 1.2; // 20% higher

        // Find similar products
        const similarProducts = await ProductModel.find({
            $and: [
                { _id: { $nin: productIds } }, // Exclude already cart products
                {
                    $or: [
                        { category: { $in: categories } },
                        { subCategory: { $in: subCategories } }
                    ]
                },
                { price: { $gte: minPrice, $lte: maxPrice } },
                { publish: true }
            ]
        })
        .populate('category subCategory')
        .sort({ sold: -1, createdAt: -1 }) // Sort by popularity and newest
        .limit(limit);

        // If not enough similar products, add products from same categories
        if (similarProducts.length < limit) {
            const additionalProducts = await ProductModel.find({
                _id: { $nin: [...productIds, ...similarProducts.map(p => p._id)] },
                $or: [
                    { category: { $in: categories } },
                    { subCategory: { $in: subCategories } }
                ],
                publish: true
            })
            .populate('category subCategory')
            .sort({ sold: -1 })
            .limit(limit - similarProducts.length);

            similarProducts.push(...additionalProducts);
        }

        return res.json({
            message: "Sản phẩm đề xuất",
            data: similarProducts,
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get trending products based on cart additions
export const getTrendingProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.body;

        const trendingProducts = await ProductModel.find({
            publish: true
        })
        .populate('category subCategory')
        .sort({ sold: -1, createdAt: -1 })
        .limit(limit);

        return res.json({
            message: "Sản phẩm thịnh hành",
            data: trendingProducts,
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
