import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import UserModel from "../models/user.model.js"; 

const GG_CLIENT_ID = process.env.GG_CLIENT_ID;
const SECRET_KEY_ACCESS_TOKEN = process.env.SECRET_KEY_ACCESS_TOKEN;
const SECRET_KEY_REFRESH_TOKEN = process.env.SECRET_KEY_REFRESH_TOKEN;

const client = new OAuth2Client(GG_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) {
      return res.status(400).json({ success: false, message: "Thiếu mã token từ Google" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GG_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 🔍 Kiểm tra user đã tồn tại chưa
    let user = await UserModel.findOne({ email });

    if (!user) {
      // 🆕 Nếu chưa có thì tạo mới user trong MongoDB
      user = await new UserModel({
        name,
        email,
        avatar: picture,
        verify_email: true,
        status: "active",
        role: "customer"
      }).save();
    }

    // 🔑 Tạo accessToken có chứa _id
    const accessToken = jwt.sign(
      { id: user._id }, // 👈 thêm đúng id từ MongoDB
      SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id }, // 👈 giống trên
      SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Google login thành công",
      data: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({
      success: false,
      message: "Google login failed",
      error: error.message
    });
  }
};

export default googleLogin;
