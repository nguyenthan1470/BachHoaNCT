import AxiosToastError from "../../client/src/utils/AxiosToastError.js";
import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController = async (request, response) => {
    try {
        const { name, image, category } = request.body

        if (!name || !image || !category[0]) {
            return response.status(400).json({
                message: "Cung cấp đầy đủ tên, hình ảnh, danh mục",
                error: true,
                success: false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        return response.json({
            message: "Danh mục phụ đã được tạo",
            data: save,
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

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategoryModel.find().sort({ createdAt: -1 }).populate('category')
        return res.json({
            message: "Dữ liệu danh mục phụ",
            data: data,
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

export const updateSubCategoryController = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body
        const checkSub = await SubCategoryModel.findById(_id)

        if (!checkSub) {
            return res.status(400).json({
                message: "Kiểm tra _id của bạn",
                error: error,
                success: false
            })
        }
        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
            name,
            image,
            category
        })

        return res.json({
            message: 'Cập nhật thành công',
            data: updateSubCategory,
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

export const deleteSubCategoryController = async (req, res) => {
    try {
        const { _id } = req.body
        console.log("Id",_id)
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        return res.json({
            message: "Xóa thành công",
            data: deleteSub,
            error: false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}