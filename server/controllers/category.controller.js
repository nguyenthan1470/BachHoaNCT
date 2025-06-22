import CategoryModel from "../models/category.model.js"
import SubCategoryModel from "../models/subCategory.model.js"
import ProductModel from "../models/product.model.js"


export const AddCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body

        if (!name || !image) {
            return res.status(400).json({
                message: "Nhập các trường bắt buộc",
                error: true,
                success: false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if (!saveCategory) {
            return res.status(500).json({
                message: "Không thể tạo",
                error: true,
                success: false
            })
        }

        return res.json({
            message: "Thêm danh mục thành công",
            data: saveCategory,
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

export const getCategoryController = async (request, response) => {
    try {
        const data = await CategoryModel.find().sort({ createAt: -1 })

        return response.json({
            data: data,
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

export const updateCategoryController = async (req, res) => {
    try {
        const { _id, name, image } = req.body
        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name,
            image
        })
        return res.json({
            message: "Cập nhật danh mục",
            success: true,
            error: false,
            data: update
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        const checkSubCategory = await SubCategoryModel.find({
            category: {
                "$in": [_id]
            }

        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]
            }

        }).countDocuments()

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: "Danh mục đã được sử dụng không thể xóa ",
                error: true,
                success: false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id: _id })

        return res.json({
            message: "Xóa danh mục thành công",
            data: deleteCategory,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

