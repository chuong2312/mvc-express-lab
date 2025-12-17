const Customer = require('../models/customerModel');
const jwt = require('jsonwebtoken');

// Hàm tạo Token (Vé vào cửa)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// 1. ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body; // <--- MỚI: Lấy thêm password

    // Kiểm tra email trùng
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
        return res.status(400).json({ success: false, message: 'Email này đã được dùng!' });
    }

    // Tạo khách hàng mới (Password sẽ tự mã hóa nhờ Model ở Bước 1)
    const newCustomer = await Customer.create({ name, email, phone, password });

    if (newCustomer) {
        // Tạo token luôn để user đăng nhập ngay
        const token = generateToken(newCustomer._id);
        
        // Gửi token vào Cookie (để trình duyệt tự lưu)
        res.cookie('jwt_token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        res.status(201).json({ 
            success: true, 
            message: 'Đăng ký thành công!',
            token: token,
            data: { id: newCustomer._id, name: newCustomer.name, email: newCustomer.email }
        });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// 2. ĐĂNG NHẬP (MỚI THÊM)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });

        // Kiểm tra mật khẩu
        if (customer && (await customer.matchPassword(password))) {
            const token = generateToken(customer._id);
            
            // Gửi token vào Cookie
            res.cookie('jwt_token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

            res.json({
                success: true,
                message: 'Đăng nhập thành công!',
                token: token,
                data: { id: customer._id, name: customer.name, email: customer.email }
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
    }
};