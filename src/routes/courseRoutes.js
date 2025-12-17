const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
// 1. Import cái "Cổng bảo vệ" vào
const { protect } = require('../middleware/authMiddleware');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
// 2. Chèn 'protect' vào giữa đường dẫn và hàm xử lý
// Nghĩa là: Muốn vào 'createCourse', phải qua ải 'protect' trước
router.post('/', protect, courseController.createCourse);
router.post('/', courseController.createCourse);

router.put('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);

module.exports = router;