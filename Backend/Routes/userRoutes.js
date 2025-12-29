const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {userAuth} = require("../middlewares/userAuth");
const {getAllCourses} = require("../controllers/userController/getAllCourses");
const {getCourseDetails} = require("../controllers/userController/getCourseDetails");
const {enrollCourse} =require("../controllers/userController/enrollCourse");
const {getMyEnrolledCourses}=require("../controllers/userController/getMyEnrolledCourses");
const {getCourseLessons}=require("../controllers/userController/getCourseLessons");
const {getSingleLesson}=require("../controllers/userController/getSingleLesson");
const {updateUserProfile}=require("../controllers/userController/updateUserProfile");
const {getStudentProfile } = require("../controllers/userController/getStudentProfile");
const {uploadStudentProfilePicture} = require("../controllers/userController/profilePick");

// Public
router.get("/me",userAuth, getStudentProfile);
router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourseDetails);

//Post Student Profile Picture
router.post("/upload-profile-picture",userAuth,upload.single("profile"),uploadStudentProfilePicture);

// Protected (student)
router.post("/courses/:courseId/enroll", userAuth, enrollCourse);
router.get("/my-courses", userAuth, getMyEnrolledCourses);
router.get("/courses/:courseId/lessons", userAuth, getCourseLessons);
router.get("/lessons/:lessonId", userAuth, getSingleLesson);
router.put("/profile", userAuth, updateUserProfile);

module.exports = router;
