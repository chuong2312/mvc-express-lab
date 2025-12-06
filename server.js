const express = require('express');
const app = express();
const path = require('path'); // <--- 1. MỚI THÊM: Thư viện path để xử lý đường dẫn thư mục public
const port = 3000;

// Kết nối Database
const connectDB = require('./src/config/db'); 
connectDB(); 

// Gọi Routes
const courseRoutes = require('./src/routes/courseRoutes');
const customerRoutes = require('./src/routes/customerRoutes'); // <--- 2. MỚI THÊM: Import route khách hàng vào

app.use(express.json()); 

// <--- 3. MỚI THÊM: Cấu hình thư mục chứa giao diện (HTML, CSS, JS, Ảnh)
// Dòng này giúp trình duyệt đọc được file trong thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng Routes API
app.use('/api/courses', courseRoutes);
app.use('/api/customers', customerRoutes); // <--- 4. MỚI THÊM: Kích hoạt đường dẫn API đăng ký (/api/customers/register)

// Thêm đoạn này vào để chỉ định rõ: Vào trang chủ là mở file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});