const express = require('express');
const router = express.Router();

const {instructorAuth} = require('../middlewares/instructorAuth');
const {createCourse} = require('../controllers/InstructorController/createCourse');
const {getMyCourses} = require('../controllers/InstructorController/getCourse');
const {updateCourse} = require('../controllers/InstructorController/updateCourse');
const {deleteCourse} = require('../controllers/InstructorController/deleteCourse');
const {addLesson} = require('../controllers/InstructorController/addLesson');

// Create new course
router.post("/courses", instructorAuth, createCourse);

// Get all courses created by the instructor
router.get("/my-courses", instructorAuth, getMyCourses);

// Update a course
router.put("/courses/:id", instructorAuth, updateCourse);

// Delete a course
router.delete("/courses/:id", instructorAuth, deleteCourse);

//upload the lessons and videos 
router.post("/courses/:courseId/add-lesson",instructorAuth,upload.single("video"),addLesson);

module.exports = router;

