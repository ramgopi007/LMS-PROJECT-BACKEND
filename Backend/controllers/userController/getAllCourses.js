const Course = require("../models/Course");

/*  1) GET /courses - Return all courses (public) */

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "firstName lastName profilePicture");
        return res.json({ success: true, data: courses });
    } catch (err) {
        console.error("getAllCourses:", err);
        return res.status(500).json({ success: false, message: "Error fetching courses." });
    }
};

module.exports = {getAllCourses};