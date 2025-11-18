const mongoose = require("mongoose");
const User = require("../../models/signUpSchema");
const Lesson = require("../../models/Lesson");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getCourseLessons = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;

        if (!isValidObjectId(courseId))
            return res.status(400).json({ success: false, message: "Invalid course id." });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const enrolled = Array.isArray(user.enrolledCourses) && user.enrolledCourses.some(c => c.toString() === courseId);
        if (!enrolled) return res.status(403).json({ success: false, message: "You are not enrolled in this course." });

        // 🌟 New: Sort by the 'order' field
        const lessons = await Lesson.find({ course: courseId })
            .select("title description order duration videoUrl")
            .sort({ order: 1 }); // Sort by lesson order

        return res.json({ success: true, data: lessons });

    } catch (err) {
        console.error("getCourseLessons:", err);
        return res.status(500).json({ success: false, message: "Error fetching lessons." });
    }
};

module.exports = { getCourseLessons };