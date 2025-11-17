const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/userAuth");
const {getAllCourses} = require("../controllers/userController/getAllCourses");
const {getCourseDetails} = require("../controllers/userController/getCourseDetails");
const {enrollCourse} =require("../controllers/userController/enrollCourse");
const {getMyEnrolledCourses}=require("../controllers/userController/getMyEnrolledCourses");
const {getCourseLessons}=require("../controllers/userController/getCourseLessons");
const {getSingleLesson}=require("../controllers/userController/getSingleLesson");
const {updateUserProfile}=require("../controllers/userController/updateUserProfile");


// Public
router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourseDetails);

// Protected (student)
router.post("/courses/:courseId/enroll", userAuth, enrollCourse);
router.get("/my-courses", userAuth, getMyEnrolledCourses);
router.get("/courses/:courseId/lessons", userAuth, getCourseLessons);
router.get("/lessons/:lessonId", userAuth, getSingleLesson);
router.put("/profile", userAuth, updateUserProfile);

module.exports = router;
