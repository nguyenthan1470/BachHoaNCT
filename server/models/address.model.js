import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    address_line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    district: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
        default: ""
    },
    country: {
        type: String,

    },
    mobile: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });


const AddressModel = mongoose.model('address', addressSchema)

export default AddressModel;

