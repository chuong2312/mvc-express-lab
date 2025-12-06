const Customer = require('../models/customerModel');

exports.register = async (req, res) => {
  try {
    // Lấy thông tin từ form
    const { name, email, phone } = req.body;
    // Ghi log để kiểm tra
    console.log("📩 Có người đăng ký mới:", name, email);

    // Tạo khách hàng mới
    const newCustomer = new Customer({ name, email, phone });

    // Lưu vào MongoDB
    await newCustomer.save();

    // Trả lời về cho web biết là OK rồi
    res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};