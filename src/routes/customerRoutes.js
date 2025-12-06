const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Khi ai đó gửi thư (POST) tới đường dẫn này thì gọi controller xử lý
router.post('/register', customerController.register);

module.exports = router;