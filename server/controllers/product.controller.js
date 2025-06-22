import ProductModel from "../models/product.model.js";

export const createProductController = async (req, res) => {
    try {
        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details

        } = req.body;

        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description) {
            return response.status(400).json({
                message: "Nhập các trường bắt buộc",
                error: true,
                success: false
            })
        }

        const product = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
        })

        const saveProduct = await product.save()
        return res.json({
            message: "Sản phẩm đã được tạo thành công",
            data: saveProduct,
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

export const getProductController = async (req, res) => {
    try {
        let { page, limit, search } = req.body

        if (!page) {
            page = 2
        }

        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search

            }
        } : {

        }

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query).sort({ createAt: -1 }).skip(skip).limit(limit).populate("category subCategory"),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: "Dữ liệu sản phẩm",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                message: " provide category id",
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: { $in: id }
        }).limit(15)

        return res.json({
            message: "danh mục sản phẩm",
            data: product,
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

export const getProductByCategoryAndSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId, page, limit } = req.body
        if (!categoryId || !subCategoryId) {
            return res.status(400).json({
                message: "Cung cấp Id danh mục và Id danh mục phụ" ,
                error: true,
                success: false

            })

        }

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }

        const query = {
            category: { $in: categoryId },
            subCategory: { $in: subCategoryId }
        }
        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createAt: -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: 'Danh sách sản phẩm ',
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body

        const product = await ProductModel.findOne({ _id: productId })

        return res.json({
            message: "Chi tiết sản phẩm",
            data: product,
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

//update Product

export const updateProductDetails = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "provide product _id",
                error: true,
                success: false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id: _id }, {
            ...req.body
        })

        return res.json({
            message: "Đã cập nhật thành công ",
            data: updateProduct,
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

//delete product 
export const deleteProductDetails = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "provide _id",
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({ _id: _id })

        return res.json({
            message: "Xóa thành công",
            error: false,
            success: true,
            data: deleteProduct
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// search product

export const searchProduct = async (req, res) => {
    try {
        let { search, page, limit } = req.body

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {

        }
        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: "Dữ liệu sản phẩm",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount/limit),
            page: page,
            limit: limit
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}