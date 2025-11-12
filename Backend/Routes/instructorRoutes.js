const express = require('express');
const router = express.Router();

const {instructorAuth} = require('../middlewares/instructorAuth');
const {createCourse} = require('../controllers/InstructorController/createCourse');
const {getMyCourses} = require('../controllers/InstructorController/getCourse');

// Create new course
router.post("/courses", instructorAuth, createCourse);

// Get all courses created by the instructor
router.get("/my-courses", instructorAuth, getMyCourses);

module.exports = router;

