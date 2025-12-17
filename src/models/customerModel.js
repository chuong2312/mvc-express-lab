const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import thư viện mã hóa

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Thêm unique để không trùng email
  password: { type: String, required: true }, // <--- MỚI: Thêm trường password
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// --- MỚI: Tự động mã hóa mật khẩu trước khi lưu ---
customerSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return ;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

// --- MỚI: Hàm kiểm tra mật khẩu khi đăng nhập ---
customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);