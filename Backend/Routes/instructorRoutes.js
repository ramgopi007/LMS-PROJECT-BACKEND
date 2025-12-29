const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer");

const {getInstructorProfile} = require('../controllers/InstructorController/instructorProfile');
const { instructorAuth } = require('../middlewares/instructorAuth');
const { createCourse } = require('../controllers/InstructorController/createCourse');
const { getMyCourses } = require('../controllers/InstructorController/getCourse');
const { updateCourse } = require('../controllers/InstructorController/updateCourse');
const { deleteCourse } = require('../controllers/InstructorController/deleteCourse');

const { addLesson } = require("../controllers/InstructorController/addLesson");
const { updateLesson } = require("../controllers/InstructorController/updateLesson");
const { deleteLesson } = require("../controllers/InstructorController/deleteLesson");
const { getLessons } = require("../controllers/InstructorController/getLessons");
const {uploadInstructorProfilePicture} = require("../controllers/InstructorController/profilePick");
const {getLessonById} = require("../controllers/InstructorController/getLessonById");

// GET Instructor Dashboard Profile
router.get("/me", instructorAuth, getInstructorProfile);

//Post Instructor Profile Picture
router.post("/upload-profile-picture",instructorAuth,upload.single("profile"),uploadInstructorProfilePicture);

// Create new course
router.post("/CreateCourse", instructorAuth, createCourse);

// Get all courses created by the instructor
router.get("/my-courses", instructorAuth, getMyCourses);
 
// Update a course
router.put("/courses/:id", instructorAuth, updateCourse);

// Delete a course
router.delete("/courses/:id", instructorAuth, deleteCourse);

// Add lesson with video
router.post("/courses/:courseId/addlessons",instructorAuth,upload.single("lessonVideo"),addLesson);

// Update lesson (optional video)
router.put("/lessons/:lessonId",instructorAuth,upload.single("lessonVideo"),updateLesson);

// Delete lesson
router.delete("/lessons/:lessonId",instructorAuth,deleteLesson);

// Get all lessons for a course
router.get("/courses/:courseId/lessons",instructorAuth, getLessons);

//Get Single Lesson for a course
router.get("/lessons/:lessonId", instructorAuth, getLessonById);
module.exports = router;

