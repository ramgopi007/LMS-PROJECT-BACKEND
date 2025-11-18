const mongoose = require("mongoose");
const User = require("../../models/signUpSchema");
const Course = require("../../models/Course");
const CourseProgress = require("../../models/progressSchema"); // Assuming you created this model

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    if (!isValidObjectId(courseId))
      return res.status(400).json({ success: false, message: "Invalid course id." });

    const [user, course] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId)
    ]);

    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    
    // Check if already enrolled (Check both arrays for safety/consistency)
    const alreadyEnrolled = 
        user.enrolledCourses.some((c) => c.toString() === courseId) ||
        course.studentsEnrolled.some((u) => u.toString() === userId);

    if (alreadyEnrolled) 
        return res.status(400).json({ success: false, message: "Already enrolled in this course." });

    // 🌟 New: Perform updates in parallel
    const updateOps = [
        // 1. Add course to user's enrolledCourses
        User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } }),
        // 2. Add user to course's studentsEnrolled
        Course.findByIdAndUpdate(courseId, { $push: { studentsEnrolled: userId } }),
        // 3. Create a new CourseProgress document
        CourseProgress.create({
            course: courseId,
            user: userId,
            completedLessons: [], // Start with empty array
            completionPercentage: 0,
        })
    ];

    await Promise.all(updateOps);

    return res.json({ success: true, message: "Enrolled successfully and progress tracking started.", courseId });
  } catch (err) {
    console.error("enrollCourse:", err);
    return res.status(500).json({ success: false, message: "Error enrolling in course." });
  }
};

module.exports = { enrollCourse };