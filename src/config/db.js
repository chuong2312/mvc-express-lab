const mongoose = require('mongoose');

// Bước này để load biến từ file .env
require('dotenv').config(); 

const connectDB = async () => {
  try {
    // Nó sẽ tự tìm biến MONGO_URI trong file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB đã kết nối: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;