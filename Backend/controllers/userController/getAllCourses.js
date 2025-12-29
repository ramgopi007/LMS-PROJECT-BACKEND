const Course = require("../../models/Course");

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "firstName lastName profilePicture");

        const formattedCourses = courses.map(course => {
            let thumb = course.thumbnail || "";
            
            // Only process the path if it's NOT a Base64 string
            if (thumb && !thumb.startsWith('data:image')) {
                // Convert Windows backslashes (\) to web forward slashes (/)
                thumb = thumb.replace(/\\/g, '/');
                
                // Ensure it starts with a leading slash /
                if (!thumb.startsWith('/')) {
                    thumb = '/' + thumb;
                }
            }

            return {
                ...course._doc,
                thumbnail: thumb,
                instructorName: course.instructor 
                    ? `${course.instructor.firstName} ${course.instructor.lastName}` 
                    : "Unknown Instructor"
            };
        });

        return res.json({ success: true, data: formattedCourses });
    } catch (err) {
        console.error("getAllCourses Error:", err);
        return res.status(500).json({ success: false, message: "Error fetching courses." });
    }
};

module.exports = { getAllCourses };