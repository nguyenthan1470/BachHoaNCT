import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const {fullname,email, address_line, city, state, country, pincode, mobile, district } = req.body;

        const createAddress = await AddressModel({
            address_line,
            city,
            state,
            country,
            pincode: pincode || "",
            district,
            mobile,
            fullname,
            email,
            userId: userId
        })
        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }

        })

        return res.json({
            message: "Đã tạo địa chỉ thành công",
            error: false,
            success: true,
            data: saveAddress
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 })

        return res.json({
            data: data,
            message: " List of Address",
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

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const { _id,fullname,email, address_line, district, city, state, country, pincode, mobile } = req.body;

        const updateAddress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
            _id,
            address_line,
            district,
            city,
            state,
            country,
            pincode,
            mobile,
            fullname,
            email
        })

        return res.json({
            message: "Đã cập nhật địa chỉ thành công",
            error: false,
            success: true,
            data: updateAddress
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body

        const disableAddress = await AddressModel.updateOne({ _id: _id, userId }, {
            status: false
        })

        return res.json({
            message: "Đã xóa địa chỉ ",
            error: false,
            success: true,
            data: disableAddress
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        }

        )
    }
}