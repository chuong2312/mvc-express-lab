const jwt = require('jsonwebtoken');
// SỬA DÒNG NÀY: Trỏ đúng vào file customerModel.js
const Customer = require('../models/customerModel'); 

const protect = async (req, res, next) => {
    let token;

    // 1. Lấy token từ Header hoặc Cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
        } catch (error) {
            console.error("Lỗi header:", error);
        }
    } else if (req.cookies && req.cookies.jwt_token) {
        token = req.cookies.jwt_token;
    }

    // 2. Không có token -> Chặn
    if (!token) {
        return res.status(401).json({ success: false, message: 'Chưa đăng nhập!' });
    }

    try {
        // 3. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Tìm Customer trong DB (Sửa biến User -> Customer)
        req.user = await Customer.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại.' });
        }

        next(); // Cho phép đi tiếp

    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Token không hợp lệ!' });
    }
};

module.exports = { protect };