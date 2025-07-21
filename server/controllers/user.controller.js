import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import generateAccessToken from '../utils/generatedAccessToken.js'
import generateRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'



//register controller

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Cung cấp email, tên, mật khẩu",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (user) {
            return response.json({
                message: "Đã đăng ký email",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Xác minh email từ Bách Hóa NCT",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        return response.json({
            message: "Người dùng đã đăng ký thành công",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//verify Email Controller

export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body

        const user = await UserModel.findOne({ _id: code })

        if (!user) {
            return res.status(400).json({
                message: "Mã không hợp lệ",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return res.json({
            message: "Xác minh email đã xong",
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

//login controller

export async function loginController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Cung cấp email và mật khẩu",
                error: true,
                success: false
            })
        }


        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Người dùng chưa đăng ký",
                error: true,
                success: false
            })
        }
        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Liên hệ với Admin",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({
                message: "Kiểm tra mật khẩu của bạn",
                error: true,
                success: false
            })
        }

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', accessToken, cookiesOption)
        res.cookie('refreshToken', refreshToken, cookiesOption)

        return res.json({
            message: "Đăng nhập thành công",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//logout controller
export async function logoutController(req, res) {
    try {

        const userid = req.userId

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }


        res.clearCookie("accessToken", cookiesOption),
            res.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })

        return res.json({
            message: "Đăng xuất thành công",
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

//upload user avatar 
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId; // auth middleware
        const image = req.file; // multer middleware

        const upload = await uploadImageCloudinary(image);

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        });

        return res.json({
            message: "Tải lên hồ sơ",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//update user details
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId //auth middleware
        const { name, email, mobile, password } = req.body

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })

        })
        return res.json({
            message: "Đã cập nhật thành công",
            error: false,
            success: true,
            data: updateUser
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//forgot password no login
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email không khả dụng",
                error: true,
                success: false
            })
        }


        const otp = generatedOtp()

        const expireTime = new Date() + 60 * 60 * 1000 // 1hr


        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: " Quên mật khẩu từ Bách Hóa NCT",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return res.json({
            message: " Kiểm tra email của bạn",
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


//verify forgot password otp 


export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Vui lòng cung cấp đầy đủ: địa chỉ email và mã xác thực",
                error: true,
                success: false
            });
        }

        // Truy vấn user từ database trước khi sử dụng
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email không tồn tại",
                error: true,
                success: false
            });
        }

        const currentTime = new Date().toISOString();

        if (user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "Mã xác thực đã hết hạn",
                error: true,
                success: false
            });
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Mã xác thực không chính xác",
                error: true,
                success: false
            });
        }

        // Nếu mã xác thực hợp lệ và chưa hết hạn
        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        });

        return res.json({
            message: "Xác minh mã thành công",
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
}


//reset the password
export async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Vui lòng cung cấp đầy đủ: email, mật khẩu mới và xác nhận mật khẩu",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email không tồn tại",
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Mật khẩu mới và xác nhận mật khẩu không trùng khớp",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        });

        return res.json({
            message: "Đặt lại mật khẩu thành công",
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
}



// refresh token controller
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]; // [Bearer token]

        if (!refreshToken) {
            return response.status(401).json({
                message: "Token không hợp lệ",
                error: true,
                success: false
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if (!verifyToken) {
            return response.status(401).json({
                message: "Token đã hết hạn",
                error: true,
                success: false
            });
        }

        const userId = verifyToken?.id;

        const newAccessToken = await generateAccessToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie('accessToken', newAccessToken, cookiesOption);

        return response.json({
            message: "Tạo mới access token thành công",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}



//get login user details 
export async function userDetails(req, res) {
    try {
        const userId = req.userId;

        console.log(userId);

        const user = await UserModel.findById(userId).select('-password -refresh_token');

        return res.json({
            message: 'Thông tin người dùng',
            data: user,
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: true,
            success: false
        });
    }
}
