const courses = require('../models/courseModel');

exports.getAllCourses = (req, res) => {
    res.status(200).json({ success: true, count: courses.length, data: courses });
};

exports.getCourseById = (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.status(200).json({ success: true, data: course });
};

exports.createCourse = (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'Thiếu tên hoặc giá' });
    const newId = courses.length > 0 ? courses[courses.length - 1].id + 1 : 1;
    courses.push({ id: newId, name, price });
    res.status(201).json({ success: true, data: { id: newId, name, price } });
};

exports.updateCourse = (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    course.name = req.body.name || course.name;
    course.price = req.body.price || course.price;
    res.status(200).json({ success: true, data: course });
};

exports.deleteCourse = (req, res) => {
    const id = parseInt(req.params.id);
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    courses.splice(index, 1);
    res.status(200).json({ success: true, message: 'Đã xóa' });
};