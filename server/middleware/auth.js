import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Lấy token từ cookie hoặc header
    const token = req.cookies.accessToken || req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Bạn cần đăng nhập',
        error: true,
        success: false,
      });
    }

    // Xác minh token (không cần await vì jwt.verify là đồng bộ)
    let decode;
    try {
      decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    } catch (jwtError) {
      return res.status(401).json({
        message: 'Bạn cần đăng nhập',
        error: true,
        success: false,
        details: jwtError.message,
      });
    }

    if (!decode || !decode.id) {
      return res.status(401).json({
        message: 'Thông tin người dùng không hợp lệ trong token',
        error: true,
        success: false,
      });
    }

    // Gán userId vào request
    req.userId = decode.id;
    console.log('Authenticated userId:', req.userId); // Debug

    next();
  } catch (error) {
    console.error('Authentication error:', error.message); // Log lỗi server
    return res.status(500).json({
      message: error.message || 'Lỗi máy chủ nội bộ',
      error: true,
      success: false,
    });
  }
};

export default auth;